async function AbrirModalContrasena(id) {
    const formModal = document.getElementById("formContrasena")
    formModal.reset();
    $("#hhmdtxtPassActual").removeClass("is-valid");
    $("#hhmdtxtPassActual").removeClass("is-invalid");
    $("#hdmdtxtPass").removeClass("is-valid");
    $("#hdmdtxtPass").removeClass("is-invalid");
    $("#hdmdtxtPassRep").removeClass("is-valid");
    $("#hdmdtxtPassRep").removeClass("is-invalid");
    $('#ModalCambiarContrasena').modal('show');
}
elvalidarPass = $("#formContrasena").validate({
    rules: {
        hhmdtxtPassActual: {
            required: true,
            minlength: 10,
            maxlength: 50,
        },
        hdmdtxtPass: {
            required: true,
            minlength: 10,
            maxlength: 50,
            pattern: "((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W]).{10,50})"
        },
        hdmdtxtPassRep: {
            required: true,
            minlength: 10,
            maxlength: 50,
            equalTo: "#hdmdtxtPass"
        },
    },
    messages: {
        hhmdtxtPassActual: {
            required: "Por favor, ingresar contraseña actual",
            minlength: "Debe al menos contar con 10 caracteres.",
            maxlength: "No debe pasar de los 50 caracteres.",
        },
        hdmdtxtPass: {
            required: "Por favor, ingresar contraseña nueva",
            minlength: "Debe al menos contar con 10 caracteres.",
            maxlength: "No debe pasar de los 50 caracteres.",
            pattern: "Necesita una Mayúscula, Minúscula, Digito y/o Símbolo."
        },
        hdmdtxtPassRep: {
            required: "Por favor, repetir contraseña nueva.",
            minlength: "Debe al menos contar con 10 caracteres.",
            maxlength: "No debe pasar de los 50 caracteres.",
            equalTo: "la contraseña debe ser igual a la nueva.",
        },
    },
    errorElement: "em",
    errorPlacement: function (error, element) {
        // Add the `invalid-feedback` class to the error element
        error.addClass("invalid-feedback");
        if (element.prop("type") === "checkbox") {
            error.insertAfter(element.next("label"));
        } else {
            error.insertAfter(element);
        }
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).addClass("is-valid").removeClass("is-invalid");
    }
});


async function clickValidarCambioPass() {
    if ($("#formContrasena").valid()) {
        await ProcesarPass();
    }
}