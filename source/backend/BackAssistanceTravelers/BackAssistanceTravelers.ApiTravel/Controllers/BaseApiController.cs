using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    public abstract class BaseApiController : ControllerBase
    {
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        protected static string ObjectoTOJson(object objecto) =>
            JsonSerializer.Serialize(objecto, _jsonOptions);
    }
}
