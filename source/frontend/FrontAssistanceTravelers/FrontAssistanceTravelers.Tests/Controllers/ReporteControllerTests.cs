using ClosedXML.Excel;
using FrontAssistanceTravelers.WebTravel.Controllers;
using FrontAssistanceTravelers.WebTravel.Models.Reporte;
using Microsoft.AspNetCore.Mvc;

namespace FrontAssistanceTravelers.Tests.Controllers;

public class ReporteControllerTests
{
    [Fact]
    public void ExportarExcelDosPeriodos_SinPeriodos_RetornaBadRequest()
    {
        var resultado = new ReporteController().ExportarExcelDosPeriodos(
            new BEReporteExportarDosPeriodos { periodos = new() });

        Assert.IsType<BadRequestObjectResult>(resultado);
    }

    [Fact]
    public void ExportarExcelDosPeriodos_ReporteNulo_RetornaBadRequest()
    {
        var resultado = new ReporteController().ExportarExcelDosPeriodos(null!);

        Assert.IsType<BadRequestObjectResult>(resultado);
    }

    [Fact]
    public void ExportarExcelDosPeriodos_ConDatos_GeneraExcelConTituloEImporteNumerico()
    {
        var reporte = new BEReporteExportarDosPeriodos
        {
            titulo = "Ventas por agencia",
            columnaImporte = 1,
            periodos = new()
            {
                new BEReporteExportarPeriodo
                {
                    etiqueta = "2026-10",
                    columnas = new() { "Agencia", "Importe" },
                    filas = new() { new() { "Agencia A", "1,234.50" } }
                }
            }
        };

        var resultado = new ReporteController().ExportarExcelDosPeriodos(reporte);

        var archivo = Assert.IsType<FileStreamResult>(resultado);
        Assert.EndsWith(".xlsx", archivo.FileDownloadName);

        using var libro = new XLWorkbook(archivo.FileStream);
        var hoja = libro.Worksheet(1);
        Assert.Equal("Ventas por agencia", hoja.Cell(2, 2).GetString());
        Assert.Equal("Periodo: 2026-10", hoja.Cell(4, 2).GetString());
        Assert.Equal("Agencia A", hoja.Cell(6, 2).GetString());
        Assert.Equal(1234.50, hoja.Cell(6, 3).GetDouble());
    }
}
