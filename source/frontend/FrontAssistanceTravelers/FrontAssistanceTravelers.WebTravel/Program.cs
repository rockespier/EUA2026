using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.IO.Compression;

var builder = WebApplication.CreateBuilder(args);

// --- Configurazione esplicita (facoltativa, CreateBuilder carica gi� appsettings.json + environment) ---
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();


// --- Services registration (prima di Build) ---
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// Compression (registrare prima di Build)
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
builder.Services.Configure<BrotliCompressionProviderOptions>(opts =>
{
    opts.Level = CompressionLevel.Fastest;
});
builder.Services.Configure<GzipCompressionProviderOptions>(opts =>
{
    opts.Level = CompressionLevel.Fastest;
});

builder.Services.AddHttpClient();

// Authentication (cookie)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(option =>
    {
        option.LoginPath = "/Autenticacion/Acceso/";
        option.ExpireTimeSpan = TimeSpan.FromDays(1);
        option.Cookie.MaxAge = option.ExpireTimeSpan;
        option.Cookie.HttpOnly = true;
        option.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        option.Cookie.SameSite = SameSiteMode.Strict;
    });

// Kestrel tuning (prima di Build)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(120);
    serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(120);
});

// --- Build app ---
var app = builder.Build();

// Log environment (utile per verificare cosa � effettivamente in uso)
app.Logger.LogInformation("ASPNETCORE_ENVIRONMENT = {env}", app.Environment.EnvironmentName);

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Response compression deve essere registrato prima di UseStaticFiles se vuoi comprimere static files
app.UseResponseCompression();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Routes
app.MapDefaultControllerRoute();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Autenticacion}/{action=Acceso}/{id?}");
app.MapRazorPages();

app.Run();
