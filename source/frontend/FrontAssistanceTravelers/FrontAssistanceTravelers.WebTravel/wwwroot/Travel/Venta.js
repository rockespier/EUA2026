let idVenta;
let idPasajero;
let estadoProcesarVenta;
ReseteoLocalStorage();
hideLoader();
IniciarFechasBsuqueda();
//cargarCombos();
cargarCombosBusqueda();
cargarCombosSolictud();
CargarTodo();
IniciarTablaClick();
//iniciarPredeterminado();

function ReseteoLocalStorage() {
    localStorage.removeItem('lsagenciaIdSel');
    localStorage.removeItem('lsagenciaIdSelVenta');
}
function join(date, options, separator) {
    function format(option) {
        let formatter = new Intl.DateTimeFormat('en', option);
        return formatter.format(date);
    }
    return options.map(format).join(separator);
}
//SOLICITUD
//1-ANULAR
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

async function cargarCombosSolictud() {
    const elcomboSolicitud = await getSolicitudTipo(0, 1, menuPerfilId);
    if (elcomboSolicitud !== undefined) {
        let cantElementos07 = elcomboSolicitud.length;
        if (cantElementos07 > 0) {
            $('#mdvenSelTipoSolicitud').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboSolicitud) {
                const valorId = cboobj.solicitudtipoId;
                const valorNombre = cboobj.solicitudtipoNombre;
                $('#mdvenSelTipoSolicitud').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboTipo = await getValoresTipo('ventaClienteDocumentoTipoId', 1);
    if (elcomboTipo !== undefined) {
        let cantElementos08 = elcomboTipo.length;
        if (cantElementos08 > 0) {
            $('#mdvenSelModClieTipoDocSolicitud').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelModClieTipoDocSolicitud').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboAnulacion = await getValoresTipo('MotivoAnulacion', 1);
    if (elcomboAnulacion !== undefined) {
        let cantElementos09 = elcomboAnulacion.length;
        if (cantElementos09 > 0) {
            $('#mdvenSelAnularMotivoSolicitud').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboAnulacion) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelAnularMotivoSolicitud').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    const elcomboProductoSolicitud = await getProducto(0, 1, menuelAgenciaPaisId, AgenciaId);
    if (elcomboProductoSolicitud !== undefined) {
        let cantElementos12 = elcomboProductoSolicitud.length;
        if (cantElementos12 > 0) {
            $('#mdventextModProNewProductoSolicitud').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboProductoSolicitud) {
                const valorId = cboobj.productoId;
                const valorNombre = cboobj.productoNombre;
                $('#mdventextModProNewProductoSolicitud').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    if (AgenciaId === 0) {
        const [elcomboAgencia, elcomboPais, elcomboPromotor] = await Promise.all([
            getAgencia(0, 1, 0, menuUserId, '', ''),
            getPais(0, 1),
            getPromotoresPais(menuUserId, 0)
        ]);
        if (elcomboAgencia !== undefined) {
            let cantElementos10 = elcomboAgencia.length;
            if (cantElementos10 > 0) {
                $('#mdvenSelTrasVentAgenciaSolicitud').append($('<option/>').attr("value", "").text('---Seleccione---'));
                for (const cboobj of elcomboAgencia) {
                    const valorId = cboobj.agenciaId;
                    const valorNombre = cboobj.agenciaNombre;
                    $('#mdvenSelTrasVentAgenciaSolicitud').append($('<option/>').attr("value", valorId).text(valorNombre));
                }
            }
        }
        if (elcomboPais !== undefined) {
            let cantElementos04 = elcomboPais.length;
            if (cantElementos04 > 0) {
                $('#mdvenSelPaisSearch').append($('<option/>').attr("value", "").text('---Todos---'));
                for (const cboobj of elcomboPais) {
                    const valorId = cboobj.paisId;
                    const valorNombre = cboobj.paisNombre;
                    $('#mdvenSelPaisSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
                }
            }
        }
        if (elcomboPromotor !== undefined) {
            let cantElementos13 = elcomboPromotor.length;
            if (cantElementos13 > 0) {
                $('#mdvenSelPromoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
                for (const cboobj of elcomboPromotor) {
                    const valorId = cboobj.usuarioId;
                    const valorNombre = cboobj.usuarioNombre;
                    $('#mdvenSelPromoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
                }
            }
        }
        if (elcomboAgencia !== undefined) {
            let cantElementos05 = elcomboAgencia.length;
            if (cantElementos05 > 0) {
                var dataSource = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    local: elcomboAgencia
                });

                $('#txtAgencia').typeahead(
                    {
                        hint: true,
                        highlight: true,
                        minLength: 1 // Start searching after 1 character
                    },
                    {
                        name: 'agenciaId',
                        display: 'agenciaNombre', // Show the 'label' value
                        source: dataSource
                    }
                );

                $('#txtAgencia').on('typeahead:select', function (e, selection) {
                    $('#txtAgencia').val(selection.agenciaId); // Muestra el ID en el input
                    localStorage.setItem("lsagenciaIdSel", selection.agenciaId); // Guarda el ID
                });
            }
        }
    }
}
async function cargarComboProductoCambio(agenciaId) {
    $('#mdventextModProNewProductoSolicitud').empty();
    $('#mdventextModProNewProductoSolicitud').append($('<option/>').attr("value", "").text('---Seleccione---'));
    const elcomboProductoCambio = await getProducto(0, 1, 0, agenciaId);
    if (elcomboProductoCambio !== undefined) {
        for (const cboobj of elcomboProductoCambio) {
            const valorId = cboobj.productoId;
            const valorNombre = cboobj.productoNombre;
            $('#mdventextModProNewProductoSolicitud').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }
}
$('#mdvenSelTrasVentAgenciaSolicitud').change(async function () {
    const strIdAgencia = $(this).val();
    const elcomboAgenciaUsuarios = await getAgenciaUsuario(strIdAgencia, 0, 1);
    if (elcomboAgenciaUsuarios !== undefined) {
        let cantElementos11 = elcomboAgenciaUsuarios.length;
        if (cantElementos11 > 0) {
            $('#mdvenSelTrasVentUsuarioSolicitud').empty();
            $('#mdvenSelTrasVentUsuarioSolicitud').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboAgenciaUsuarios) {
                const valorId = cboobj.agenciausuarioId;
                const valorNombre = cboobj.agenciausuarioNombre;
                $('#mdvenSelTrasVentUsuarioSolicitud').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
});
async function getSolicitudTipo(id, estado, perfil) {
    const urlApiFecht = menuUrlApi + "mantenimiento/SolicitudTipoObtener";
    const urlParametro = "?int_pSolicitudTipoID=" + id + "&int_pSolicitudTipoActivo=" + estado + "&int_pSolicitudPerfilId=" + perfil;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        //console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            //console.log(object3);
            return object3;
        }
    }
}
let elvalidarSolcitudAnular = $("#modalAnularVentaSolicitud").validate({
    rules: {
        mdvenSelAnularMotivoSolicitud: "required",
        mdvenTxtAnularObserSolicitud: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdvenSelAnularMotivoSolicitud: "Seleccione un motivo.",
        mdvenTxtAnularObserSolicitud: {
            required: "Ingresar una observacion.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        }
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
async function clickValidarAnular() {
    if ($("#modalAnularVentaSolicitud").valid()) {
        const resultado = await procesarVentaSituaAnular();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaAnular() {
    const Archivos = document.getElementById('mdvenFilAnularArchivoSolicitud');
    const CantidadArchivos = Archivos.files.length;
    let eltipofile = "";
    let base64archivoFinal = "";
    if (CantidadArchivos > 0) {
        const imobj = Archivos.files[0];
        const elnombre = imobj.name;
        const eltipo = imobj.type;
        const eltamano = imobj.size;
        if (eltamano > 500000000) {
            mostrarMensaje(3, "El archivo excede el máximo  de 500MB, por favor seleccionar un archivo menor.");
            return false;
        }
        eltipofile = eltipo.replace("image/", ".").replace("video/", ".").replace("application/", ".");
        const base64archivo = await toBase64(imobj);
        base64archivoFinal = base64archivo.replace("data:image/jpeg;base64,", "").replace("data:image/gif;base64,", "").replace("data:image/png;base64,", "").replace("data:video/mp4;base64,", "").replace("data:application/pdf;base64,", "");
    }
    const elmotivoObserva = document.getElementById("mdvenTxtAnularObserSolicitud");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const elcboTipoAnula = document.getElementById("mdvenSelAnularMotivoSolicitud");
    const valorelcboTipoAnula = elcboTipoAnula.options[elcboTipoAnula.selectedIndex].value;
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudCreadoUsuarioId: parseInt(menuUserId),
        solicitudMotivoAnulacion: parseInt(valorelcboTipoAnula),
        solicitudMotivo: elmotivoObserva.value,
        solicitudAdjunto: "",
        extensionArchivo: eltipofile,
        archivoBase64: base64archivoFinal,
    };
    const resultado = await postVentaSituaAnular(dataEnviar);
    return resultado;
}
async function postVentaSituaAnular(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionAnular";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
//1-ANULAR
//2-VIGENCIA inicio
let elvalidarSolcitudVigencia = $("#modalModVentaSolicitud").validate({
    rules: {
        mdvenFecModVigFechaInicialSolicitud: "required",
        mdvenFecModVigFechaFinalSolicitud: "required"
    },
    messages: {
        mdvenFecModVigFechaInicialSolicitud: "Seleccione una fecha desde.",
        mdvenFecModVigFechaFinalSolicitud: "Seleccione una fecha hasta."
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
async function clickValidarVigencia() {
    if ($("#modalModVentaSolicitud").valid()) {
        const resultado = await procesarVentaSituaVigencia();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaVigencia() {
    const ladatFechaIniV = document.getElementById("mdvenFecModVigFechaInicialSolicitud");
    const ladatFechaFinV = document.getElementById("mdvenFecModVigFechaFinalSolicitud");
    let fechaFormateaIniV;
    if (ladatFechaIniV.value == "") {
        const fecha = new Date(0);
        fechaFormateaIniV = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaIniV.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaIniV = formatearFechaString(dtfechaIniV);
    }
    let fechaFormateaFinV;
    if (ladatFechaFinV.value == "") {
        const fecha = new Date(0);
        fechaFormateaFinV = formatearFechaString(fecha);
    } else {
        const fechaFinVMoment = moment(ladatFechaFinV.value, "YYYY-MM-DD");
        const dtfechaFinV = fechaFinVMoment.toDate();
        fechaFormateaFinV = formatearFechaString(dtfechaFinV);
    }
    const eltxtDiasVigente = document.getElementById("mdvenTxtModVigDiasSolicitud");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const elmotivoObserva = document.getElementById("mdvenTxtModVigObserSolicitud");
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudVigenciaFechaInicial: fechaFormateaIniV,
        solicitudVigenciaFechaFinal: fechaFormateaFinV,
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaVigencia(dataEnviar);
    return resultado;
}
async function postVentaSituaVigencia(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionVigente";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}

let elvalidarSolcitudVigenciaEspecial = $("#modalModEspecialVentaSolicitud").validate({
    rules: {
        mdvenFecModVigFechaInicialSolicitudEsp: "required",
        mdvenFecModVigFechaFinalSolicitudEsp: "required"
    },
    messages: {
        mdvenFecModVigFechaInicialSolicitudEsp: "Seleccione una fecha desde.",
        mdvenFecModVigFechaFinalSolicitudEsp: "Seleccione una fecha hasta."
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
async function clickValidarVigenciaEspecial() {
    if ($("#modalModEspecialVentaSolicitud").valid()) {
        const resultado = await procesarVentaSituaVigenciaEspecial();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaVigenciaEspecial() {
    const ladatFechaIniV = document.getElementById("mdvenFecModVigFechaInicialSolicitudEsp");
    const ladatFechaFinV = document.getElementById("mdvenFecModVigFechaFinalSolicitudEsp");
    let fechaFormateaIniV;
    if (ladatFechaIniV.value == "") {
        const fecha = new Date(0);
        fechaFormateaIniV = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaIniV.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaIniV = formatearFechaString(dtfechaIniV);
    }
    let fechaFormateaFinV;
    if (ladatFechaFinV.value == "") {
        const fecha = new Date(0);
        fechaFormateaFinV = formatearFechaString(fecha);
    } else {
        const fechaFinVMoment = moment(ladatFechaFinV.value, "YYYY-MM-DD");
        const dtfechaFinV = fechaFinVMoment.toDate();
        fechaFormateaFinV = formatearFechaString(dtfechaFinV);
    }
    const eltxtDiasVigente = document.getElementById("mdvenTxtModVigDiasSolicitudEsp");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const elmotivoObserva = document.getElementById("mdvenTxtModVigObserSolicitudEsp");
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudVigenciaFechaInicial: fechaFormateaIniV,
        solicitudVigenciaFechaFinal: fechaFormateaFinV,
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaVigenciaEspecial(dataEnviar);
    return resultado;
}
async function postVentaSituaVigenciaEspecial(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionVigente";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}

async function IniciarFechaDatosVigencia() {
    const fechaHoy = new Date();
    const dtfechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    document.getElementById("mdvenFecModVigFechaInicialSolicitud").min = strfechaHoyFin;
    document.getElementById("mdvenFecModVigFechaFinalSolicitud").min = strfechaHoyFin;
    document.getElementById("mdvenTxtModVigDiasSolicitud").value = 0;
}
async function IniciarFechaDatosVigenciaEspecial() {
    const fechaHoy = new Date("2018-01-01");
    const dtfechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    document.getElementById("mdvenFecModVigFechaInicialSolicitudEsp").min = strfechaHoyFin;
    document.getElementById("mdvenFecModVigFechaFinalSolicitudEsp").min = strfechaHoyFin;
    document.getElementById("mdvenTxtModVigDiasSolicitudEsp").value = 0;
}

$('#mdvenFecModVigFechaInicialSolicitud').change(function () {
    const strfechaSelecVigIni = $(this).val();
    const strfechaSelecVigIniMoment = moment(strfechaSelecVigIni, "YYYY-MM-DD");
    const dtfechaSelecVigIni = strfechaSelecVigIniMoment.toDate();
    if (document.getElementById("mdvenFecModVigFechaFinalSolicitud").value === "") {
        document.getElementById("mdvenFecModVigFechaFinalSolicitud").value = formatearFechaString(dtfechaSelecVigIni);
    }
    const strfechaVigFinActiva = document.getElementById("mdvenFecModVigFechaFinalSolicitud").value;
    const strfechaVigFinActivaMoment = moment(strfechaVigFinActiva, "YYYY-MM-DD");
    const dtfechaVigFinActiva = strfechaVigFinActivaMoment.toDate();
    const laVenta = window.LaVenta;
    
    if (parseInt(laVenta.ventaNumeroDias) === 365) {
        
        var fechaNuevaVigFin = new Date();
        //fechaNuevaVigFin.setDate(sumarUnAno(dtfechaSelecVigIni));
        fechaNuevaVigFin = sumarUnAno(dtfechaSelecVigIni);
        const strfechaNuevVigFinDia = ("0" + fechaNuevaVigFin.getDate()).slice(-2)
        const strfechaNuevVigFinMes = ("0" + (fechaNuevaVigFin.getMonth() + 1)).slice(-2)
        const strfechaNuevVigFinAnh = fechaNuevaVigFin.getFullYear();
        const strfechaNuevVigFinFin = strfechaNuevVigFinAnh + "-" + strfechaNuevVigFinMes + "-" + strfechaNuevVigFinDia;
        document.getElementById('mdvenFecModVigFechaFinalSolicitud').value = strfechaNuevVigFinFin;
        document.getElementById("mdvenTxtModVigDiasSolicitud").value = 365
    } else {
       
        let Difference_In_Time = dtfechaSelecVigIni.getTime() - dtfechaVigFinActiva.getTime();
        let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
        document.getElementById("mdvenFecModVigFechaFinalSolicitud").min = strfechaSelecVigIni;
        if (Difference_In_Days >= 0) {
            document.getElementById("mdvenFecModVigFechaFinalSolicitud").value = strfechaSelecVigIni;
            Difference_In_Days = 0;
        }
        document.getElementById("mdvenTxtModVigDiasSolicitud").value = (Difference_In_Days * -1) + 1;
    }

});
$('#mdvenFecModVigFechaFinalSolicitud').change(function () {
    const strfechaSelecVigFin = $(this).val();
    const strfechaSelecVigFinMoment = moment(strfechaSelecVigFin, "YYYY-MM-DD");
    const dtfechaSelecVigFin = strfechaSelecVigFinMoment.toDate();
    const strfechaVigIniActiva = document.getElementById("mdvenFecModVigFechaInicialSolicitud").value;
    const strfechaVigIniActivaMoment = moment(strfechaVigIniActiva, "YYYY-MM-DD");
    const dtfechaVigIniActiva = strfechaVigIniActivaMoment.toDate();
    let Difference_In_Time = dtfechaVigIniActiva.getTime() - dtfechaSelecVigFin.getTime();
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    document.getElementById("mdvenTxtModVigDiasSolicitud").value = (Difference_In_Days * -1) + 1;
    actualizarTarifaTarifa();
});

$('#mdvenFecModVigFechaFinalSolicitudEsp').change(function () {
    const strfechaSelecVigFinEsp = $(this).val();
    const strfechaSelecVigFinMomentEsp = moment(strfechaSelecVigFinEsp, "YYYY-MM-DD");
    const dtfechaSelecVigFinEsp = strfechaSelecVigFinMomentEsp.toDate();

    const strfechaVigIniActivaEsp = document.getElementById("mdvenFecModVigFechaInicialSolicitudEsp").value;
    const strfechaVigIniActivaMomentEsp = moment(strfechaVigIniActivaEsp, "YYYY-MM-DD");
    const dtfechaVigIniActivaEsp = strfechaVigIniActivaMomentEsp.toDate();
    let Difference_In_TimeEsp = dtfechaVigIniActivaEsp.getTime() - dtfechaSelecVigFinEsp.getTime();
    let Difference_In_DaysEsp = Math.round(Difference_In_TimeEsp / (1000 * 3600 * 24));
    document.getElementById("mdvenTxtModVigDiasSolicitudEsp").value = (Difference_In_DaysEsp * -1) + 1;
    actualizarTarifaTarifa();
});
function sumarUnAno(fecha) {
    let nuevaFecha = new Date(fecha);
    nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
    nuevaFecha.setDate(nuevaFecha.getDate() - 1);
    return nuevaFecha;
}
//2-VIGENCIA fin
//3-REACTIVACION ini
let elvalidarSolcitudReactivacion = $("#modalReaVentaSolicitud").validate({
    rules: {
        mdvenTxtReacVentObserSolicitud: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdvenTxtReacVentObserSolicitud: {
            required: "Ingresar una observacion.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        }
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
async function clickValidarReactivacion() {
    if ($("#modalReaVentaSolicitud").valid()) {
        const resultado = await procesarVentaSituaReactivacion();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaReactivacion() {
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const elmotivoObserva = document.getElementById("mdvenTxtReacVentObserSolicitud");
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaReactivacion(dataEnviar);
    return resultado;
}
async function postVentaSituaReactivacion(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionReactivacion";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
//3-REACTIVACION fin
//4-TRASLADO ini
let elvalidarSolcitudTraslado = $("#modalTraVentaSolicitud").validate({
    rules: {
        mdvenSelTrasVentAgenciaSolicitud: "required",
        mdvenSelTrasVentUsuarioSolicitud: "required",
        mdvenTxtTrasVentObserSolicitud: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdvenSelTrasVentAgenciaSolicitud: "Seleccione una agencia.",
        mdvenSelTrasVentUsuarioSolicitud: "Seleccione un usuario.",
        mdvenTxtTrasVentObserSolicitud: {
            required: "Ingresar una observacion.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        }
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
async function clickValidarTraslado() {
    if ($("#modalTraVentaSolicitud").valid()) {
        const resultado = await procesarVentaSituaTraslado();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaTraslado() {
    const elcboAgencia = document.getElementById("mdvenSelTrasVentAgenciaSolicitud");
    const valorelcboAgencia = elcboAgencia.options[elcboAgencia.selectedIndex].value;
    const elcboUsuario = document.getElementById("mdvenSelTrasVentUsuarioSolicitud");
    const valorelcboUsuario = elcboUsuario.options[elcboUsuario.selectedIndex].value;

    const elmotivoObserva = document.getElementById("mdvenTxtTrasVentObserSolicitud");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudAgenciaId: parseInt(valorelcboAgencia),
        solicitudAgenciaUsuarioId: parseInt(valorelcboUsuario),
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaTraslado(dataEnviar);
    return resultado;
}
async function postVentaSituaTraslado(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionTraslado";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
//4-TRASLADO fin
//5-CLIENTE ini
async function IniciarFechaNaciminetoSolicitud() {
    const fechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear() - 1;
    const strfechaHoyAnhMax = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    const strfechaHoyFinMax = strfechaHoyAnhMax + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    document.getElementById("mdvenDetModClieFecNacSolicitud").max = strfechaHoyFinMax;
}
$('#mdvenDetModClieFecNacSolicitud').on('change', function (e) {
    const valorFecha = this.value;
    const anhos = new Date(new Date() - new Date(valorFecha)).getFullYear() - 1970;
    document.getElementById("mdvenTxtModClieEdadSolicitud").value = anhos;
});
let elvalidarSolcitudCliente = $("#modalModClienteSolicitud").validate({
    rules: {
        mdvenSelModClieTipoDocSolicitud: "required",
        mdvenTxtModClieNumDocSolicitud: {
            required: true,
            minlength: 5,
            maxlength: 250,
        },
        mdvenTxtModClieNombresSolicitud: {
            required: true,
            minlength: 2,
            maxlength: 250,
        },
        mdvenTxtModClieApellidosSolicitud: {
            required: true,
            minlength: 2,
            maxlength: 250,
        },
        mdvenDetModClieFecNacSolicitud: "required",
        mdvenTxtModClieCorreoSolicitud: {
            //required: true,
            email: true
        }/*,
        mdvenTxtModClieDireccSolicitud: {
            required: true,
            minlength: 5,
            maxlength: 250,
        },
        mdvenTxtModClieMovilSolicitud: {
            required: true,
            minlength: 5,
            maxlength: 30,
        },
        mdvenTxtModClieDistritoSolicitud: {
            required: true,
            minlength: 2,
            maxlength: 250,
        },
        mdvenTxtModClieCiudadSolicitud: {
            required: true,
            minlength: 2,
            maxlength: 250,
        },
        mdvenTxtModCliePaisSolicitud: {
            required: true,
            minlength: 2,
            maxlength: 250,
        }*/

    },
    messages: {
        mdvenSelModClieTipoDocSolicitud: "Seleccione tipo documento.",
        mdvenTxtModClieNumDocSolicitud: {
            required: "Ingresar numero de documento.",
            minlength: "Debe al menos contar con 5 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModClieNombresSolicitud: {
            required: "Ingresar nombres.",
            minlength: "Debe al menos contar con 2 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModClieApellidosSolicitud: {
            required: "Ingresar apellidos.",
            minlength: "Debe al menos contar con 2 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenDetModClieFecNacSolicitud: "Seleccionar una fecha valida.",
        mdvenTxtModClieCorreoSolicitud: {
           // required: "Ingresar un correo.",
            email: "Formato incorrecto.",
        }/*,
        mdvenTxtModClieDireccSolicitud: {
            required: "Ingresar una dirección.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModClieMovilSolicitud: {
            required: "Ingresar un teléfono.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModClieDistritoSolicitud: {
            required: "Ingresar un distrito.",
            minlength: "Debe al menos contar con 2 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModClieCiudadSolicitud: {
            required: "Ingresar una ciudad.",
            minlength: "Debe al menos contar con 2 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModCliePaisSolicitud: {
            required: "Ingresar un país.",
            minlength: "Debe al menos contar con 2 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },*/
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
async function clickValidarCliente() {
    if ($("#modalModClienteSolicitud").valid()) {
        const resultado = await procesarVentaSituaCliente();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else if (resultado.errorCodigo == -400) {
            mostrarMensaje(3, resultado.errorDescripcion);
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaCliente() {
    const elcboTipoDocumento = document.getElementById("mdvenSelModClieTipoDocSolicitud");
    const valorelcboTipoDoc = elcboTipoDocumento.options[elcboTipoDocumento.selectedIndex].value;
    const eltxtNumDoc = document.getElementById("mdvenTxtModClieNumDocSolicitud");
    const eltxtNombres = document.getElementById("mdvenTxtModClieNombresSolicitud");
    const eltxtApellidos = document.getElementById("mdvenTxtModClieApellidosSolicitud");
    const ladatFechaNac = document.getElementById("mdvenDetModClieFecNacSolicitud");
    let fechaFormateaNac;
    if (ladatFechaNac.value == "") {
        const fecha = new Date(0);
        fechaFormateaNac = formatearFechaString(fecha);
    } else {
        const fechaNacVMoment = moment(ladatFechaNac.value, "YYYY-MM-DD");
        const dtfechanac = fechaNacVMoment.toDate();
        fechaFormateaNac = formatearFechaString(dtfechanac);
    }
    const eltxtEdad = document.getElementById("mdvenTxtModClieEdadSolicitud");
    const laVenta = window.LaVenta;
    const edadMinimaProd = parseInt(laVenta.ventaProductoEdadMinima);
    const edadMaximarod = parseInt(laVenta.ventaProductoEdadMaxima);
    const eltxtEdadValor = parseInt(eltxtEdad.value);
    if (eltxtEdadValor >= edadMinimaProd) {
        if (eltxtEdadValor <= edadMaximarod) {
        } else {
            const dataError = {
                errorCodigo: -400,
                errorDescripcion: "La edad no es valida para el producto que tiene la venta"
            };
            return dataError;
        }
    } else {
        const dataError = {
            errorCodigo: -400,
            errorDescripcion: "La edad no es valida para el producto que tiene la venta"
        };
        return dataError;
    }
    const eltxtCorreo = document.getElementById("mdvenTxtModClieCorreoSolicitud");
    const eltxtDireccion = document.getElementById("mdvenTxtModClieDireccSolicitud");
    const eltxtMovil = document.getElementById("mdvenTxtModClieMovilSolicitud");
    const eltxtDistrito = document.getElementById("mdvenTxtModClieDistritoSolicitud");
    const eltxtCiudad = document.getElementById("mdvenTxtModClieCiudadSolicitud");
    const eltxtPais = document.getElementById("mdvenTxtModCliePaisSolicitud");
    const elmotivoObserva = document.getElementById("mdvenTxtModClieObserSolicitud");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudClienteDocumentoTipoId: valorelcboTipoDoc,
        solicitudClienteDocumentoNumero: eltxtNumDoc.value,
        solicitudClienteNombres: eltxtNombres.value,
        solicitudClienteApellidos: eltxtApellidos.value,
        solicitudClienteFechaNacimiento: fechaFormateaNac,
        solicitudClienteEdad: eltxtEdadValor,
        solicitudClienteEmail: eltxtCorreo.value,
        solicitudClienteDireccion: eltxtDireccion.value,
        solicitudClienteTelefono: eltxtMovil.value,
        solicitudClienteDistrito: eltxtDistrito.value,
        solicitudClienteCiudad: eltxtCiudad.value,
        solicitudClientePais: eltxtPais.value,
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaCliente(dataEnviar);
    return resultado;
}
async function postVentaSituaCliente(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionCliente";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
//5-CLIENTE fin
//6-EMERGENCIA ini
let elvalidarSolcitudEmer = $("#modalModEmerSolicitud").validate({
    rules: {
        mdvenTxtModEmerNombresSolicitud: {
            required: true,
            minlength: 1,
            maxlength: 250,
        },
        mdvenTxtModEmerMovilSolicitud: {
            required: true,
            minlength: 1,
            maxlength: 250,
        },
        mdvenTxtModEmerCorreoSolicitud: {
            //required: true,
            email: true
        }/*,
        mdvenTxtModEmerDireccSolicitud: {
            required: true,
            minlength: 1,
            maxlength: 250,
        },
        mdvenTxtModEmerDistritoSolicitud: {
            required: true,
            minlength: 1,
            maxlength: 250,
        },
        mdvenTxtModEmerPaisSolicitud: {
            required: true,
            minlength: 1,
            maxlength: 250,
        },*/

    },
    messages: {
        mdvenTxtModEmerNombresSolicitud: {
            required: "Ingresar nombre.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModEmerMovilSolicitud: {
            required: "Ingresar un teléfono.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModEmerCorreoSolicitud: {
            //required: "Ingresar un correo.",
            email: "Formato incorrecto.",
        }/*,
        mdvenTxtModEmerDireccSolicitud: {
            required: "Ingresar una dirección.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModEmerDistritoSolicitud: {
            required: "Ingresar un distrito.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModEmerPaisSolicitud: {
            required: "Ingresar un país.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },*/
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
async function clickValidarEmergencia() {
    if ($("#modalModEmerSolicitud").valid()) {
        const resultado = await procesarVentaSituaEmer();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaEmer() {
    const eltxtNombres = document.getElementById("mdvenTxtModEmerNombresSolicitud");
    const eltxtDireccion = document.getElementById("mdvenTxtModEmerDireccSolicitud");
    const eltxtDistrito = document.getElementById("mdvenTxtModEmerDistritoSolicitud");
    const eltxtPais = document.getElementById("mdvenTxtModEmerPaisSolicitud");
    const eltxtMovil = document.getElementById("mdvenTxtModEmerMovilSolicitud");
    const eltxtCorreo = document.getElementById("mdvenTxtModEmerCorreoSolicitud");
    const elmotivoObserva = document.getElementById("mdvenTxtModEmerObserSolicitud");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudContactoNombre: eltxtNombres.value,
        solicitudContactoDireccion: eltxtDireccion.value,
        solicitudContactoDistrito: eltxtDistrito.value,
        solicitudContactoPais: eltxtPais.value,
        solicitudContactoTelefono: eltxtMovil.value,
        solicitudContactoEmail: eltxtCorreo.value,
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaEmer(dataEnviar);
    return resultado;
}
async function postVentaSituaEmer(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionEmergencia";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
//6-EMERGENCIA fin
//7-IMPORTE
let elvalidarSolcitudImporte = $("#modalModImporteSolicitud").validate({
    rules: {
        mdvenTxtModImpCostoSolicitud: {
            required: true,
            pattern: "^(?:[0-9]\\d*|[0-9])(\\.\\d+)?$"
        },
        mdvenTxtModImpObserSolicitud: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdvenTxtModImpObserSolicitud: {
            required: "Ingresar una observacion.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtModImpCostoSolicitud: {
            required: "Por favor, ingresar cantidad.",
            pattern: "Ingrese solo numeros positivos.",
        }
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
async function clickValidarImporte() {
    if ($("#modalModImporteSolicitud").valid()) {
        const resultado = await procesarVentaSituaImporte();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaImporte() {
    const eltxtimporte = document.getElementById("mdvenTxtModImpCostoSolicitud");
    const elmotivoObserva = document.getElementById("mdvenTxtModImpObserSolicitud");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudVentaImporte: parseFloat(eltxtimporte.value),
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaImporteTarjeta(dataEnviar);
    return resultado;
}
//7-IMPORTE
//8-TARJETA
let elvalidarSolcitudTarjeta = $("#modalCanTarjetaSolicitud").validate({
    rules: {
        mdvenTxtCanTarjetaCostoSolicitud: {
            required: true,
            pattern: "^(?:[0-9]\\d+|[0-9])$"
        },
        mdvenTxtCanTarjetaObserSolicitud: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdvenTxtCanTarjetaObserSolicitud: {
            required: "Ingresar una observacion.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtCanTarjetaCostoSolicitud: {
            required: "Por favor, ingresar cantidad.",
            pattern: "Ingrese solo numeros positivos.",
        }
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
async function clickValidarTarjeta() {
    if ($("#modalCanTarjetaSolicitud").valid()) {
        const resultado = await procesarVentaSituaTarjeta();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaTarjeta() {
    const eltxtimporteTarjeta = document.getElementById("mdvenTxtCanTarjetaCostoSolicitud");
    const elmotivoObserva = document.getElementById("mdvenTxtCanTarjetaObserSolicitud");
    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;
    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudVentaImporte: parseFloat(eltxtimporteTarjeta.value),
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaImporteTarjeta(dataEnviar);
    return resultado;
}
async function postVentaSituaImporteTarjeta(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionImporTarje";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
//8-TARJETA
//10-PRODUCTO
$('#mdventextModProNewProductoSolicitud').change(async function () {
    const strIdProducto = $(this).val();
    const laVenta = window.LaVenta;
    const datosProducto = await getProducto(strIdProducto, 1, 0, laVenta.ventaUsuarioAgenciaId);

    if (datosProducto !== undefined) {
        if (datosProducto.length > 0) {
            if (datosProducto[0].productoNumeroDias === 365) {
                var edadCliente = parseInt(document.getElementById('mdvenTxtModProEdadSolicitudOri').value);
                var datValorEdadMin = datosProducto[0].productoEdadMinima;
                var datValorEdadMax = datosProducto[0].productoEdadMaxima;
                var datValorEdadMaxAdiciol = datosProducto[0].productoImporteDiaAdicional;
                document.getElementById("mdHidVenEstadoEdadAdi").value = 0;
                var resultado = await validarEdadCliente(edadCliente, datValorEdadMin, datValorEdadMax, datValorEdadMaxAdiciol);
                document.getElementById("mdHidVenEstadoEdadAdi").value = resultado;
                if (resultado === -1) {
                    mostrarMensaje(3, "Este producto no acepta la edad del cliente.");
                    document.getElementById('mdventextModProNewProductoSolicitud').value = "";
                    document.getElementById('mdvenTxtModProTarifaSolicitud').value = "";
                    document.getElementById('mdvenTxtModProDiasSolicitud').value = "";
                    document.getElementById('mdvenFecModProFechaInicialSolicitud').value = "";
                    document.getElementById('mdvenFecModProFechaFinalSolicitud').value = "";
                    return false;
                }
                const strfechaVigIni = document.getElementById("mdvenFecModProFechaInicialSolicitudOri").value;
                const strfechaVigIniMoment = moment(strfechaVigIni, "YYYY-MM-DD");
                const dtfechaVigIni = strfechaVigIniMoment.toDate();
                var fechaNuevaVigFin = new Date();
                fechaNuevaVigFin.setDate(dtfechaVigIni.getDate() + 364);
                const strfechaNuevVigFinDia = ("0" + fechaNuevaVigFin.getDate()).slice(-2)
                const strfechaNuevVigFinMes = ("0" + (fechaNuevaVigFin.getMonth() + 1)).slice(-2)
                const strfechaNuevVigFinAnh = fechaNuevaVigFin.getFullYear();
                const strfechaNuevVigFinFin = strfechaNuevVigFinAnh + "-" + strfechaNuevVigFinMes + "-" + strfechaNuevVigFinDia;
                document.getElementById('mdvenFecModProFechaInicialSolicitud').value = document.getElementById('mdvenFecModProFechaInicialSolicitudOri').value;
                document.getElementById('mdvenFecModProFechaFinalSolicitud').value = strfechaNuevVigFinFin;
                document.getElementById('mdvenTxtModProDiasSolicitud').value = 365
                actualizarTarifaTarifaSolicitud();
            } else {
                var edadCliente = parseInt(document.getElementById('mdvenTxtModProEdadSolicitudOri').value);
                var datValorEdadMin = datosProducto[0].productoEdadMinima;
                var datValorEdadMax = datosProducto[0].productoEdadMaxima;
                var datValorEdadMaxAdiciol = datosProducto[0].productoImporteDiaAdicional;
                document.getElementById("mdHidVenEstadoEdadAdi").value = 0;
                var resultado = await validarEdadCliente(edadCliente, datValorEdadMin, datValorEdadMax, datValorEdadMaxAdiciol);
                document.getElementById("mdHidVenEstadoEdadAdi").value = resultado;
                if (resultado === -1) {
                    mostrarMensaje(3, "Este producto no acepta la edad del cliente.");
                    document.getElementById('mdventextModProNewProductoSolicitud').value = "";
                    document.getElementById('mdvenTxtModProTarifaSolicitud').value = "";
                    document.getElementById('mdvenTxtModProDiasSolicitud').value = "";
                    document.getElementById('mdvenFecModProFechaInicialSolicitud').value = "";
                    document.getElementById('mdvenFecModProFechaFinalSolicitud').value = "";
                    return false;
                }
                document.getElementById('mdvenTxtModProDiasSolicitud').value = document.getElementById('mdvenTxtModProDiasSolicitudOri').value;
                document.getElementById('mdvenFecModProFechaInicialSolicitud').value = document.getElementById('mdvenFecModProFechaInicialSolicitudOri').value;
                document.getElementById('mdvenFecModProFechaFinalSolicitud').value = document.getElementById('mdvenFecModProFechaFinalSolicitudOri').value;
                actualizarTarifaTarifaSolicitud();
            }
        }
    }
});
let elvalidarSolcitudProducto = $("#modalModProdSolicitud").validate({
    rules: {
        mdventextModProNewProductoSolicitud: "required",
        mdvenTxtModProObserSolicitud: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdventextModProNewProductoSolicitud: "Seleccione un producto.",
        mdvenTxtModProObserSolicitud: {
            required: "Ingresar una observacion.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        }
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
async function clickValidarProducto() {
    if ($("#modalModProdSolicitud").valid()) {
        const resultado = await procesarVentaSituaProducto();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaSolicitud').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function procesarVentaSituaProducto() {
    const ladatFechaIniV = document.getElementById("mdvenFecModProFechaInicialSolicitud");
    const ladatFechaFinV = document.getElementById("mdvenFecModProFechaFinalSolicitud");
    let fechaFormateaIniV;
    if (ladatFechaIniV.value == "") {
        const fecha = new Date(0);
        fechaFormateaIniV = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaIniV.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaIniV = formatearFechaString(dtfechaIniV);
    }
    let fechaFormateaFinV;
    if (ladatFechaFinV.value == "") {
        const fecha = new Date(0);
        fechaFormateaFinV = formatearFechaString(fecha);
    } else {
        const fechaFinVMoment = moment(ladatFechaFinV.value, "YYYY-MM-DD");
        const dtfechaFinV = fechaFinVMoment.toDate();
        fechaFormateaFinV = formatearFechaString(dtfechaFinV);
    }

    const elcboProducto = document.getElementById("mdventextModProNewProductoSolicitud");
    const valorelcboProducto = elcboProducto.options[elcboProducto.selectedIndex].value;
    const ventaImporte = document.getElementById("mdvenTxtModProTarifaSolicitud");
    const clienteEdad = document.getElementById("mdvenTxtModProEdadSolicitudOri");
    const elmotivoObserva = document.getElementById("mdvenTxtModProObserSolicitud");

    const elcboTipoSoli = document.getElementById("mdvenSelTipoSolicitud");
    const valorelcboTipoSoli = elcboTipoSoli.options[elcboTipoSoli.selectedIndex].value;

    const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;


    const dataEnviar = {
        solicitudTipoId: parseInt(valorelcboTipoSoli),
        solicitudVentaId: parseInt(idVenta),
        solicitudProductoFechaInicial: fechaFormateaIniV,
        solicitudProductoFechaFinal: fechaFormateaFinV,
        solicitudProductoId: parseInt(valorelcboProducto),
        solicitudProductoImporte: parseFloat(ventaImporte.value),
        solicitudProductoEdad: parseInt(clienteEdad.value),
        solicitudMotivo: elmotivoObserva.value,
        solicitudCreadoUsuarioId: parseInt(menuUserId),
    };
    const resultado = await postVentaSituaProducto(dataEnviar);
    return resultado;
}
async function postVentaSituaProducto(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasSituacionProducto";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
async function actualizarTarifaTarifaSolicitud() {
    const IdProducto = document.getElementById('mdventextModProNewProductoSolicitud').value;
    const Dias = document.getElementById('mdvenTxtModProDiasSolicitud').value;
    const EdadAdi = parseInt(document.getElementById("mdHidVenEstadoEdadAdi").value);
    const datosTarifa = await getTarifaXProdDias(IdProducto, Dias);
    if (datosTarifa !== undefined) {
        if (datosTarifa.length > 0) {
            let tarifaBase = parseFloat(datosTarifa[0].tarifaImporte);
            let tarifaFinal = EdadAdi === 1 ? tarifaBase * 1.5 : tarifaBase;
            document.getElementById('mdvenTxtModProTarifaSolicitud').value = parseFloat(tarifaFinal);
        }
    }
}

async function validarEdadCliente(edadCliente, edadMinima, edadMaxima, edadMaxAdicional) {
    if (edadCliente < 0) return -1;
    if (edadMaxAdicional > 0) {
        if (edadCliente >= edadMinima && edadCliente <= edadMaxima) {
            return 0; // Normal age range
        } else if (edadCliente > edadMaxima && edadCliente <= edadMaxAdicional) {
            return 1; // Additional age range
        } else {
            return -1; // Out of all ranges
        }
    } else {
        if (edadCliente >= edadMinima && edadCliente <= edadMaxima) {
            return 0;
        } else {
            return -1;
        }
    }
}


//combo tipo solicitud change
$('#mdvenSelTipoSolicitud').change(async function () {
    const btGuardarSolicitud = document.getElementById("btnGuardarSolicitud");
    const laVenta = window.LaVenta;
    const idTipoSolicitud = $(this).val();
    switch (idTipoSolicitud) {
        case '1':
            // Anular
            $('#modalAnularVentaSolicitud').show();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            limpiarTipoSolicitud_1();
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarAnular;
            break;
        case '2':
            // Vigencia
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').show();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            limpiarTipoSolicitud_2();
            const fechaMomentIni = moment(laVenta.ventaFechaVigenciaInicio, "YYYY-MM-DD");
            const dtfechaIni = fechaMomentIni.toDate();
            const fechaMomentFin = moment(laVenta.ventaFechaVigenciaFin, "YYYY-MM-DD");
            const dtfechaFin = fechaMomentFin.toDate();
            document.getElementById('mdventextModVigProductoSolicitudOri').value = laVenta.ventaProductoNombre;
            document.getElementById('mdvenFecModVigFechaInicialSolicitudOri').value = formatearFechaString(dtfechaIni);
            document.getElementById('mdvenFecModVigFechaFinalSolicitudOri').value = formatearFechaString(dtfechaFin);
            let Difference_In_Time = dtfechaIni.getTime() - dtfechaFin.getTime();
            let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            document.getElementById('mdvenFecModVigDiaslSolicitudOri').value = (Difference_In_Days * -1) + 1;
            IniciarFechaDatosVigencia();
            //if (parseInt(laVenta.ventaNumeroDias) === 365) {
            //    $('#mdvenFecModVigFechaFinalSolicitud').prop('readonly', true);
            //} else {
            //    $('#mdvenFecModVigFechaFinalSolicitud').prop('readonly', false);
            //} 
            $('#mdvenFecModVigFechaFinalSolicitud').prop('readonly', false);
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarVigencia;
            break;
        case '3':
            // Reactivacion
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').show();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            limpiarTipoSolicitud_3();
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarReactivacion;
            break;
        case '4':
            // Traslado
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').show();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            limpiarTipoSolicitud_4();
            document.getElementById('mdvenSelTrasVentAgenciaSolicitudOri').value = laVenta.ventaUsuarioAgenciaNombre
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarTraslado;
            break;
        case '5':
            // Cliente
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').show();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            IniciarFechaNaciminetoSolicitud();
            document.getElementById('mdvenSelModClieTipoDocSolicitud').value = laVenta.ventaClienteDocumentoTipoId
            document.getElementById('mdvenTxtModClieNumDocSolicitud').value = laVenta.ventaClienteDocumentoNumero
            document.getElementById('mdvenTxtModClieNombresSolicitud').value = laVenta.ventaClienteNombres
            document.getElementById('mdvenTxtModClieApellidosSolicitud').value = laVenta.ventaClienteApellidos
            const fechaMomentNac = moment(laVenta.ventaClienteFechaNacimiento, "YYYY-MM-DD");
            const dtfechaNac = fechaMomentNac.toDate();
            document.getElementById('mdvenDetModClieFecNacSolicitud').value = formatearFechaString(dtfechaNac);
            document.getElementById('mdvenTxtModClieEdadSolicitud').value = laVenta.ventaClienteEdad
            document.getElementById('mdvenTxtModClieCorreoSolicitud').value = laVenta.ventaClienteEmail
            document.getElementById('mdvenTxtModClieDireccSolicitud').value = laVenta.ventaClienteDireccion
            document.getElementById('mdvenTxtModClieMovilSolicitud').value = laVenta.ventaClienteTelefono
            document.getElementById('mdvenTxtModClieDistritoSolicitud').value = laVenta.ventaClienteDistrito
            document.getElementById('mdvenTxtModClieCiudadSolicitud').value = laVenta.ventaClienteCiudad
            document.getElementById('mdvenTxtModCliePaisSolicitud').value = laVenta.ventaClientePais
            limpiarTipoSolicitud_5();
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarCliente;
            break;
        case '6':
            // Emergencia
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').show();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            document.getElementById('mdvenTxtModEmerNombresSolicitud').value = laVenta.ventaContactoNombres
            document.getElementById('mdvenTxtModEmerDireccSolicitud').value = laVenta.ventaContactoDireccion
            document.getElementById('mdvenTxtModEmerDistritoSolicitud').value = laVenta.ventaContactoDistrito
            document.getElementById('mdvenTxtModEmerPaisSolicitud').value = laVenta.ventaContactoPais
            document.getElementById('mdvenTxtModEmerMovilSolicitud').value = laVenta.ventaContactoTelefono
            document.getElementById('mdvenTxtModEmerCorreoSolicitud').value = laVenta.ventaContactoEmail
            limpiarTipoSolicitud_6();
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarEmergencia;
            break;
        case '7':
            // Importe
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').show();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            document.getElementById('mdvenTxtModImpProductoSolicitud').value = laVenta.ventaProductoNombre
            document.getElementById('mdvenTxtModImpCostoSolicitud').value = laVenta.ventaProductoImporte
            document.getElementById('mdvenTxtModImpObserSolicitud').value = "";
            $("#mdvenTxtModImpProductoSolicitud").removeClass("is-valid");
            $("#mdvenTxtModImpProductoSolicitud").removeClass("is-invalid");
            $("#mdvenTxtModImpCostoSolicitud").removeClass("is-valid");
            $("#mdvenTxtModImpCostoSolicitud").removeClass("is-invalid");
            $("#mdvenTxtModImpObserSolicitud").removeClass("is-valid");
            $("#mdvenTxtModImpObserSolicitud").removeClass("is-invalid");
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarImporte;
            break;
        case '8':
            // Tarjetas Free
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            $('#modalCanTarjetaSolicitud').show();
            $('#modalModProdSolicitud').hide();
            document.getElementById('mdvenTxtCanTarjetaProductoSolicitud').value = laVenta.ventaProductoNombre
            document.getElementById('mdvenTxtCanTarjetaCostoSolicitud').value = laVenta.ventaProductoImporte
            document.getElementById('mdvenTxtCanTarjetaObserSolicitud').value = "";
            $("#mdvenTxtCanTarjetaProductoSolicitud").removeClass("is-valid");
            $("#mdvenTxtCanTarjetaProductoSolicitud").removeClass("is-invalid");
            $("#mdvenTxtCanTarjetaCostoSolicitud").removeClass("is-valid");
            $("#mdvenTxtCanTarjetaCostoSolicitud").removeClass("is-invalid");
            $("#mdvenTxtCanTarjetaObserSolicitud").removeClass("is-valid");
            $("#mdvenTxtCanTarjetaObserSolicitud").removeClass("is-invalid");
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarTarjeta;
            break;
        case '10':
            // Cambio Producto
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            $('#modalModProdSolicitud').show();
            const fechaMomentIni_v1 = moment(laVenta.ventaFechaVigenciaInicio, "YYYY-MM-DD");
            const dtfechaIni_v1 = fechaMomentIni_v1.toDate();
            const fechaMomentFin_v1 = moment(laVenta.ventaFechaVigenciaFin, "YYYY-MM-DD");
            const dtfechaFin_v1 = fechaMomentFin_v1.toDate();
            document.getElementById('mdventextModProProductoSolicitudOri').value = laVenta.ventaProductoNombre;
            document.getElementById('mdvenTxtModProTarifaSolicitudOri').value = laVenta.ventaImporteVenta;
            document.getElementById('mdvenTxtModProDiasSolicitudOri').value = laVenta.ventaNumeroDias;
            document.getElementById('mdvenTxtModProEdadSolicitudOri').value = laVenta.ventaClienteEdad;
            document.getElementById('mdvenFecModProFechaInicialSolicitudOri').value = formatearFechaString(dtfechaIni_v1);
            document.getElementById('mdvenFecModProFechaFinalSolicitudOri').value = formatearFechaString(dtfechaFin_v1);
            await cargarComboProductoCambio(laVenta.ventaUsuarioAgenciaId);
            limpiarTipoSolicitud_10();
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarProducto;
            break;
        case '11':
            // Vigencia
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').show();
            limpiarTipoSolicitud_11();
            const fechaMomentIniEsp = moment(laVenta.ventaFechaVigenciaInicio, "YYYY-MM-DD");
            const dtfechaIniEsp = fechaMomentIniEsp.toDate();
            const fechaMomentFinEsp = moment(laVenta.ventaFechaVigenciaFin, "YYYY-MM-DD");
            const dtfechaFinEsp = fechaMomentFinEsp.toDate();
            document.getElementById('mdventextModVigProductoSolicitudOriEsp').value = laVenta.ventaProductoNombre;
            document.getElementById('mdvenFecModVigFechaInicialSolicitudOriEsp').value = formatearFechaString(dtfechaIniEsp);
            document.getElementById('mdvenFecModVigFechaFinalSolicitudOriEsp').value = formatearFechaString(dtfechaFinEsp);
            let Difference_In_TimeEsp = dtfechaIniEsp.getTime() - dtfechaFinEsp.getTime();
            let Difference_In_DaysEsp = Math.round(Difference_In_TimeEsp / (1000 * 3600 * 24));
            document.getElementById('mdvenFecModVigDiaslSolicitudOriEsp').value = (Difference_In_DaysEsp * -1) + 1;
            IniciarFechaDatosVigenciaEspecial();           
            $('#mdvenFecModVigFechaFinalSolicitudEsp').prop('readonly', false);
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarVigenciaEspecial;
            break;
        case '12':
            // Cambio Producto
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialProdSolicitud').show();
            const fechaMomentIni_v1Esp = moment(laVenta.ventaFechaVigenciaInicio, "YYYY-MM-DD");
            const dtfechaIni_v1Esp = fechaMomentIni_v1Esp.toDate();
            const fechaMomentFin_v1Esp = moment(laVenta.ventaFechaVigenciaFin, "YYYY-MM-DD");
            const dtfechaFin_v1Esp = fechaMomentFin_v1Esp.toDate();
            document.getElementById('mdventextModProProductoSolicitudOriEsp').value = laVenta.ventaProductoNombre;
            document.getElementById('mdvenTxtModProTarifaSolicitudOriEsp').value = laVenta.ventaImporteVenta;
            document.getElementById('mdvenTxtModProDiasSolicitudOriEsp').value = laVenta.ventaNumeroDias;
            document.getElementById('mdvenTxtModProEdadSolicitudOriEsp').value = laVenta.ventaClienteEdad;
            document.getElementById('mdvenFecModProFechaInicialSolicitudOriEsp').value = formatearFechaString(dtfechaIni_v1);
            document.getElementById('mdvenFecModProFechaFinalSolicitudOriEsp').value = formatearFechaString(dtfechaFin_v1);
            limpiarTipoSolicitud_12();
            btGuardarSolicitud.removeAttribute("disabled");
            btGuardarSolicitud.onclick = clickValidarProducto;
            break;
        default:
            // Limpia todo
            $('#modalAnularVentaSolicitud').hide();
            $('#modalModVentaSolicitud').hide();
            $('#modalReaVentaSolicitud').hide();
            $('#modalTraVentaSolicitud').hide();
            $('#modalModClienteSolicitud').hide();
            $('#modalModEmerSolicitud').hide();
            $('#modalModImporteSolicitud').hide();
            $('#modalCanTarjetaSolicitud').hide();
            $('#modalModProdSolicitud').hide();
            $('#modalModEspecialVentaSolicitud').hide();
            $('#modalModEspecialProdSolicitud').hide();
            limpiarTipoSolicitud_1();
            limpiarTipoSolicitud_2();
            limpiarTipoSolicitud_11();
            limpiarTipoSolicitud_3();
            limpiarTipoSolicitud_4();
            limpiarTipoSolicitud_10();
            limpiarTipoSolicitud_12();
            btGuardarSolicitud.setAttribute("disabled", "disabled");
            btGuardarSolicitud.onclick = "";
    }
});
async function limpiarTipoSolicitud_1() {
    document.getElementById('mdvenSelAnularMotivoSolicitud').value = "";
    document.getElementById('mdvenFilAnularArchivoSolicitud').value = "";
    document.getElementById('mdvenTxtAnularObserSolicitud').value = "";
    $("#mdvenSelAnularMotivoSolicitud").removeClass("is-valid");
    $("#mdvenSelAnularMotivoSolicitud").removeClass("is-invalid");
    $("#mdvenFilAnularArchivoSolicitud").removeClass("is-valid");
    $("#mdvenFilAnularArchivoSolicitud").removeClass("is-invalid");
    $("#mdvenTxtAnularObserSolicitud").removeClass("is-valid");
    $("#mdvenTxtAnularObserSolicitud").removeClass("is-invalid");
}
async function limpiarTipoSolicitud_2() {
    document.getElementById('mdvenFecModVigFechaInicialSolicitud').value = "";
    document.getElementById('mdvenFecModVigFechaFinalSolicitud').value = "";
    document.getElementById('mdvenTxtModVigDiasSolicitud').value = "";
    document.getElementById('mdvenTxtModVigObserSolicitud').value = "";
    $("#mdventextModVigProductoSolicitudOri").removeClass("is-valid");
    $("#mdventextModVigProductoSolicitudOri").removeClass("is-invalid");
    $("#mdvenFecModVigFechaInicialSolicitudOri").removeClass("is-valid");
    $("#mdvenFecModVigFechaInicialSolicitudOri").removeClass("is-invalid");
    $("#mdvenFecModVigFechaFinalSolicitudOri").removeClass("is-valid");
    $("#mdvenFecModVigFechaFinalSolicitudOri").removeClass("is-invalid");
    $("#mdvenFecModVigFechaInicialSolicitud").removeClass("is-valid");
    $("#mdvenFecModVigFechaInicialSolicitud").removeClass("is-invalid");
    $("#mdvenFecModVigFechaFinalSolicitud").removeClass("is-valid");
    $("#mdvenFecModVigFechaFinalSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModVigObserSolicitud").removeClass("is-valid");
    $("#mdvenTxtModVigObserSolicitud").removeClass("is-invalid");
}
async function limpiarTipoSolicitud_11() {
    document.getElementById('mdvenFecModVigFechaInicialSolicitudEsp').value = "";
    document.getElementById('mdvenFecModVigFechaFinalSolicitudEsp').value = "";
    document.getElementById('mdvenTxtModVigDiasSolicitudEsp').value = "";
    document.getElementById('mdvenTxtModVigObserSolicitudEsp').value = "";
    $("#mdventextModVigProductoSolicitudOriEsp").removeClass("is-valid");
    $("#mdventextModVigProductoSolicitudOriEsp").removeClass("is-invalid");
    $("#mdvenFecModVigFechaInicialSolicitudOriEsp").removeClass("is-valid");
    $("#mdvenFecModVigFechaInicialSolicitudOriEsp").removeClass("is-invalid");
    $("#mdvenFecModVigFechaFinalSolicitudOriEsp").removeClass("is-valid");
    $("#mdvenFecModVigFechaFinalSolicitudOriEsp").removeClass("is-invalid");
    $("#mdvenFecModVigFechaInicialSolicitudEsp").removeClass("is-valid");
    $("#mdvenFecModVigFechaInicialSolicitudEsp").removeClass("is-invalid");
    $("#mdvenFecModVigFechaFinalSolicitudEsp").removeClass("is-valid");
    $("#mdvenFecModVigFechaFinalSolicitudEsp").removeClass("is-invalid");
    $("#mdvenTxtModVigObserSolicitudEsp").removeClass("is-valid");
    $("#mdvenTxtModVigObserSolicitudEsp").removeClass("is-invalid");
}
async function limpiarTipoSolicitud_3() {
    document.getElementById('mdvenTxtReacVentObserSolicitud').value = "";
    $("#mdvenTxtReacVentObserSolicitud").removeClass("is-valid");
    $("#mdvenTxtReacVentObserSolicitud").removeClass("is-invalid");
}
async function limpiarTipoSolicitud_4() {
    document.getElementById('mdvenSelTrasVentAgenciaSolicitud').value = "";
    $('#mdvenSelTrasVentUsuarioSolicitud').empty();
    document.getElementById('mdvenTxtTrasVentObserSolicitud').value = "";
    $("#mdvenSelTrasVentAgenciaSolicitudOri").removeClass("is-valid");
    $("#mdvenSelTrasVentAgenciaSolicitudOri").removeClass("is-invalid");
    $("#mdvenSelTrasVentAgenciaSolicitud").removeClass("is-valid");
    $("#mdvenSelTrasVentAgenciaSolicitud").removeClass("is-invalid");
    $("#mdvenSelTrasVentUsuarioSolicitud").removeClass("is-valid");
    $("#mdvenSelTrasVentUsuarioSolicitud").removeClass("is-invalid");
    $("#mdvenTxtTrasVentObserSolicitud").removeClass("is-valid");
    $("#mdvenTxtTrasVentObserSolicitud").removeClass("is-invalid");
}
async function limpiarTipoSolicitud_5() {
    document.getElementById('mdvenTxtModClieObserSolicitud').value = "";
    $("#mdvenSelModClieTipoDocSolicitud").removeClass("is-valid");
    $("#mdvenSelModClieTipoDocSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieNumDocSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieNumDocSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieNombresSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieNombresSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieApellidosSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieApellidosSolicitud").removeClass("is-invalid");
    $("#mdvenDetModClieFecNacSolicitud").removeClass("is-valid");
    $("#mdvenDetModClieFecNacSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieCorreoSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieCorreoSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieDireccSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieDireccSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieEdadSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieEdadSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieMovilSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieMovilSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieDistritoSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieDistritoSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieCiudadSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieCiudadSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModCliePaisSolicitud").removeClass("is-valid");
    $("#mdvenTxtModCliePaisSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModClieObserSolicitud").removeClass("is-valid");
    $("#mdvenTxtModClieObserSolicitud").removeClass("is-invalid");
}
async function limpiarTipoSolicitud_6() {
    document.getElementById('mdvenTxtModEmerObserSolicitud').value = "";
    $("#mdvenTxtModEmerObserSolicitud").removeClass("is-valid");
    $("#mdvenTxtModEmerObserSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModEmerNombresSolicitud").removeClass("is-valid");
    $("#mdvenTxtModEmerNombresSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModEmerDireccSolicitud").removeClass("is-valid");
    $("#mdvenTxtModEmerDireccSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModEmerDistritoSolicitud").removeClass("is-valid");
    $("#mdvenTxtModEmerDistritoSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModEmerPaisSolicitud").removeClass("is-valid");
    $("#mdvenTxtModEmerPaisSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModEmerMovilSolicitud").removeClass("is-valid");
    $("#mdvenTxtModEmerMovilSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModEmerCorreoSolicitud").removeClass("is-valid");
    $("#mdvenTxtModEmerCorreoSolicitud").removeClass("is-invalid");
}
async function limpiarTipoSolicitud_10() {
    document.getElementById('mdventextModProNewProductoSolicitud').value = "";
    document.getElementById('mdvenTxtModProTarifaSolicitud').value = "";
    document.getElementById('mdvenTxtModProDiasSolicitud').value = "";
    document.getElementById('mdvenFecModProFechaInicialSolicitud').value = "";
    document.getElementById('mdvenFecModProFechaFinalSolicitud').value = "";
    document.getElementById('mdvenTxtModProObserSolicitud').value = "";

    $("#mdventextModProProductoSolicitudOri").removeClass("is-valid");
    $("#mdventextModProProductoSolicitudOri").removeClass("is-invalid");
    $("#mdvenTxtModProTarifaSolicitudOri").removeClass("is-valid");
    $("#mdvenTxtModProTarifaSolicitudOri").removeClass("is-invalid");
    $("#mdvenTxtModProDiasSolicitudOri").removeClass("is-valid");
    $("#mdvenTxtModProDiasSolicitudOri").removeClass("is-invalid");
    $("#mdvenTxtModProEdadSolicitudOri").removeClass("is-valid");
    $("#mdvenTxtModProEdadSolicitudOri").removeClass("is-invalid");
    $("#mdvenFecModProFechaInicialSolicitudOri").removeClass("is-valid");
    $("#mdvenFecModProFechaInicialSolicitudOri").removeClass("is-invalid");
    $("#mdvenFecModProFechaFinalSolicitudOri").removeClass("is-valid");
    $("#mdvenFecModProFechaFinalSolicitudOri").removeClass("is-invalid");
    $("#mdvenTxtModProObserSolicitudOri").removeClass("is-valid");
    $("#mdvenTxtModProObserSolicitudOri").removeClass("is-invalid");

    $("#mdventextModProNewProductoSolicitud").removeClass("is-valid");
    $("#mdventextModProNewProductoSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModProTarifaSolicitud").removeClass("is-valid");
    $("#mdvenTxtModProTarifaSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModProDiasSolicitud").removeClass("is-valid");
    $("#mdvenTxtModProDiasSolicitud").removeClass("is-invalid");
    $("#mdvenFecModProFechaInicialSolicitud").removeClass("is-valid");
    $("#mdvenFecModProFechaInicialSolicitud").removeClass("is-invalid");
    $("#mdvenFecModProFechaFinalSolicitud").removeClass("is-valid");
    $("#mdvenFecModProFechaFinalSolicitud").removeClass("is-invalid");
    $("#mdvenTxtModProObserSolicitud").removeClass("is-valid");
    $("#mdvenTxtModProObserSolicitud").removeClass("is-invalid");
    ;
}

async function AbrirModaSolicitud() {
    const id = document.getElementById('mdHidIdVentaTarjeta').value;
    const eltitulo = document.getElementById("tituloModalVentaSolicitud");
    eltitulo.innerHTML = "Solicitud de cambio - Venta Nº: " + id;
    $('#modalAnularVentaSolicitud').hide();
    $('#modalModVentaSolicitud').hide();
    $('#modalReaVentaSolicitud').hide();
    $('#modalTraVentaSolicitud').hide();
    $('#modalModClienteSolicitud').hide();
    $('#modalModEmerSolicitud').hide();
    $('#modalModImporteSolicitud').hide();
    $('#modalCanTarjetaSolicitud').hide();
    $('#modalModProdSolicitud').hide();
    $('#modalModEspecialVentaSolicitud').hide();
    
    document.getElementById('mdvenSelTipoSolicitud').value = "";
    document.getElementById('btnGuardarSolicitud').setAttribute("disabled", "disabled");
    $('#popupModalVentaRead').modal('hide');
    $('#popupModalVentaSolicitud').modal('show');
}
//IMPRIMIR VENTA
let elvalidarImprimir = $("#modalDatosVentaPrint").validate({
    rules: {
        mdvenSelTipoHojaPrint: "required",
        mdvenSelPrecioPrint: "required",
        mdvenSelOrigenPrint: "required",
        mdvenSelDestinoPrint: "required",
    },
    messages: {
        mdvenSelTipoHojaPrint: "Seleccione el tipo de hoja.",
        mdvenSelPrecioPrint: "Seleccione el tipo documento.",
        mdvenSelOrigenPrint: "Seleccione si desea mostrar el origen.",
        mdvenSelDestinoPrint: "Seleccione si desea mostrar el destino.",
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
async function AbrirModaImprimir() {
    const id = document.getElementById('mdHidIdVentaTarjeta').value;
    const eltitulo = document.getElementById("tituloModalVentaPrint");
    eltitulo.innerHTML = "Impresión de venta Nº: " + id;
    document.getElementById("mdvenSelTipoHojaPrint").value = "";
    document.getElementById("mdvenSelPrecioPrint").value = "";
    document.getElementById("mdvenSelOrigenPrint").value = "";
    document.getElementById("mdvenSelDestinoPrint").value = "";

    $("#mdvenSelTipoHojaPrint").removeClass("is-valid");
    $("#mdvenSelTipoHojaPrint").removeClass("is-invalid");

    $("#mdvenSelPrecioPrint").removeClass("is-valid");
    $("#mdvenSelPrecioPrint").removeClass("is-invalid");

    $("#mdvenSelOrigenPrint").removeClass("is-valid");
    $("#mdvenSelOrigenPrint").removeClass("is-invalid");

    $("#mdvenSelDestinoPrint").removeClass("is-valid");
    $("#mdvenSelDestinoPrint").removeClass("is-invalid");

    $('#popupModalVentaRead').modal('hide');
    $('#popupModalVentaPrint').modal('show');

    const elcomboImpresion = await getVentaImpresion(id);
    if (elcomboImpresion !== undefined) {
        if (elcomboImpresion.length > 0) {
            document.getElementById("mdvenSelPrecioPrint").value = elcomboImpresion[0].paisDocumentoFormato;
        }
    }
}
function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}
async function clickValidarImpirmir() {
    const sesionActiva = await fetch('/validateJS', { credentials: 'include' });
    if (!sesionActiva.ok) {
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return;
    }
    if ($("#modalDatosVentaPrint").valid()) {
        showLoader();
        try {
            const idVenta = document.getElementById('mdHidIdVentaTarjeta').value;
            const idMembrete = document.getElementById("mdvenSelTipoHojaPrint").value;
            const idPrecio = document.getElementById("mdvenSelPrecioPrint").value;
            const idOrigen = document.getElementById("mdvenSelOrigenPrint").value;
            const idDestino = document.getElementById("mdvenSelDestinoPrint").value;
            const paramatro = idVenta + "_" + idMembrete + "_" + idPrecio + "_" + idOrigen + "_" + idDestino;

            let response = await fetch('/exportVentaImprimir/' + paramatro, {
                method: 'GET',
                headers: {
                    'Accept': 'application/octet-stream'  // Expecting a PDF response
                }
            });
            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = idVenta + '.pdf';
                link.click();
            } else {
                mostrarMensaje(1, "Error al generar el archivo.");
            }
        } catch (error) {
            mostrarMensaje(1, "Error inesperado: " + error);
        } finally {
            $('#popupModalVentaPrint').modal('hide');
            hideLoader();
        }
    }
}
async function clickValidarImpirmirAll() {
    const sesionActiva = await fetch('/validateJS', { credentials: 'include' });
    if (!sesionActiva.ok) {
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return;
    }
    if ($("#modalDatosVentaPrintAll").valid()) {
        showLoader();
        try {
            const idVentas = document.getElementById('mdHidIdVentaTarjetaAll').value;
            const idVentasList = idVentas.split(',');
            for (const obj of idVentasList) {
                const idVenta = obj;
                const idMembrete = document.getElementById("mdvenSelTipoHojaPrintAll").value;
                const idPrecio = document.getElementById("mdvenSelPrecioPrintAll").value;
                const idOrigen = document.getElementById("mdvenSelOrigenPrintAll").value;
                const idDestino = document.getElementById("mdvenSelDestinoPrintAll").value;
                const paramatro = idVenta + "_" + idMembrete + "_" + idPrecio + "_" + idOrigen + "_" + idDestino;

                let response = await fetch('/exportVentaImprimir/' + paramatro, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/octet-stream'  // Expecting a PDF response
                    }
                });
                if (response.ok) {
                    const blob = await response.blob();
                    const link = document.createElement('a');
                    const contentDisposition = response.headers.get('Content-Disposition');
                    let fileName = '';
                    if (contentDisposition && contentDisposition.includes('filename=')) {
                        const fileNameMatch = contentDisposition.match(/filename\*?=\s*['"]?([^'";\s]+)/);
                        if (fileNameMatch && fileNameMatch[1]) {
                            fileName = fileNameMatch[1];
                        }
                    }
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                } else {
                    mostrarMensaje(1, "Error al generar el archivo.");
                }
            }
        } catch (error) {
            mostrarMensaje(1, "Error inesperado: " + error);
        } finally {
            $('#popupModalVentaPrintAll').modal('hide');
            hideLoader();
        }
    }
}
async function AbrirModaImprimirVentas() {
    var checkVentas = [];
    const tablaGrid = $('#dtVenta').DataTable();
    tablaGrid.rows().every(function () {
        var cell = this.node();
        var objeto = $(cell).find('input[type="checkbox"]')       
        if (objeto.length > 0) {
            if (objeto[0].checked) {
                var row = cell.closest('tr');    
                var estado = row.cells[9].innerText;
                if (estado == 'VIGENTE') {                   
                    var idVenta = row.cells[1].innerText;
                    checkVentas.push(idVenta);
                }
            }
        }
    });
    if (checkVentas.length == 0) {
        mostrarMensaje(3, "Por favor, seleccionar al menos una venta vigente.");
        return false;
    }
    if (checkVentas.length > 10) {
        mostrarMensaje(3, "Solo se puede procesar hasta 10 ventas.");
        return false;
    }
    const listaIdsMasivo = checkVentas.join(', ');
    document.getElementById('mdHidIdVentaTarjetaAll').value = listaIdsMasivo;
    const eltitulo = document.getElementById("tituloModalVentaPrintAll");
    const cantidad = checkVentas.length;
    eltitulo.innerHTML = "Impresión de ventas masiva (" + cantidad + ")";
    document.getElementById("mdvenSelTipoHojaPrintAll").value = "";
    document.getElementById("mdvenSelPrecioPrintAll").value = "";
    document.getElementById("mdvenSelOrigenPrintAll").value = "";
    document.getElementById("mdvenSelDestinoPrintAll").value = "";
    $("#mdvenSelTipoHojaPrintAll").removeClass("is-valid");
    $("#mdvenSelTipoHojaPrintAll").removeClass("is-invalid");
    $("#mdvenSelPrecioPrintAll").removeClass("is-valid");
    $("#mdvenSelPrecioPrintAll").removeClass("is-invalid");
    $("#mdvenSelOrigenPrintAll").removeClass("is-valid");
    $("#mdvenSelOrigenPrintAll").removeClass("is-invalid");
    $("#mdvenSelDestinoPrintAll").removeClass("is-valid");
    $("#mdvenSelDestinoPrintAll").removeClass("is-invalid");
    $('#popupModalVentaPrintAll').modal('show');
}
let elvalidarImprimirAll = $("#modalDatosVentaPrintAll").validate({
    rules: {
        mdvenSelTipoHojaPrintAll: "required",
        mdvenSelPrecioPrintAll: "required",
        mdvenSelOrigenPrintAll: "required",
        mdvenSelDestinoPrintAll: "required",
    },
    messages: {
        mdvenSelTipoHojaPrintAll: "Seleccione el tipo de hoja.",
        mdvenSelPrecioPrintAll: "Seleccione el tipo documento.",
        mdvenSelOrigenPrintAll: "Seleccione si desea mostrar el origen.",
        mdvenSelDestinoPrintAll: "Seleccione si desea mostrar el destino.",
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
//LISTADO PRICIPAL
async function getProducto(id, estado, paisId, agenciaId) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductosObtener";
    const urlParametro = "?int_pProductoID=" + id + "&int_pProductoActivo=" + estado + "&int_pProductoPaisId=" + paisId + "&int_pProductoGrupalActivo=0&int_pProductoPromocionActivo=0&int_pProductoAgenciaID=" + agenciaId;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
       // console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            //console.log(object3);
            return object3;
        }
    }
}
async function getAgencia(id, estado, paisId, promotor, ruc, login) {
    const urlApiFecht = menuUrlApi + "configuracion/AgenciaObtener";
    const urlParametro = "?int_pAgenciaID=" + id + "&int_pAgenciaActivo=" + estado + "&int_pAgenciaPerfilId=0&int_pAgenciaPromotorId=" + promotor + "&int_pAgenciaPaisId=" + paisId;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
       // console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
           // console.log(object3);
            return object3;
        }
    }
}

async function cargarCombosBusqueda() {
    const elcomboEstado = await getValoresTipo('ventaEstadoId', 1);
    const elcomboSituacion = await getValoresTipo('ventaSituacionId', 1);
    const elcomboTipoSearch = await getValoresTipo('ventaClienteDocumentoTipoId', 1);

    if (elcomboEstado !== undefined) {
        let cantElementos01 = elcomboEstado.length;
        if (cantElementos01 > 0) {
            $('#mdvenSelEstadoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboEstado) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelEstadoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    if (elcomboSituacion !== undefined) {
        let cantElementos02 = elcomboSituacion.length;
        if (cantElementos02 > 0) {
            $('#mdvenSelSituacionSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboSituacion) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelSituacionSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    if (elcomboTipoSearch !== undefined) {
        let cantElementos04 = elcomboTipoSearch.length;
        if (cantElementos04 > 0) {
            $('#mdvenSelTipoDocSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipoSearch) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelTipoDocSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    if (AgenciaId !== 0) {
        const elcomboAgenciaUsuarios = await getAgenciaUsuario(AgenciaId, 0, 1);
        if (elcomboAgenciaUsuarios !== undefined) {
            let cantElementos06 = elcomboAgenciaUsuarios.length;
            if (cantElementos06 > 0) {
                $('#mdvenSelUsuarioSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
                for (const cboobj of elcomboAgenciaUsuarios) {
                    const valorId = cboobj.agenciausuarioId;
                    const valorNombre = cboobj.agenciausuarioNombre;
                    $('#mdvenSelUsuarioSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
                }
            }
        }
    }
}
$('#mdvenSelPaisSearch').change(async function () {
    localStorage.removeItem('lsagenciaIdSel');
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const strIdPais = $(this).val();

    const promotoresPromise = getPromotoresPais(menuUserId, strIdPais === "" ? 0 : strIdPais);

    if (AgenciaId === 0) {

        // 1. Destruir el typeahead existente
        $('#txtAgencia').typeahead('destroy');
        $('#txtAgencia').val(''); // Limpiar el input

        // 2. Obtener agencias filtradas por país
        const elcomboAgencia = await getAgencia(0, 1, strIdPais, 0, '', '');

        if (elcomboAgencia !== undefined && elcomboAgencia.length > 0) {
            // 3. Recrear el Bloodhound con los nuevos datos
            var dataSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: elcomboAgencia
            });

            // 4. Reinicializar el typeahead
            $('#txtAgencia').typeahead(
                {
                    hint: true,
                    highlight: true,
                    minLength: 1
                },
                {
                    name: 'agenciaId',
                    display: 'agenciaNombre',
                    source: dataSource
                }
            );

            // 5. Reconfigura el evento select
            $('#txtAgencia').off('typeahead:select').on('typeahead:select', function (e, selection) {
                $('#txtAgencia').val(selection.agenciaId);
                localStorage.setItem("lsagenciaIdSel", selection.agenciaId);
            });
        }
    }
    const elcomboTipo = await promotoresPromise;
    $('#mdvenSelPromoSearch').empty();
    if (elcomboTipo != undefined) {
        let cantElementos11 = elcomboTipo.length;
        if (cantElementos11 > 0) {
            $('#mdvenSelPromoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdvenSelPromoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
});
$('#mdvenSelAgenciaSearch').change(async function () {
    const AgenciaId = $(this).val();
    const elcomboAgenciaUsuarios = await getAgenciaUsuario(AgenciaId, 0, 1);
    if (elcomboAgenciaUsuarios !== undefined) {
        let cantElementos03 = elcomboAgenciaUsuarios.length;
        if (cantElementos03 > 0) {
            $('#mdvenSelUsuarioSearch').empty();
            $('#mdvenSelUsuarioSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboAgenciaUsuarios) {
                const valorId = cboobj.agenciausuarioId;
                const valorNombre = cboobj.agenciausuarioNombre;
                $('#mdvenSelUsuarioSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        } else {
            $('#mdvenSelUsuarioSearch').empty();
        }
    } else {
        $('#mdvenSelUsuarioSearch').empty();
    }
});
async function IniciarTablaClick() {
    const tablaGrid = $('#dtVenta').DataTable();
    $('#dtVenta tbody').on('click', 'tr td', function () {
        const datavalor = tablaGrid.row(this).data();
        if (datavalor !== undefined) {
            const idRec = tablaGrid.row(this).data().ventaId;
            const cellIndex = tablaGrid.column(this).index();
            const columna = tablaGrid.column(cellIndex).header().textContent
            if (columna !== "Acciones" && columna !== "") {
                AbrirModalConsulta(idRec)
            }
        }
    })
}


var groupColumn = 14;
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonVisualizar;
    tablaGrid = $("#dtVenta").DataTable({        
        fixedColumns: {
            start: 2
        },       
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" },
            {
                orderable: true,
                render: DataTable.render.select(),
                targets: 0
            }
        ],
        "order": [[groupColumn, "asc"], ["3", "asc"]], //Agencia (alfabetico) y ventaCreadoFecha
        "data": [],
        "aoColumns": [
            {
                "sDefaultContent": '',
            }, {
                "mData": "ventaId", "render": function (mData, disp, alldata) {
                    botonVisualizar = "<li class='info'><a href='javascript:void(0);' onclick='AbrirModalConsulta(" + alldata.ventaId + ");'><i class='icon-eye'></i></a></li>"
                    return mData
                }
            }, {
                "mData": "ventaCodigoExterno"
            }, {
                "mData": "ventaCreadoFecha", "render": function (mData, disp, alldata) {
                    const strfechaDesde = mData;
                    const fechaDesdeMoment = moment(strfechaDesde, "YYYY-MM-DD");
                    const dtfechaDesde = fechaDesdeMoment.toDate();
                    const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
                    const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
                    const strfechaDesdeAnh = dtfechaDesde.getFullYear();
                    const strfechaDesdeFin = strfechaDesdeDia + "/" + strfechaDesdeMes + "/" + strfechaDesdeAnh;
                    return strfechaDesdeFin
                }
            }, {
                "mData": "ventaFechaVigenciaInicio", "render": function (mData, disp, alldata) {
                    const strfechaDesde = mData;
                    const fechaDesdeMoment = moment(strfechaDesde, "YYYY-MM-DD");
                    const dtfechaDesde = fechaDesdeMoment.toDate();
                    const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
                    const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
                    const strfechaDesdeAnh = dtfechaDesde.getFullYear();
                    const strfechaDesdeFin = strfechaDesdeDia + "/" + strfechaDesdeMes + "/" + strfechaDesdeAnh;
                    return strfechaDesdeFin
                }
            }, {
                "mData": "ventaFechaVigenciaFin", "render": function (mData, disp, alldata) {
                    const strfechaDesde = mData;
                    const fechaDesdeMoment = moment(strfechaDesde, "YYYY-MM-DD");
                    const dtfechaDesde = fechaDesdeMoment.toDate();
                    const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
                    const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
                    const strfechaDesdeAnh = dtfechaDesde.getFullYear();
                    const strfechaDesdeFin = strfechaDesdeDia + "/" + strfechaDesdeMes + "/" + strfechaDesdeAnh;
                    return strfechaDesdeFin
                }
            }, {
                "mData": "ventaProductoNombre"
            }, {
                "mData": "ventaClienteApellidoNombre", "render": function (mData, disp, alldata) {
                    const resultado = alldata.ventaClienteApellidos + ", " + alldata.ventaClienteNombres;
                    return "<span title='" + resultado + "'>" + resultado + "</span>";
                }
            }, {
                "mData": "ventaImporteVenta", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return data;
                }
            }, {
                "mData": "ventaEstadoNombre"
            }, {
                "mData": "ventaSituacionNombre"
            }, {
                "mData": "ventaCreadoUsuarioNombre"
            }, {
                "mData": "ventaClienteDocumentoNumero"
            }, {
                "mData": "ventaPaisNombre"
            }, {
                "mData": "ventaUsuarioAgenciaNombre", "bVisible": false
            }, {
                "mData": "ventaComisionImporte", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return data;
                }
            }, {
                "mData": "ventaIncentivoImporte", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return data;
                }
            }, {
                "mData": "ventaPagarLiquidacion", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return data;
                }
            }, {
                "mData": "ventaCobranzaPagoFechaString",
                "render": function (mData, disp, alldata) {
                    // Verificar si mData es null, undefined o vacío
                    if (!mData || mData === "" || mData === "0001-01-01T00:00:00" || mData === "1970-01-01T00:00:00") {
                        return "";
                    }                 

                        return mData;
                    
                }
            }, {
                "mData": "cobranzaDocumento"
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonVisualizar + "</ul>";
                }
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": false,
        rowCallback: function (row, data) {
        },
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var rowsData = api.rows({ page: 'current' }).data();
            var last = null;
            var storedIndexArray = [];
            var collapsedGroups = window.collapsedGroups || {};
            api.column(groupColumn, { page: 'current' })
                .data()
                .each(function (group, i) {
                    var groupKey = group.replace(/[^A-Za-z0-9]/g, '');
                    if (last !== group) {
                        storedIndexArray.push(i);
                        var esAgenciaVip = rowsData[i] && rowsData[i].ventaAgenciaVip == 1;
                        var iconoVip = esAgenciaVip ? '<i class="fa fa-star font-warning" title="Agencia VIP"></i> ' : '';
                        var isCollapsed = collapsedGroups[groupKey] || false;
                        $(rows)
                            .eq(i)
                            .before(
                                '<tr class="group group-start" data-group="' + groupKey + '"><td colspan="20" style="cursor:pointer;">' +
                                '<span class="toggle-group" style="font-weight:bold;">' + (isCollapsed ? '[+]' : '[-]') + '</span> ' +
                                iconoVip + group +
                                ' (<span class="group-count"></span>) </td></tr>'
                            );

                        last = group;
                    }
                });
            storedIndexArray.push(
                api.column(0, { page: "current" }).data().length
            );
            for (let i = 0; i < storedIndexArray.length - 1; i++) {
                let element = $(".group-count")[i];
                $(element).text(
                    storedIndexArray[i + 1] - storedIndexArray[i]
                );
            }
            // Oculta las filas de los grupos colapsados
            $('.group.group-start').each(function () {
                var groupKey = $(this).data('group');
                var isCollapsed = collapsedGroups[groupKey] || false;
                var next = $(this).nextUntil('.group.group-start');
                if (isCollapsed) {
                    next.hide();
                } else {
                    next.show();
                }
            });

            // Evento para expandir/colapsar un grupo
            $('.toggle-group').off('click').on('click', function () {
                var $groupRow = $(this).closest('.group.group-start');
                var groupKey = $groupRow.data('group');
                collapsedGroups[groupKey] = !collapsedGroups[groupKey];
                window.collapsedGroups = collapsedGroups;
                api.draw(false);
            });

            updateCollapseButtonText();
        },
        filter: true,
        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        bInfo: true,        
        scrollX: true,        
        scrollY: "600px",
        scrollCollapse: true,     
        info: true,
        ordering: true,
        processing: true,
        responsive: true,
        "autoWidth": false,
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        retrieve: true,
        orderCellsTop: true,
        fixedHeader: true,
        select: {
            style: 'multi',
            selector: 'td:first-child',
            items: 'row'
        },
        stateSave: true,
        initComplete: function () {
            var api = this.api();
            // For each column
            api
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    if (colIdx != 14) {
                        // Set the header cell to contain the input element
                        var cell = $('.filters th').eq(
                            $(api.column(colIdx).header()).index()
                        );
                        var title = $(cell).text();
                        var cursorPosition;
                        $(cell).html('<input type="text" placeholder="' + title + '" />');
                        // On every keypress in this input
                        $(
                            'input',
                            $('.filters th').eq($(api.column(colIdx).header()).index())
                        )
                            .off('keyup change')
                            .on('change', function (e) {
                                // Get the search value
                                $(this).attr('title', $(this).val());
                                var regexr = '({search})'; //$(this).parents('th').find('select').val();
                                cursorPosition = this.selectionStart;
                                // Search the column for that value
                                api
                                    .column(colIdx)
                                    .search(
                                        this.value != ''
                                            ? regexr.replace('{search}', '(((' + this.value + ')))')
                                            : '',
                                        this.value != '',
                                        this.value == ''
                                    )
                                    .draw();
                            })
                            .on('keyup', function (e) {
                                e.stopPropagation();

                                $(this).trigger('change');
                                $(this)
                                    .focus()[0]
                                    .setSelectionRange(cursorPosition, cursorPosition);
                            });
                    }
                });
        }
    });

    // Limpiar búsqueda global y filtros por columna sin borrar el estado (paginación/orden)
    try {
        // limpiar input de búsqueda global de DataTables
        const globalFilter = document.querySelector('#dtVenta_filter input');
        if (globalFilter) globalFilter.value = '';

        // limpiar inputs de filtros por columna creados en initComplete
        const headerFilters = document.querySelectorAll('.filters th input');
        headerFilters.forEach(i => i.value = '');

        // limpiar búsqueda de DataTables y redibujar sin cambiar la paginación
        if (tablaGrid && typeof tablaGrid.search === 'function') {
            tablaGrid.search('');
            tablaGrid.columns().search('');
            tablaGrid.draw(false);
        }
    } catch (e) {
        // ignorar errores
    }

    $("#cargar").show();
    let AgenciaId = 0;
    let AgenciaAgenciaId = 0;
    if (menuelOrigen !== 'U') {
        //AgenciaId = menuelAgenciaUsuarioId;
        AgenciaId = menuUserId
        AgenciaAgenciaId = menuelAgenciaUsuarioId
    } else {
        AgenciaId = menuUserId;
    }

    const BusquedaNumTarjeta = document.getElementById("mdvenNumTarjetaSearch").value;
    const BusquedaCodExterno = document.getElementById("mdvenCodExternoSearch").value;
    const BusquedaDesNombres = document.getElementById("mdvenTxtNombresSearch").value;
    const BusquedaDesApellidos = document.getElementById("mdvenTxtApellidosSearch").value;
    const BusquedaCodEstado = document.getElementById("mdvenSelEstadoSearch").value;
    const BusquedaCodSituacion = document.getElementById("mdvenSelSituacionSearch").value;


    let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value;
    let BusquedaCodAgencia = localStorage.getItem("lsagenciaIdSel");
    let BusquedaCodAgenciaUsuario = document.getElementById("mdvenSelUsuarioSearch").value;
    let BusquedaCodPromotor = document.getElementById("mdvenSelPromoSearch").value;

    if (BusquedaCodPais === "") {
        BusquedaCodPais = 0;
    }
    if (BusquedaCodPromotor === "") {
        BusquedaCodPromotor = 0;
    }
    if (BusquedaCodAgencia === "" || BusquedaCodAgencia == null) {
        BusquedaCodAgencia = 0;
        if (AgenciaAgenciaId !== 0) {
            BusquedaCodAgencia = AgenciaAgenciaId
        }
    }
    if (BusquedaCodAgenciaUsuario === "") {
        BusquedaCodAgenciaUsuario = 0;
    }

    let CodigoBusqueda = 0;
    if (BusquedaNumTarjeta !== "") {
        CodigoBusqueda = parseInt(BusquedaNumTarjeta);
    } else {
        CodigoBusqueda = 0;
    }

    const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;
    const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
    const dtfechaIni = fechaIniMoment.toDate();
    const dtfechaVigINI = formatearFechaString(dtfechaIni);
    const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
    const dtfechaFin = fechaFinMoment.toDate();
    const dtfechaVigFIN = formatearFechaString(dtfechaFin);

    const BusquedaTipoDoc = document.getElementById("mdvenSelTipoDocSearch").value;
    const BusquedaNumeDoc = document.getElementById("mdvenTxtDocumentoSearch").value;


    const listadoVentas = await getVentas(menuelOrigen, CodigoBusqueda, dtfechaVigINI, dtfechaVigFIN, AgenciaId, BusquedaDesNombres, BusquedaDesApellidos, BusquedaCodEstado, BusquedaCodSituacion, BusquedaCodExterno, BusquedaCodPais, BusquedaCodAgencia, BusquedaCodAgenciaUsuario, BusquedaTipoDoc, BusquedaNumeDoc, BusquedaCodPromotor);
    
    if (listadoVentas !== undefined) {
        if (listadoVentas.length > 0) {
            tablaGrid.clear().draw();
            tablaGrid.rows.add(listadoVentas).draw();

        }
    } else {
        const listadoVacio = [];
        tablaGrid.clear().draw();
        tablaGrid.rows.add(listadoVacio).draw();
    }
    $("#cargar").hide();
}
$('#btnCollapseAllGroups').off('click').on('click', function () {
    var api = $('#dtVenta').DataTable();
    var collapsedGroups = window.collapsedGroups || {};
    var allCollapsed = true;

    // Verifica si todos los grupos están colapsados
    api.column(groupColumn, { page: 'current' })
        .data()
        .each(function (group) {
            var groupKey = group.replace(/[^A-Za-z0-9]/g, '');
            if (!collapsedGroups[groupKey]) {
                allCollapsed = false;
            }
        });

    // Si todos están colapsados, expande todos; si no, colapsa todos
    api.column(groupColumn, { page: 'current' })
        .data()
        .each(function (group) {
            var groupKey = group.replace(/[^A-Za-z0-9]/g, '');
            collapsedGroups[groupKey] = !allCollapsed;
        });

    window.collapsedGroups = collapsedGroups;
    api.draw(false);
});

// Actualiza el texto del botón al cargar la tabla
function updateCollapseButtonText() {
    var api = $('#dtVenta').DataTable();
    var collapsedGroups = window.collapsedGroups || {};
    var allCollapsed = true;
    api.column(groupColumn, { page: 'current' })
        .data()
        .each(function (group) {
            var groupKey = group.replace(/[^A-Za-z0-9]/g, '');
            if (!collapsedGroups[groupKey]) {
                allCollapsed = false;
            }
        });
    if (allCollapsed) {
        $('#btnCollapseAllGroups').text('Expandir todo');
    } else {
        $('#btnCollapseAllGroups').text('Colapsar todo');
    }
}

async function getVentas(pOrigen, pIdVenta, pfechaIni, pfechaFin, pIdusuario, pNombres, pApellidos, pEstado, pSituacion, pCodExt, pPais, pAgencia, pUsuarioAgencia, pTipoDoc, pNumeDoc, pPromotor) {
    const urlApiFecht = menuUrlApi + "Venta/VentasObtener";
    const urlParametro = "?pOrigen=" + pOrigen + "&pVentaIngresoInicio=" + pfechaIni + "&pVentaIngresoFin=" + pfechaFin + "&pVentaID=" + pIdVenta + "&pUsuarioId=" + pIdusuario + "&pEstadoId=" + pEstado + "&pSituacionId=" + pSituacion + "&pAgenciaId=" + pAgencia + "&pAgenciaUsuarioId=" + pUsuarioAgencia + "&pClienteNombres=" + pNombres + "&pClienteApellidos=" + pApellidos + "&pPaisId=" + pPais + "&pCodigoExterno=" + pCodExt + "&pTipoDoc=" + pTipoDoc + "&pNumeDoc=" + pNumeDoc + "&pPromotorId=" + (pPromotor || 0);
    //console.log(urlApiFecht + urlParametro);
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            console.log(object3);
            return object3;
        }
    }
}


async function permisoEditar() {
    const elPermiso = await getValidarUsuarioMenu(menuUserId, 100);
    
    if (elPermiso.codigo > 0) {
        $('#mdvenSelComisionRead').prop('readonly', false);
        $('#mdvenSelIncentivoRead').prop('readonly', false);
        $('#mdvenPorPagarRead').prop('readonly', false);
        $('#mdvenFechaCancelacionRead').prop('readonly', false);
        $('#mdvenSelIncentivoPostRead').prop('readonly', false);
        $('#mdvenFechaIncentivoPagoRead').prop('readonly', false);
        $('#mdvenTxtObsVenta').prop('readonly', false);
        $('#btnActualizarVenta').show();
    } else {
        $('#mdvenSelComisionRead').prop('readonly', true);
        $('#mdvenSelIncentivoRead').prop('readonly', true);
        $('#mdvenPorPagarRead').prop('readonly', true);
        $('#mdvenFechaCancelacionRead').prop('readonly', true);
        $('#mdvenSelIncentivoPostRead').prop('readonly', true);
        $('#mdvenFechaIncentivoPagoRead').prop('readonly', true);
        $('#mdvenTxtObsVenta').prop('readonly', true);
        $('#btnActualizarVenta').hide();
    }
}

async function AbrirModalConsulta(id) {
    document.getElementById('mdHidIdVentaTarjeta').value = id;
    const eltitulo = document.getElementById("tituloModalVentaRead");
    eltitulo.innerHTML = "Consulta Venta : " + id;
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    let optionsVacia = [{ day: 'numeric' }, { month: 'numeric' }, { year: 'numeric' }];
    const dtfechaIniVacia = join(new Date(1900, 0, 1), optionsVacia, '/');
    const dtfechaFinVacia = join(new Date(1900, 0, 1), optionsVacia, '/');
    const laVenta = await getVentas(menuelOrigen, id, dtfechaIniVacia, dtfechaFinVacia, AgenciaId, '', '', '', '', '', 0, 0, 0, "", "");
    if (laVenta !== undefined) {
        if (laVenta.length > 0) {
            window.LaVenta = laVenta[0];
            let divEstado = document.getElementById('estadoModalVentaRead');
            divEstado.setAttribute("class", " derecha badge rounded-pill badge-info");
            divEstado.innerHTML = "ESTADO: " + laVenta[0].ventaEstadoNombre
            let divSituacion = document.getElementById('situacionModalVentaRead');
            divSituacion.setAttribute("class", "badge rounded-pill badge-success");
            divSituacion.innerHTML = "SITUACION: " + laVenta[0].ventaSituacionNombre

            let divVip = document.getElementById('vipModalVentaRead');
            if (laVenta[0].ventaClienteVip == 1) {
                divVip.setAttribute("class", "badge rounded-pill badge-warning");
                divVip.innerHTML = '<i class="fa fa-star"></i> VIP';
            } else {
                divVip.setAttribute("class", "");
                divVip.innerHTML = "";
            }

            if (laVenta[0].ventaSituacionNombre == "VIGENTE") {
                document.getElementById("btnImprimirVenta").hidden = false;
            } else {
                document.getElementById("btnImprimirVenta").hidden = true;
            }

            if (laVenta[0].ventaFechaVigenciaInicio !== "0001-01-01T00:00:00" && laVenta[0].ventaFechaVigenciaInicio !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(laVenta[0].ventaFechaVigenciaInicio, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdvenFecIncioVigRead").value = formatearFechaString(dtfecha);                
            }
            if (laVenta[0].ventaFechaVigenciaFin !== "0001-01-01T00:00:00" && laVenta[0].ventaFechaVigenciaFin !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(laVenta[0].ventaFechaVigenciaFin, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdvenFecFinalVigRead").value = formatearFechaString(dtfecha);                
            }
            document.getElementById("mdvenDiasVigRead").value = laVenta[0].ventaNumeroDias;
            document.getElementById("mdvenOrigenVigRead").value = laVenta[0].ventaOrigen;
            document.getElementById("mdvenDestinoVigRead").value = laVenta[0].ventaDestino;
            document.getElementById("mdvenSelProductoProdRead").value = laVenta[0].ventaProductoNombre;
            document.getElementById("mdvenSelProductoProdPromoRead").value = laVenta[0].ventaPromocionNombre;
            document.getElementById("mdvenEdadMinProdRead").value = laVenta[0].ventaProductoEdadMinima;
            document.getElementById("mdvenEdadMaxProdRead").value = laVenta[0].ventaProductoEdadMaxima;
            document.getElementById("mdvenTarifaProdRead").value = parseFloat(laVenta[0].ventaImporteVenta).toFixed(2);
            document.getElementById("mdvenTxtNombresEmerRead").value = laVenta[0].ventaContactoNombres;
            document.getElementById("mdvenTxtCorreoEmerRead").value = laVenta[0].ventaContactoEmail;
            document.getElementById("mdvenTxtDireccEmerRead").value = laVenta[0].ventaContactoDireccion;
            document.getElementById("mdvenTxtDistritoEmerRead").value = laVenta[0].ventaContactoDistrito;
            document.getElementById("mdvenTxtMovilEmerRead").value = laVenta[0].ventaContactoTelefono;
            document.getElementById("mdvenTxtPaisEmerRead").value = laVenta[0].ventaContactoPais;
            document.getElementById("mdvenSelTipoDocClienRead").value = laVenta[0].ventaClienteDocumentoTipoNombre;
            document.getElementById("mdvenTxtNumDocumentoClienRead").value = laVenta[0].ventaClienteDocumentoNumero;
            document.getElementById("mdvenTxtNombresClienRead").value = laVenta[0].ventaClienteNombres;
            document.getElementById("mdvenTxtApellidosClienRead").value = laVenta[0].ventaClienteApellidos;
            if (laVenta[0].ventaClienteFechaNacimiento !== "0001-01-01T00:00:00" && laVenta[0].ventaClienteFechaNacimiento !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(laVenta[0].ventaClienteFechaNacimiento, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdvenTxtFecNacClienRead").value = formatearFechaString(dtfecha);
            }
            document.getElementById("mdvenTxtEdadClienRead").value = laVenta[0].ventaClienteEdad;
            document.getElementById("mdvenTxtCorreoClienRead").value = laVenta[0].ventaClienteEmail;
            document.getElementById("mdvenTxtMovilClienRead").value = laVenta[0].ventaClienteTelefono;
            document.getElementById("mdvenTxtDireccionClienRead").value = laVenta[0].ventaClienteDireccion;
            document.getElementById("mdvenTxtDistritoClienRead").value = laVenta[0].ventaClienteDistrito;
            document.getElementById("mdvenTxtCiudadClienRead").value = laVenta[0].ventaClienteCiudad;
            document.getElementById("mdvenTxtPaisClienRead").value = laVenta[0].ventaClientePais;
            document.getElementById("mdvenCounterVigRead").value = laVenta[0].ventaCounter;
            document.getElementById("mdvenTxtNacionalidadRead").value = laVenta[0].ventaNacionalidad;
            document.getElementById("mdvenTxtObsVenta").value = laVenta[0].ventaObservacion;

            $('#mdvenSelComisionRead').val(laVenta[0].ventaComisionImporte);
            $('#mdvenSelIncentivoRead').val(laVenta[0].ventaIncentivoImporte);
            $('#mdvenPorPagarRead').val(laVenta[0].ventaPagarLiquidacion);
            if (laVenta[0].ventaCobranzaPagoFecha !== "0001-01-01T00:00:00" && laVenta[0].ventaCobranzaPagoFecha !== "1970-01-01T00:00:00") {
                const fechaPagoMoment = moment(laVenta[0].ventaCobranzaPagoFecha, "YYYY-MM-DD");
                const dtfechaPago = fechaPagoMoment.toDate();
                document.getElementById("mdvenFechaCancelacionRead").value = formatearFechaString(dtfechaPago);                
            }
            
            $('#mdvenDocumentoRead').val(laVenta[0].cobranzaDocumento);

            const laGestionIncentivos = await getVentaGestionIncentivos(id);
            if (laGestionIncentivos !== undefined && laGestionIncentivos.length > 0) {
                $('#mdvenSelIncentivoPostRead').val(laGestionIncentivos[0].ventaIncentivoPostImporte);
                if (laGestionIncentivos[0].ventaIncentivoFechaPago !== "0001-01-01T00:00:00" && laGestionIncentivos[0].ventaIncentivoFechaPago !== "1970-01-01T00:00:00") {
                    const fechaIncentivoPagoMoment = moment(laGestionIncentivos[0].ventaIncentivoFechaPago, "YYYY-MM-DD");
                    const dtfechaIncentivoPago = fechaIncentivoPagoMoment.toDate();
                    document.getElementById("mdvenFechaIncentivoPagoRead").value = formatearFechaString(dtfechaIncentivoPago);
                } else {
                    document.getElementById("mdvenFechaIncentivoPagoRead").value = "";
                }
            } else {
                $('#mdvenSelIncentivoPostRead').val("");
                document.getElementById("mdvenFechaIncentivoPagoRead").value = "";
            }

            await permisoEditar();
        }
    }
    $('#popupModalVentaRead').modal('show');

}
async function getVentaGestionIncentivos(pVentaId) {
    const urlApiFecht = menuUrlApi + "Venta/VentaGestionIncentivosObtener";
    const urlParametro = "?pVentaId=" + pVentaId;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            return object3;
        }
    }
}
async function AbrirModalBusqueda() {
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    if (AgenciaId === 0) {
        $('#divVenSelPaisSearch').show();
        $('#divVenSelAgenciaSearch').show();
        $('#divVenSelPromotorSearch').show();
    } else {
        $('#divVenSelPaisSearch').hide();
        $('#divVenSelAgenciaSearch').hide();
        $('#divVenSelPromotorSearch').hide();
    }
    //localStorage.removeItem('lsagenciaIdSel');   

    //limpiarModalBuqueda()
    $('#popupModalVentaSearch').modal('show');
}
async function limpiarModalBuqueda() {
    IniciarFechasBsuqueda();
    localStorage.removeItem('lsagenciaIdSelVenta');
    localStorage.removeItem('lsagenciaIdSel');
    document.getElementById("mdvenNumTarjetaSearch").value = "";
    document.getElementById("mdvenCodExternoSearch").value = "";
    document.getElementById("mdvenTxtNombresSearch").value = "";
    document.getElementById("mdvenTxtApellidosSearch").value = "";
    document.getElementById("mdvenSelPaisSearch").value = "";
    document.getElementById("mdvenSelPromoSearch").value = "";
    document.getElementById("txtAgencia").value = "";
    document.getElementById("mdvenSelUsuarioSearch").value = "";
    document.getElementById("mdvenSelEstadoSearch").value = "";
    document.getElementById("mdvenSelSituacionSearch").value = "";
    document.getElementById("mdvenSelTipoDocSearch").value = "";
    document.getElementById("mdvenTxtDocumentoSearch").value = "";
}
async function clickBuscarLimpiar() {
    limpiarModalBuqueda();
}
async function clickBuscarVentas() {
    CargarTodo()
    $('#popupModalVentaSearch').modal('hide');
    IniciarTablaClick();
}
async function IniciarFechasBsuqueda() {
    const fechaHoy = new Date();
    const dtfechaHoy = new Date(fechaHoy.setDate(fechaHoy.getDate()));
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;

    const fechaMes = new Date();
    const fecha1mes = new Date(fechaMes.setDate(fechaMes.getDate()));
    const strfecha1mesDia = ("0" + fecha1mes.getDate()).slice(-2)
    const strfecha1mesMes = ("0" + (fecha1mes.getMonth() + 1)).slice(-2)
    const strfecha1mesAnh = fecha1mes.getFullYear();
    const strfecha1mesFin = strfecha1mesAnh + "-" + strfecha1mesMes + "-" + strfecha1mesDia;

    document.getElementById("mdvenFecIncioVigSearch").value = strfecha1mesFin;
    document.getElementById("mdvenFecFinalVigSearch").value = strfechaHoyFin;
    $('#btnActualizarVenta').hide();
    
}
//TAB DATOS PRINCIPAL
async function exportaReporteVenta() {
    const sesionActiva = await fetch('/validateJS', { credentials: 'include' });
    if (!sesionActiva.ok) {
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return;
    }
    const tablaGrid = $('#dtVenta').DataTable();
    const dataVentas = tablaGrid.rows().data();
    if (dataVentas.length == 0) {
        mostrarMensaje(2, "No existe información para generar el excel de ventas.");
        return false;
    }
    showLoader();
    try {
        let AgenciaId = 0;
        let AgenciaAgenciaId = 0;
        if (menuelOrigen !== 'U') {
            AgenciaId = menuUserId
            AgenciaAgenciaId = menuelAgenciaUsuarioId
        }
        const BusquedaNumTarjeta = document.getElementById("mdvenNumTarjetaSearch").value;
        const BusquedaCodExterno = document.getElementById("mdvenCodExternoSearch").value;
        const BusquedaDesNombres = document.getElementById("mdvenTxtNombresSearch").value;
        const BusquedaDesApellidos = document.getElementById("mdvenTxtApellidosSearch").value;
        const BusquedaCodEstado = document.getElementById("mdvenSelEstadoSearch").value;
        const BusquedaCodSituacion = document.getElementById("mdvenSelSituacionSearch").value;
        let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value;
        let BusquedaCodAgencia = localStorage.getItem("lsagenciaIdSel");
        let BusquedaCodAgenciaUsuario = document.getElementById("mdvenSelUsuarioSearch").value;
        let BusquedaCodPromotor = document.getElementById("mdvenSelPromoSearch").value;
        if (BusquedaCodPais === "") {
            BusquedaCodPais = 0;
        }
        if (BusquedaCodPromotor === "") {
            BusquedaCodPromotor = 0;
        }
        if (BusquedaCodAgencia === "" || BusquedaCodAgencia ===null) {
            BusquedaCodAgencia = 0;
            if (AgenciaAgenciaId !== 0) {
                BusquedaCodAgencia = AgenciaAgenciaId
            }
        }
        if (BusquedaCodAgenciaUsuario === "") {
            BusquedaCodAgenciaUsuario = 0;
        }
        let CodigoBusqueda = 0;
        if (BusquedaNumTarjeta !== "") {
            CodigoBusqueda = parseInt(BusquedaNumTarjeta);
        } else {
            CodigoBusqueda = 0;
        }
        const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
        const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;
        const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
        const dtfechaIni = fechaIniMoment.toDate();
        const dtfechaVigINI = formatearFechaString(dtfechaIni);
        const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
        const dtfechaFin = fechaFinMoment.toDate();
        const dtfechaVigFIN = formatearFechaString(dtfechaFin);
        const BusquedaTipoDoc = document.getElementById("mdvenSelTipoDocSearch").value;
        const BusquedaNumeDoc = document.getElementById("mdvenTxtDocumentoSearch").value;
        const ventasParama = {
            pOrigen: menuelOrigen,
            pVentaIngresoInicio: dtfechaVigINI,
            pVentaIngresoFin: dtfechaVigFIN,
            pVentaID: CodigoBusqueda.toString(),
            pUsuarioId: menuUserId, //AgenciaId.toString(),
            pEstadoId: BusquedaCodEstado,
            pSituacionId: BusquedaCodSituacion,
            pAgenciaId: BusquedaCodAgencia.toString(),
            pAgenciaUsuarioId: BusquedaCodAgenciaUsuario.toString(),
            pClienteNombres: BusquedaDesNombres,
            pClienteApellidos: BusquedaDesApellidos,
            pPaisId: BusquedaCodPais.toString(),
            pCodigoExterno: BusquedaCodExterno,
            pTipoDoc: BusquedaTipoDoc,
            pNumeDoc: BusquedaNumeDoc,
            pPromotorId: BusquedaCodPromotor.toString(),
        };
        let response = await fetch('/ReporteVentaGenerarExcel', {
            method: 'POST',
            headers: {
                'Accept': 'application/octet-stream',  // Expecting a PDF response
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ventasParama)
        });
        if (response.ok) {
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = '';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const fileNameMatch = contentDisposition.match(/filename\*?=\s*['"]?([^'";\s]+)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1];
                }
            }
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            CargarTodo();
        } else {
            mostrarMensaje(1, "Error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {
        hideLoader();
    }
}
async function exportaExcelVenta() {
    const sesionActiva = await fetch('/validateJS', { credentials: 'include' });
    if (!sesionActiva.ok) {
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return;
    }
    const tablaGrid = $('#dtVenta').DataTable();
    const dataVentas = tablaGrid.rows().data();
    if (dataVentas.length == 0) {
        mostrarMensaje(2, "No existe información para generar el excel de datos.");
        return false;
    }
    showLoader();
    try {
        let AgenciaId = 0;
        let AgenciaAgenciaId = 0;
        if (menuelOrigen !== 'U') {
            AgenciaId = menuUserId
            AgenciaAgenciaId = menuelAgenciaUsuarioId
        }
        const BusquedaNumTarjeta = document.getElementById("mdvenNumTarjetaSearch").value;
        const BusquedaCodExterno = document.getElementById("mdvenCodExternoSearch").value;
        const BusquedaDesNombres = document.getElementById("mdvenTxtNombresSearch").value;
        const BusquedaDesApellidos = document.getElementById("mdvenTxtApellidosSearch").value;
        const BusquedaCodEstado = document.getElementById("mdvenSelEstadoSearch").value;
        const BusquedaCodSituacion = document.getElementById("mdvenSelSituacionSearch").value;
        let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value;
        let BusquedaCodAgencia = localStorage.getItem("lsagenciaIdSel");
        let BusquedaCodAgenciaUsuario = document.getElementById("mdvenSelUsuarioSearch").value;
        let BusquedaCodPromotor = document.getElementById("mdvenSelPromoSearch").value;
        if (BusquedaCodPais === "") {
            BusquedaCodPais = 0;
        }
        if (BusquedaCodPromotor === "") {
            BusquedaCodPromotor = 0;
        }
        if (BusquedaCodAgencia === "" || BusquedaCodAgencia === null) {
            BusquedaCodAgencia = 0;
            if (AgenciaAgenciaId !== 0) {
                BusquedaCodAgencia = AgenciaAgenciaId
            }
        }
        if (BusquedaCodAgenciaUsuario === "") {
            BusquedaCodAgenciaUsuario = 0;
        }
        let CodigoBusqueda = 0;
        if (BusquedaNumTarjeta !== "") {
            CodigoBusqueda = parseInt(BusquedaNumTarjeta);
        } else {
            CodigoBusqueda = 0;
        }
        const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
        const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;
        const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
        const dtfechaIni = fechaIniMoment.toDate();
        const dtfechaVigINI = formatearFechaString(dtfechaIni);
        const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
        const dtfechaFin = fechaFinMoment.toDate();
        const dtfechaVigFIN = formatearFechaString(dtfechaFin);
        const BusquedaTipoDoc = document.getElementById("mdvenSelTipoDocSearch").value;
        const BusquedaNumeDoc = document.getElementById("mdvenTxtDocumentoSearch").value;
        const ventasParama = {
            pOrigen: menuelOrigen,
            pVentaIngresoInicio: dtfechaVigINI,
            pVentaIngresoFin: dtfechaVigFIN,
            pVentaID: CodigoBusqueda.toString(),
            pUsuarioId: menuUserId, //AgenciaId.toString(),
            pEstadoId: BusquedaCodEstado,
            pSituacionId: BusquedaCodSituacion,
            pAgenciaId: BusquedaCodAgencia.toString(),
            pAgenciaUsuarioId: BusquedaCodAgenciaUsuario.toString(),
            pClienteNombres: BusquedaDesNombres,
            pClienteApellidos: BusquedaDesApellidos,
            pPaisId: BusquedaCodPais.toString(),
            pCodigoExterno: BusquedaCodExterno,
            pTipoDoc: BusquedaTipoDoc,
            pNumeDoc: BusquedaNumeDoc,
            pPromotorId: BusquedaCodPromotor.toString(),
        };
        let response = await fetch('/ListadoVentaGenerarExcel', {
            method: 'POST',
            headers: {
                'Accept': 'application/octet-stream',  // Expecting a PDF response
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ventasParama)
        });
        if (response.ok) {
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = '';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const fileNameMatch = contentDisposition.match(/filename\*?=\s*['"]?([^'";\s]+)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1];
                }
            }
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            CargarTodo();
        } else {
            mostrarMensaje(1, "Error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {
        hideLoader();
    }
}

let elvalidarActualizarVentaDatos = $("#modalDatosVentaRead").validate({
    rules: {       
        mdvenSelComisionRead: { required: true },
        mdvenSelIncentivoRead: { required: true },
        mdvenPorPagarRead: {required: true},
        mdvenFechaCancelacionRead: {required: true}
    },
    messages: {        
        mdvenSelComisionRead: {
            required: "Debe ingresar importe de comisión."
        },
        mdvenSelIncentivoRead: {
            required: "Debe ingresar importe de incentivo."
        },
        mdvenPorPagarRead: {
            required: "Debe ingresar importe por pagar."
        },
        mdvenFechaCancelacionRead: {
            required: "Debe ingresar fecha de cancelación."
        }
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
async function clickValidarActualizar() {
    if ($("#modalDatosVentaRead").valid()) {
        const resultado = await ProcesarActualizarVenta();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaRead').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function ProcesarActualizarVenta() {
    const ladatFechaIniV = document.getElementById("mdvenFechaCancelacionRead");    
    let fechaFormateaIniV;
    if (ladatFechaIniV.value == "") {
        const fecha = new Date(0);
        fechaFormateaIniV = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaIniV.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaIniV = formatearFechaString(dtfechaIniV);
    }    
       
    const eltxtComision = document.getElementById("mdvenSelComisionRead");
    const eltxtIncentivo = document.getElementById("mdvenSelIncentivoRead");

    const eltxtPorPagar = document.getElementById("mdvenPorPagarRead");
    const eltxtDocumento = document.getElementById("mdvenDocumentoRead");
    const eltxtObsVenta = document.getElementById("mdvenTxtObsVenta");
    let idVenta = document.getElementById('mdHidIdVentaTarjeta').value;

    const dataEnviar = {
        ventaId: idVenta,
        ventaCobranzaPagoFecha: fechaFormateaIniV,
        ventaComisionImporte: parseFloat(eltxtComision.value).toFixed(4),
        ventaIncentivoImporte: parseFloat(eltxtIncentivo.value).toFixed(4),
        ventaPagarLiquidacion: parseFloat(eltxtPorPagar.value).toFixed(4),
        ventaCreadoUsuarioId: menuUserId,
        ventaObservacion: eltxtObsVenta.value,
    };
    console.log(dataEnviar);
    const resultado = await postVentaActualizarProcesar(dataEnviar);
    if (resultado.errorCodigo == 200) {
        const resultadoIncentivos = await ProcesarGestionIncentivos(idVenta, eltxtObsVenta.value);
        if (resultadoIncentivos.errorCodigo != 200) {
            return resultadoIncentivos;
        }
    }
    return resultado;
}
async function ProcesarGestionIncentivos(idVenta, obsVenta) {
    const eltxtIncentivoPost = document.getElementById("mdvenSelIncentivoPostRead");
    const eldatFechaIncentivoPago = document.getElementById("mdvenFechaIncentivoPagoRead");

    let fechaFormateaIncentivoPago;
    if (eldatFechaIncentivoPago.value == "") {
        const fecha = new Date(0);
        fechaFormateaIncentivoPago = formatearFechaString(fecha);
    } else {
        const fechaIncentivoPagoMoment = moment(eldatFechaIncentivoPago.value, "YYYY-MM-DD");
        const dtfechaIncentivoPago = fechaIncentivoPagoMoment.toDate();
        fechaFormateaIncentivoPago = formatearFechaString(dtfechaIncentivoPago);
    }

    const dataEnviar = {
        ventaId: idVenta,
        ventaIncentivoPostImporte: eltxtIncentivoPost.value == "" ? 0 : parseFloat(eltxtIncentivoPost.value).toFixed(4),
        ventaIncentivoFechaPago: fechaFormateaIncentivoPago,
        ventaCreadoUsuarioId: menuUserId,
        ventaObservacion: obsVenta,
    };
    const resultado = await postVentaGestionIncentivosProcesar(dataEnviar);
    return resultado;
}
async function postVentaActualizarProcesar(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentaActualizarProcesar";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
async function postVentaGestionIncentivosProcesar(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentaGestionIncentivosProcesar";
    const elbody = JSON.stringify(enviarBody);
    const response = await fetch(urlApiFecht, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
        body: elbody
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
