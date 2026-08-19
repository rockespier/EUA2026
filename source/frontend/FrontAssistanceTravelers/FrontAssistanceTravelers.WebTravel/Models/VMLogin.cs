using System.ComponentModel.DataAnnotations;

namespace FrontAssistanceTravelers.WebTravel.Models
{
    public class VMLogin
    {
        public string? inpAccesoAcceso { get; set; }
		[Required(ErrorMessage = "La contraseña es obligatoria.")]
		[DataType(DataType.Password)]
		[RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{10,50}$",ErrorMessage = "La contraseña debe tener entre 10 y 50 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.")]
		public string? inpAccesoPassword { get; set; }

		[Required(ErrorMessage = "Debe repetir la contraseña.")]
		[DataType(DataType.Password)]
		[Compare("inpAccesoPassword", ErrorMessage = "Las contraseñas no coinciden.")]
		public string? inpAccesoRepetirPassword { get; set; }
	}
}
