using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using BackAssistanceTravelers.UnitOfWork;
using BackAssistanceTravelers.Repositories.Dapper.Travel;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Repositories.Travel;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);


builder.Logging.ClearProviders();
builder.Logging.AddLog4Net(log4NetConfigFile: "log4net.config");
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
	opt.SwaggerDoc("v1", new OpenApiInfo { Title = "ApiTravel", Version = "v1",Description = "API para administrar los datos de la aplicacion web Assistance Travel." });
	opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
	{
		In = ParameterLocation.Header,
		Description = "Please enter token",
		Name = "Authorization",
		//Type = SecuritySchemeType.OAuth2,
		Type = SecuritySchemeType.Http,
		BearerFormat = "JWT",
		Scheme = "bearer",
	});
	opt.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			new OpenApiSecurityScheme
			{
				Reference = new OpenApiReference
				{
					Type=ReferenceType.SecurityScheme,
					Id="Bearer"
				}
			},
			new string[]{}
		}
	});
});

builder.Services.AddScoped<IUnitOfWork, TravelUnitOfWork>(_ => new TravelUnitOfWork(builder.Configuration.GetConnectionString("SqlConnection")!));
builder.Services.Configure<BEMailConfigurar>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailServicio, MailServicio>();

builder.Services.AddAuthentication(
options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
	o.TokenValidationParameters = new TokenValidationParameters {
		ValidIssuer = builder.Configuration["Jwt:Issuer"],
		ValidAudience = builder.Configuration["Jwt:Audience"],
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
		ClockSkew = TimeSpan.Zero,
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		//RequireExpirationTime = true,
		ValidateIssuerSigningKey = true,
		// Imposta la durata massima della sessione JWT a 1 giorno (86400 secondi)
		LifetimeValidator = (notBefore, expires, token, parameters) => {
			if (expires != null) {
				return expires > DateTime.UtcNow && expires <= DateTime.UtcNow.AddDays(1);
			}
			return false;
		}
	};
});

builder.Services.AddAuthorization(options =>
{
    // Require an authenticated user with a valid role claim (non-zero profile)
    options.AddPolicy("RequireRole", policy =>
        policy.RequireAuthenticatedUser()
              .RequireClaim(System.Security.Claims.ClaimTypes.Role));

    // Restrict sensitive areas to administrative profiles (profile IDs configured per deployment)
    var adminRoles = builder.Configuration.GetSection("Authorization:AdminRoles").Get<string[]>()
        ?? Array.Empty<string>();
    if (adminRoles.Length > 0)
    {
        options.AddPolicy("AdminOnly", policy =>
            policy.RequireAuthenticatedUser()
                  .RequireRole(adminRoles));
    }
    else
    {
        options.AddPolicy("AdminOnly", policy => policy.RequireAuthenticatedUser());
    }
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("NuevaPolitica", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .WithMethods("GET", "POST", "PUT", "DELETE")
                  .WithHeaders("Authorization", "Content-Type");
        }
        else
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
    });
});

builder.WebHost.ConfigureKestrel(serverOptions => {
	serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(15); // default is 2 minutes
	serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(5);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Staging"))
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        string swaggerJsonBasePath = string.IsNullOrWhiteSpace(c.RoutePrefix) ? "." : "..";
        c.SwaggerEndpoint($"{swaggerJsonBasePath}/swagger/v1/swagger.json", "ApiTravel v1");
    });
}

app.UseHttpsRedirection();

app.UseCors("NuevaPolitica");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var option = new RewriteOptions();
option.AddRedirect("^$", "swagger");
app.UseRewriter(option);

app.Run();
