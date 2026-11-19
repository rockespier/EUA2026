using BackAssistanceTravelers.ApiTravel.Controllers;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace BackAssistanceTravelers.Tests.Controllers;

public class ConfiguracionControllerTests
{
    private readonly Mock<IUnitOfWork> unitOfWork = new();
    private readonly Mock<IUsuarioRepository> usuarios = new();

    public ConfiguracionControllerTests()
    {
        unitOfWork.SetupGet(u => u.Usuarios).Returns(usuarios.Object);
    }

    private ConfiguracionController CrearController() => new(
        unitOfWork.Object,
        Mock.Of<IMailServicio>(),
        new ConfigurationBuilder().Build(),
        NullLogger<ConfiguracionController>.Instance);

    [Fact]
    public async Task UsuarioAdminAnular_RepositorioDevuelveDescripcion_RetornaOk()
    {
        usuarios.Setup(r => r.Usuario_Eliminar(10, "U"))
            .ReturnsAsync(new BEError { errorCodigo = 0, errorDescripcion = "OK" });

        var resultado = await CrearController().postEliminarAdminUsuario(10);

        var ok = Assert.IsType<OkObjectResult>(resultado);
        var cuerpo = Assert.IsType<BEError>(ok.Value);
        Assert.Equal(200, cuerpo.errorCodigo);
    }

    [Fact]
    public async Task UsuarioAdminAnular_RepositorioSinDescripcion_RetornaBadRequest()
    {
        usuarios.Setup(r => r.Usuario_Eliminar(It.IsAny<int>(), It.IsAny<string>()))
            .ReturnsAsync(new BEError());

        var resultado = await CrearController().postEliminarAdminUsuario(10);

        Assert.IsType<BadRequestObjectResult>(resultado);
    }

    [Fact]
    public async Task UsuarioAdminAnular_RepositorioLanzaExcepcion_RetornaBadRequestConMensaje()
    {
        usuarios.Setup(r => r.Usuario_Eliminar(It.IsAny<int>(), It.IsAny<string>()))
            .ThrowsAsync(new InvalidOperationException("fallo BD"));

        var resultado = await CrearController().postEliminarAdminUsuario(10);

        var bad = Assert.IsType<BadRequestObjectResult>(resultado);
        var error = Assert.IsType<BEErrorApi>(bad.Value);
        Assert.Equal("fallo BD", error.errorDescripcion);
    }
}
