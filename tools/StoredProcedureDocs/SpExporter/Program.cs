// Extrae el código fuente (CREATE/ALTER) de los stored procedures de SQL Server
// hacia archivos .sql versionados en el repositorio, y compara contra la lista de
// SPs referenciados por el backend (.NET) para detectar huérfanos o faltantes.
//
// Uso:
//   dotnet run --project tools/StoredProcedureDocs/SpExporter -- ^
//     --connection-string "Server=...;Database=...;User Id=...;Password=...;TrustServerCertificate=true;" ^
//     --known-procedures documentacion/stored-procedures/known-procedures.txt ^
//     --out documentacion/stored-procedures
//
// La cadena de conexión también puede pasarse por variable de entorno
// SP_EXPORTER_CONNECTION_STRING para no dejarla en el historial de la shell.
// El proceso es de solo lectura (consulta sys.procedures / sys.sql_modules / sys.parameters).

using System.Text;
using Microsoft.Data.SqlClient;

var options = CliOptions.Parse(args);
if (options is null)
{
    return 1;
}

string? connectionString = options.ConnectionString
    ?? Environment.GetEnvironmentVariable("SP_EXPORTER_CONNECTION_STRING");

if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.Error.WriteLine("Falta la cadena de conexión. Use --connection-string o la variable de entorno SP_EXPORTER_CONNECTION_STRING.");
    return 1;
}

var sqlOutDir = Path.Combine(options.OutDir, "sql");
Directory.CreateDirectory(sqlOutDir);

var knownProcedures = LoadKnownProcedures(options.KnownProceduresPath);

Console.WriteLine("Conectando a la base de datos...");
var procedures = new List<ProcedureInfo>();

await using (var connection = new SqlConnection(connectionString))
{
    await connection.OpenAsync();

    const string procQuery = """
        SELECT s.name AS SchemaName,
               p.name AS ProcName,
               p.object_id AS ObjectId,
               p.create_date AS CreateDate,
               p.modify_date AS ModifyDate,
               m.definition AS Definition
        FROM sys.procedures p
        JOIN sys.schemas s ON s.schema_id = p.schema_id
        JOIN sys.sql_modules m ON m.object_id = p.object_id
        ORDER BY s.name, p.name;
        """;

    await using (var cmd = new SqlCommand(procQuery, connection))
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            procedures.Add(new ProcedureInfo(
                SchemaName: reader.GetString(0),
                ProcName: reader.GetString(1),
                ObjectId: reader.GetInt32(2),
                CreateDate: reader.GetDateTime(3),
                ModifyDate: reader.GetDateTime(4),
                Definition: reader.IsDBNull(5) ? string.Empty : reader.GetString(5)));
        }
    }

    Console.WriteLine($"{procedures.Count} stored procedures encontrados en la base de datos.");

    const string paramQuery = """
        SELECT name, TYPE_NAME(user_type_id) AS TypeName, max_length, precision, scale, is_output
        FROM sys.parameters
        WHERE object_id = @ObjectId
        ORDER BY parameter_id;
        """;

    foreach (var proc in procedures)
    {
        await using var cmd = new SqlCommand(paramQuery, connection);
        cmd.Parameters.AddWithValue("@ObjectId", proc.ObjectId);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            proc.Parameters.Add(new ParameterInfo(
                Name: reader.GetString(0),
                TypeName: reader.IsDBNull(1) ? "?" : reader.GetString(1),
                MaxLength: reader.GetInt16(2),
                Precision: reader.GetByte(3),
                Scale: reader.GetByte(4),
                IsOutput: reader.GetBoolean(5)));
        }
    }
}

var manifestRows = new List<string> { "SchemaName,ProcName,CreateDate,ModifyDate,ParamCount,ReferencedInCode,SqlFile" };
var dbProcNamesLower = new HashSet<string>(procedures.Select(p => p.ProcName), StringComparer.OrdinalIgnoreCase);

foreach (var proc in procedures)
{
    var fileName = $"{proc.SchemaName}.{proc.ProcName}.sql";
    var filePath = Path.Combine(sqlOutDir, fileName);
    var referenced = knownProcedures.Contains(proc.ProcName);

    var sb = new StringBuilder();
    sb.AppendLine($"-- Objeto: {proc.SchemaName}.{proc.ProcName}");
    sb.AppendLine($"-- Creado en BD: {proc.CreateDate:yyyy-MM-dd HH:mm:ss}");
    sb.AppendLine($"-- Modificado en BD: {proc.ModifyDate:yyyy-MM-dd HH:mm:ss}");
    sb.AppendLine($"-- Extraído: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
    sb.AppendLine($"-- Referenciado por el backend .NET: {(referenced ? "SI" : "NO (revisar si sigue en uso)")}");
    if (proc.Parameters.Count > 0)
    {
        sb.AppendLine("-- Parámetros:");
        foreach (var p in proc.Parameters)
        {
            var dir = p.IsOutput ? "OUTPUT" : "IN";
            sb.AppendLine($"--   {p.Name} {p.TypeName} ({dir})");
        }
    }
    sb.AppendLine();
    sb.Append(proc.Definition.TrimEnd());
    sb.AppendLine();

    File.WriteAllText(filePath, sb.ToString(), new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

    manifestRows.Add(string.Join(",",
        proc.SchemaName,
        proc.ProcName,
        proc.CreateDate.ToString("yyyy-MM-dd HH:mm:ss"),
        proc.ModifyDate.ToString("yyyy-MM-dd HH:mm:ss"),
        proc.Parameters.Count.ToString(),
        referenced ? "SI" : "NO",
        $"sql/{fileName}"));
}

File.WriteAllLines(Path.Combine(options.OutDir, "manifest.csv"), manifestRows, Encoding.UTF8);

var missingInDb = knownProcedures.Where(n => !dbProcNamesLower.Contains(n)).OrderBy(n => n).ToList();
var unusedInCode = procedures.Where(p => !knownProcedures.Contains(p.ProcName))
    .Select(p => $"{p.SchemaName}.{p.ProcName}")
    .OrderBy(n => n)
    .ToList();

var report = new StringBuilder();
report.AppendLine("# Reporte de cobertura de stored procedures");
report.AppendLine();
report.AppendLine($"Generado: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
report.AppendLine();
report.AppendLine($"- SPs en la base de datos: {procedures.Count}");
report.AppendLine($"- SPs referenciados por el backend (`known-procedures.txt`): {knownProcedures.Count}");
report.AppendLine($"- Referenciados en código pero NO encontrados en la BD: {missingInDb.Count}");
report.AppendLine($"- Existen en la BD pero NO referenciados en el código analizado: {unusedInCode.Count}");
report.AppendLine();
report.AppendLine("## Faltantes en la base de datos (posible SP renombrado/eliminado, o entorno distinto)");
report.AppendLine();
if (missingInDb.Count == 0)
{
    report.AppendLine("Ninguno.");
}
else
{
    foreach (var name in missingInDb) report.AppendLine($"- {name}");
}
report.AppendLine();
report.AppendLine("## Sin referencia en el código analizado (candidatos a revisar/depreciar)");
report.AppendLine();
report.AppendLine("> Nota: esto solo cubre las llamadas Dapper detectadas estáticamente en `Repositories.Dapper`.");
report.AppendLine("> Un SP puede seguir en uso vía jobs de SQL Server, otros sistemas, o llamadas dinámicas no detectadas.");
report.AppendLine();
if (unusedInCode.Count == 0)
{
    report.AppendLine("Ninguno.");
}
else
{
    foreach (var name in unusedInCode) report.AppendLine($"- {name}");
}

File.WriteAllText(Path.Combine(options.OutDir, "coverage-report.md"), report.ToString(), Encoding.UTF8);

Console.WriteLine($"Listo. {procedures.Count} definiciones escritas en {sqlOutDir}");
Console.WriteLine($"Manifest: {Path.Combine(options.OutDir, "manifest.csv")}");
Console.WriteLine($"Reporte de cobertura: {Path.Combine(options.OutDir, "coverage-report.md")}");
return 0;

static HashSet<string> LoadKnownProcedures(string? path)
{
    var set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
    {
        return set;
    }

    foreach (var rawLine in File.ReadAllLines(path))
    {
        var line = rawLine.Trim();
        if (line.Length == 0 || line.StartsWith('#'))
        {
            continue;
        }
        set.Add(line);
    }
    return set;
}

sealed record ProcedureInfo(string SchemaName, string ProcName, int ObjectId, DateTime CreateDate, DateTime ModifyDate, string Definition)
{
    public List<ParameterInfo> Parameters { get; } = new();
}

sealed record ParameterInfo(string Name, string TypeName, short MaxLength, byte Precision, byte Scale, bool IsOutput);

sealed class CliOptions
{
    public string? ConnectionString { get; private set; }
    public string? KnownProceduresPath { get; private set; }
    public string OutDir { get; private set; } = Path.Combine("documentacion", "stored-procedures");

    public static CliOptions? Parse(string[] args)
    {
        var options = new CliOptions();
        for (var i = 0; i < args.Length; i++)
        {
            switch (args[i])
            {
                case "--connection-string":
                    options.ConnectionString = RequireValue(args, ref i, "--connection-string");
                    break;
                case "--known-procedures":
                    options.KnownProceduresPath = RequireValue(args, ref i, "--known-procedures");
                    break;
                case "--out":
                    options.OutDir = RequireValue(args, ref i, "--out");
                    break;
                case "--help":
                case "-h":
                    PrintHelp();
                    return null;
                default:
                    Console.Error.WriteLine($"Argumento desconocido: {args[i]}");
                    PrintHelp();
                    return null;
            }
        }
        return options;
    }

    private static string RequireValue(string[] args, ref int i, string flag)
    {
        if (i + 1 >= args.Length)
        {
            throw new ArgumentException($"El argumento {flag} requiere un valor.");
        }
        i++;
        return args[i];
    }

    private static void PrintHelp()
    {
        Console.WriteLine("""
            SpExporter - exporta el código fuente de los stored procedures de SQL Server.

            Opciones:
              --connection-string <cadena>     Cadena de conexión ADO.NET (o usar env var SP_EXPORTER_CONNECTION_STRING)
              --known-procedures <archivo>     Lista de SPs referenciados por el código (uno por línea), para el reporte de cobertura
              --out <carpeta>                  Carpeta de salida (default: documentacion/stored-procedures)
            """);
    }
}
