hideLoader();
ReseteoLocalStorage();
cargarCombosBusqueda();
IniciarFechasBsuqueda();
CargarTodo();
IniciarTablaClick();
cargarCombosCancelar();

async function colapsarTodo() {
    // Invoca el click del botón al terminar de cargar la tabla
    $('#btnCollapseAllGroups').trigger('click');
}
function ReseteoLocalStorage() {
    localStorage.removeItem('lsliquidacionSel');
}
function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}
$('#mdvenSelTipoLiquiCance').change(async function () {
    const tipoDoc = $(this).val();
    const elcomboTipoSerie = await getValoresTipo('serieCobranza', 1, tipoDoc);
    if (elcomboTipoSerie !== undefined) {
        let cantElementos15 = elcomboTipoSerie.length;
        if (cantElementos15 > 0) {
            $('#mdvenTxtSerieLiquiCance').val(elcomboTipoSerie[0].valorNombre);
        } else {
            $('#mdvenTxtSerieLiquiCance').val("");
        }
    } else {
        $('#mdvenTxtSerieLiquiCance').val("");
    }
});
//LISTADO PRINCIPAL
async function clickValidarCancelacion() {
    if ($("#modalDatosVentaCancelar").valid()) {

        document.getElementById("btnGrabarVentasCancelar").disabled = true;

        const resultado = await procesarCancelcacion();
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            $('#popupModalVentaCancelar').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function ventasExtornar() {
    const checkExtornar = [];
    const tablaGrid = $('#dtVenta').DataTable();
    let contador = 0;
    tablaGrid.rows().every(function () {
        const cell = this.node();
        const data = this.data();
        const objeto = $(cell).find('input[type="checkbox"]')
        if (objeto.length > 0) {
            if (objeto[0].checked) {
                const row = cell.closest('tr');
                const idVenta = row.cells[3].innerText;
                //const estado = row.cells[9].innerText;
                const situa = row.cells[10].innerText;
                if (situa === "CANCELADO") {
                    if (idVenta === data.ventaId.toString()) {
                        const venta = {
                            idVenta: parseInt(idVenta),
                            idAgencia: parseInt(data.ventaUsuarioAgenciaId),
                            desSituacion: situa,
                            codLiquidacion: parseInt(data.ventaCodigoLiquidacion)
                        };
                        checkExtornar.push(venta);
                        contador += 1;
                    }
                } else {
                    if (situa === "PENDIENTE") {
                        tablaGrid.row(this.index()).deselect();
                    }
                }
            }
        }
    });
    if (contador == 0) {
        mostrarMensaje(3, "Seleccione como minimo una venta CANCELADA, para realizar el extorno.");
        return false;
    }
    const reultado = verificarAgenciasRepetidas(checkExtornar,'C');
    if (reultado != "") {
        mostrarMensaje(3, reultado);
        return false;
    }
    const alerta = await swal({
        title: "¿Está seguro de extornar las ventas?",
        text: "Se van extornar las ventas canceladas.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        let resultadoDes = "";
        let cantidadOK = 0;
        let cantidadEror = 0;
        for (const venta of checkExtornar) {
            const ventaId = venta.idVenta;
            const resultado = await postLiquidacionExtornar(ventaId);
            if (resultado.errorCodigo == 200) {
                cantidadOK += 1;
                resultadoDes = "Se extorno correctamente";
            } else {
                cantidadEror += 1;
                if (resultadoDes === "") {
                    resultadoDes = String(ventaId) + " - " + resultado.errorDescripcion  ;
                } else {
                    resultadoDes += " , " + String(ventaId) + " - " + resultado.errorDescripcion;
                }
            }
        }
        if (cantidadEror > 0 && cantidadOK > 0) {
            CargarTodo();
            mostrarMensaje(3, resultadoDes);
            return false;
        } else if (cantidadEror === 0 && cantidadOK > 0) {
            CargarTodo();
            mostrarMensaje(1, resultadoDes);
            return false;
        } else if (cantidadEror > 0 && cantidadOK === 0) {
            CargarTodo();
            mostrarMensaje(2, resultadoDes);
            return false;
        }

    }
}
async function postLiquidacionExtornar(id) {
    const urlApiFecht = menuUrlApi + "liquidacion/LiqExtornarProcesar";
    const urlParametro = "?pVentaID=" + id + "&pVentaSituacionId=P";
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}
async function procesarCancelcacion() {
    const resultadoCorrelativo = await generarCodigoCorrelativo('cobranzaId');
    let idCobranza = resultadoCorrelativo.errorCodigo;
    const txtCobranzaCliente = document.getElementById("mdvenTxtClieLiquiCance");
    const txtCobranzaDocumentoSerie = document.getElementById("mdvenTxtSerieLiquiCance");
    const txtCobranzaDocumentoCorrelativo = document.getElementById("mdvenTxtCorreLiquiCance");
    const txtCobranzaObservaciones = document.getElementById("mdvenTxtObservaLiquiCance");
    const ladatFechaPago =  document.getElementById("mdvenFecPagooLiquiCance")
    let fechaFormateaPago;
    if (ladatFechaPago.value == "") {
        const fecha = new Date(0);
        fechaFormateaPago = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaPago.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaPago = formatearFechaString(dtfechaIniV);
    }
    const txtCobranzaComision = document.getElementById("mdvenTxtComisionLiquiCance");
    const txtCobranzaIncentivo = document.getElementById("mdvenTxtIncentLiquiCance");
    const txtCobranzaDescuento = document.getElementById("mdvenTxtImpDescuento");
    const txtCobranzaNotaCredito = document.getElementById("mdvenTxtImpCreditoLiquiCance");
    const txtCobranzaImporteBruto=document.getElementById("mdvenTxtImpBrutoLiquiCance");
    const txtCobranzaImpPago = document.getElementById("mdvenTxtImpPagoLiquiCance");
    const elcboTipoDoc= document.getElementById("mdvenSelTipoLiquiCance");
    const valoreselcboTipoDoc = elcboTipoDoc.options[elcboTipoDoc.selectedIndex].value;
    const elcboCobrador = document.getElementById("mdvenSelCobradorLiquiCance");
    const valoreselcboCobrador = elcboCobrador.options[elcboCobrador.selectedIndex].value;
    const txtVentas = document.getElementById("mdHidIdVentas");
    const txtCodLiquidacion = document.getElementById("mdHidCodLiquidacion");
    const elcboMetoPago = document.getElementById("mdvenSelMetoPagoLiquiCance");
    const valoreselcboMetoPago = elcboMetoPago.options[mdvenSelMetoPagoLiquiCance.selectedIndex].value;

    const dataEnviar = {
        cobranzaId: idCobranza,
        cobranzaCliente: txtCobranzaCliente.value,
        cobranzaDocumentoTipoId: valoreselcboTipoDoc,
        cobranzaDocumentoSerie: txtCobranzaDocumentoSerie.value,
        cobranzaDocumentoCorrelativo: txtCobranzaDocumentoCorrelativo.value,
        cobranzaComision: parseFloat(txtCobranzaComision.value).toFixed(2),
        cobranzaIncentivo: parseFloat(txtCobranzaIncentivo.value).toFixed(2),
        cobranzaPagoMedioId: valoreselcboMetoPago,
        cobranzaPagoFecha: fechaFormateaPago,
        cobranzaNotaCredito: parseFloat(txtCobranzaNotaCredito.value).toFixed(2),
        cobranzaCobradorId: valoreselcboCobrador,
        cobranzaImporteBruto: parseFloat(txtCobranzaImporteBruto.value).toFixed(2),
        cobranzaImportePago: parseFloat(txtCobranzaImpPago.value).toFixed(2),
        cobranzaObservacion: txtCobranzaObservaciones.value,
        cobranzaCreadoUsuarioId: parseInt(menuUserId),
        cobranzaVentaIds: txtVentas.value,
        cobranzaDescuento: txtCobranzaDescuento.value,
        cobranzaCodigoLiquidacion: txtCodLiquidacion.value
    };
    //console.log(dataEnviar);
    const resultado = await postLiquidacionCancelar(dataEnviar);
    return resultado;
}
async function postLiquidacionCancelar(enviarBody) {
    const urlApiFecht = menuUrlApi + "liquidacion/LiqCancelarProcesar";
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
let elvalidarCancelacion = $("#modalDatosVentaCancelar").validate({
    rules: {
        mdvenSelTipoLiquiCance: "required",
        mdvenFecPagooLiquiCance: "required",
        mdvenSelCobradorLiquiCance: "required",
        mdvenTxtCorreLiquiCance: {
            required: true,
            minlength: 1,
            maxlength: 50,
        }
    },
    messages: {
        mdvenSelTipoLiquiCance: "Seleccione un tipo de documento.",
        mdvenFecPagooLiquiCance: "Seleccione una fecha pago.",
        mdvenSelCobradorLiquiCance: "Seleccione un cobrador.",
        mdvenTxtCorreLiquiCance: {
            required: "Ingresar un correlativo.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 50 caracteres.",
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
async function cargarCombosCancelar() {
    const elcomboTipoDoc = await getValoresTipo('cobranzaDocumentoTipoId', 1);
    const elcomboCobrador = await getValoresTipo('cobranzaCobradorId', 1);
    const elcomboMedioPago = await getValoresTipo('cobranzaPagoMedioId', 1);
    if (elcomboTipoDoc !== undefined) {
        let cantElementos10 = elcomboTipoDoc.length;
        if (cantElementos10 > 0) {
            $('#mdvenSelTipoLiquiCance').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipoDoc) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelTipoLiquiCance').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    if (elcomboCobrador !== undefined) {
        let cantElementos11 = elcomboCobrador.length;
        if (cantElementos11 > 0) {
            $('#mdvenSelCobradorLiquiCance').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboCobrador) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelCobradorLiquiCance').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    if (elcomboMedioPago !== undefined) {
        let cantElementos12 = elcomboMedioPago.length;
        if (cantElementos12 > 0) {
            $('#mdvenSelMetoPagoLiquiCance').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboMedioPago) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelMetoPagoLiquiCance').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

}
async function AbrirModalCancelar() {
    document.getElementById("mdHidIdVentas").value = "";
    $("#mdvenSelTipoLiquiCance").removeClass("is-valid");
    $("#mdvenSelTipoLiquiCance").removeClass("is-invalid");

    $("#mdvenFecPagooLiquiCance").removeClass("is-valid");
    $("#mdvenFecPagooLiquiCance").removeClass("is-invalid");

    $("#mdvenSelCobradorLiquiCance").removeClass("is-valid");
    $("#mdvenSelCobradorLiquiCance").removeClass("is-invalid");

    $("#mdvenTxtCorreLiquiCance").removeClass("is-valid");
    $("#mdvenTxtCorreLiquiCance").removeClass("is-invalid");

    document.getElementById("btnGrabarVentasCancelar").disabled = false;

    const checkCancelacion = [];
    const tablaGrid = $('#dtVenta').DataTable();
    let contador = 0;
    tablaGrid.rows().every(function () {
        const cell = this.node();
        const data = this.data();
        const objeto = $(cell).find('input[type="checkbox"]')
        if (objeto.length > 0) {
            if (objeto[0].checked) {
                const row = cell.closest('tr');                
                const idVenta = row.cells[3].innerText;
                //const estado = row.cells[9].innerText;
                const situa = row.cells[10].innerText;
                if ( situa === "PENDIENTE") {
                    if (idVenta === data.ventaId.toString()) {
                        const venta = {
                            idVenta: parseInt(idVenta),
                            idAgencia: parseInt(data.ventaUsuarioAgenciaId),
                            desSituacion: situa,
                            codLiquidacion: parseInt(data.ventaCodigoLiquidacion)
                        };
                        checkCancelacion.push(venta);
                        contador += 1;
                    }
                } else {
                    if (situa === "CANCELADO") {
                        tablaGrid.row(this.index()).deselect();
                    }
                }
            }
        }
    });
    if (contador == 0) {
        mostrarMensaje(3, "Seleccione como minimo una venta PENDIENTE, para realizar el documento.");
        return false;
    }
    const reultado = verificarAgenciasRepetidas(checkCancelacion,'P');
    if (reultado != "") {
        mostrarMensaje(3, reultado);
        return false;
    }
    let vCampoSubtotal = 0;
    let vCampoNeta = 0;
    let vCampoIgv = 0;
    let vComisionEUA = 0;
    let vCampoImpBruto = 0;
    let vCampoComision = 0;
    let vCampoIncentivo = 0;
    let vCampoPublicidad = 0;
    let vCampoDescuento = 0;
    let vCampoImpPago = 0;
    let vCampoCliente = "";
    let vCampoAgenciaComision = 0;
    let vCodigoLiquidacion = 0;
    let idVentasUnidos = "";
    let formula = 0; 
    let totalComision = 0;
    let IgvInterno = 0;
    let vComisionPDF = 0;
    tablaGrid.rows().every(function () {
        const data = this.data();
        const coincide = checkCancelacion.some(item => item.idVenta === data.ventaId);
        if (coincide) {          
            if (idVentasUnidos === "") {
                idVentasUnidos =String(data.ventaId); 
            } else {
                idVentasUnidos += "|" + String(data.ventaId); 
            }
            vCampoImpBruto += parseFloat(data.ventaImporteVenta);
            vCampoComision += parseFloat(data.ventaComisionImporte);
            vCampoIncentivo += parseFloat(data.ventaIncentivoImporte);
            vCampoPublicidad += parseFloat(data.ventaPublicidadImporte);
            vCampoDescuento += parseFloat(data.ventaDescuentoImporte);
            vCampoCliente = data.ventaUsuarioAgenciaNombre;
            vCampoAgenciaComision = data.ventaAgenciaComision;
            vCodigoLiquidacion = data.ventaCodigoLiquidacion;
            formula = data.ventaFormulaLiquidacion; 
        }
    });

    if (vCodigoLiquidacion == 0) {
        mostrarMensaje(3, "Por favor, primero debe generar el proceso de liquidacion.");
        return false;
    }

    vCampoImpPago = vCampoImpBruto - (vCampoComision + vCampoIncentivo + vCampoPublicidad + vCampoDescuento);

    document.getElementById("mdvenTxtClieLiquiCance").value = vCampoCliente;
    document.getElementById("mdvenTxtImpBrutoLiquiCance").value = vCampoImpBruto.toFixed(2);
    document.getElementById("mdvenTxtComisionLiquiCance").value = vCampoComision.toFixed(2);
    document.getElementById("mdvenTxtIncentLiquiCance").value = vCampoIncentivo.toFixed(2);
    document.getElementById("mdvenTxtImpCreditoLiquiCance").value = vCampoPublicidad.toFixed(2);
    document.getElementById("mdvenTxtImpDescuento").value = vCampoDescuento.toFixed(2);
    document.getElementById("mdvenTxtImpPagoLiquiCance").value = vCampoImpPago.toFixed(2);
    document.getElementById("mdvenSelTipoLiquiCance").value = "";
    document.getElementById("mdvenTxtSerieLiquiCance").value = "";
    document.getElementById("mdvenTxtCorreLiquiCance").value = "";
    document.getElementById("mdvenTxtObservaLiquiCance").value = "";
    document.getElementById("mdvenSelCobradorLiquiCance").value = "";
    document.getElementById("mdvenFecPagooLiquiCance").value = "";
    document.getElementById("mdHidIdVentas").value = idVentasUnidos;
    document.getElementById("mdHidCodLiquidacion").value = vCodigoLiquidacion;
    $('#popupModalVentaCancelar').modal('show');
}
function verificarAgenciasRepetidas(lista,situacion) {

    /*let agencias = new Set(lista.map(item => item.idAgencia));
    if (agencias.size > 1) {
        return `Solo debe seleccionar ventas PENDIENTES de una misma agencia`;
    } else {
       return "";
    }*/
    let codliquidacion = new Set(lista.map(item => item.codLiquidacion));
    if (codliquidacion.size > 1) {
        if (situacion == 'P') {
            return `Solo debe seleccionar ventas PENDIENTES de una misma liquidaciòn`;
        } else {
            return `Solo debe seleccionar ventas CANCELADAS de una misma liquidaciòn`;
        }
        
    } else {
        return "";
    }
}
function obtenerValorRadioButton(nombreRadio) {
    const radios = document.getElementsByName(nombreRadio);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return null; // Si no hay ningún radio button seleccionado
}

// Nuevo helper: valida sesión de forma centralizada y maneja errores de red
async function ensureSessionActive() {
    try {
        const res = await fetch('/validateJS', { credentials: 'include' });
        if (res && res.ok) {
            return true;
        }
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return false;
    } catch (err) {
        // Si hay error de red, forzar redirección al login para reautenticación
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return false;
    }
}

async function exportarLiquidacionCanPen(situacion) {
    // Validar sesión al inicio de la función
    if (!await ensureSessionActive()) {
        return;
    }
    var checkLiquidacion = [];
    const tablaGrid = $('#dtVenta').DataTable();
    let contador = 0;
    let desSituacion = "";
    if (situacion === "C") {
        desSituacion = "CANCELADO";
    } else {
        desSituacion = "PENDIENTE";
    }
    const formula = obtenerValorRadioButton('RdFormulaLiquidacion');
    if (formula == null) {
        mostrarMensaje(2, "Por favor, seleccionar la formula de liquidacion ");
        return false;
    }
    //console.log(formula);
    tablaGrid.rows().every(function () {
        var cell = this.node();
        const data = this.data();
        var objeto = $(cell).find('input[type="checkbox"]')
        if (objeto.length > 0) {
            if (objeto[0].checked) {
                var row = cell.closest('tr');
                var idVenta = row.cells[3].innerText;
                //var estado = row.cells[9].innerText;
                var situa = row.cells[10].innerText;
                if (situa === desSituacion) {
                    if (idVenta === data.ventaId.toString()) {
                        const venta = {
                            idVenta: parseInt(idVenta),
                            idAgencia: parseInt(data.ventaUsuarioAgenciaId)
                        };
                        checkLiquidacion.push(venta);
                        contador += 1;
                    }
                }
            }
        }
      
    });
    if (contador == 0) {
        mostrarMensaje(2, "Por favor, seleccionar al menos una venta en el estado : " + desSituacion + " .");
        return false;
    }
    let descuentoPorcentaje = parseFloat(document.getElementById("txtDescuentoLiquidacion").value);
    if (isNaN(descuentoPorcentaje) || descuentoPorcentaje < 0) {
        descuentoPorcentaje = 0;
    }
    showLoader();
    try {
        var dataEnviar = [];
        let uniqueIdAgencia = [...new Set(checkLiquidacion.map(liquidacion => liquidacion.idAgencia))];
        uniqueIdAgencia.forEach(idAgencia => {
            let ventasPorAgencia = checkLiquidacion.filter(venta => venta.idAgencia === idAgencia);
            let idVentasUnidos = ventasPorAgencia.map(venta => venta.idVenta).join(', ');
            const ventasUnido = {
                CodigoTarjeta: idVentasUnidos,
                CodigoAgencia: parseInt(idAgencia),
                CodigoMotivo: situacion,
                formula: formula,
                DescuentoPorcentaje: descuentoPorcentaje,
            };
            dataEnviar.push(ventasUnido);
        });

        for (const obj of dataEnviar) {
            let response = await fetch('/LiquidacionGenerarExcel', {
                method: 'POST',
                headers: {
                    'Accept': 'application/octet-stream',  // Expecting a PDF response
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
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
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {
        hideLoader();
    }

    //console.log(dataEnviar);
}
function join(date, options, separator) {
    function format(option) {
        let formatter = new Intl.DateTimeFormat('en', option);
        return formatter.format(date);
    }
    return options.map(format).join(separator);
}
async function cargarCombosBusqueda() {
   
    const elcomboSituacion = await getValoresTipo('ventaSituacionId', 1);
    
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
    const elcomboPais = await getPais(0, 1);
    if (elcomboPais !== undefined) {
        let cantElementos03 = elcomboPais.length;
        if (cantElementos03 > 0) {
            $('#mdvenSelPaisSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboPais) {
                const valorId = cboobj.paisId;
                const valorNombre = cboobj.paisNombre;
                $('#mdvenSelPaisSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboDistrito = await getUbigeo(0, 0, -1);
    if (elcomboDistrito !== undefined) {
        let cantElementos04 = elcomboDistrito.length;
        if (cantElementos04 > 0) {
            $('#mdvenSelDistSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboDistrito) {
                const valorId = cboobj.ubigeoId;
                const valorNombre = cboobj.ubigeoDistrito;
                $('#mdvenSelDistSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboPromotor = await getJerarquiaPromotor(1);
    if (elcomboPromotor !== undefined) {
        let cantElementos05 = elcomboPromotor.length;
        if (cantElementos05 > 0) {
            $('#mdvenSelPromoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboPromotor) {
                const valorId = cboobj.usuarioid;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdvenSelPromoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboEjeCobrador = await getValoresTipo('cobranzaCobradorId', 1);
    if (elcomboEjeCobrador !== undefined) {
        let cantElementos06 = elcomboEjeCobrador.length;
        if (cantElementos06 > 0) {
            $('#mdvenSelEjeCobradorSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboEjeCobrador) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelEjeCobradorSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    let PaisId = "0";
    if (menuUserId !== "1") {
        PaisId = menuPaisId.toString();
    }
    if (menuelOrigen === "U") {
        const elcomboAgencia = await getAgencia(0, 1, PaisId, 0,'','');
        if (elcomboAgencia !== undefined) {
            let cantElementos07 = elcomboAgencia.length;
            if (cantElementos07 > 0) {
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
                    localStorage.setItem("lsliquidacionSel", selection.agenciaId); // Guarda el ID
                });
            }
        }
    } else {
        const elcomboAgenciaUsuarios = await getAgenciaUsuario(AgenciaId, 0, 1);
        if (elcomboAgenciaUsuarios !== undefined) {
            let cantElementos09 = elcomboAgenciaUsuarios.length;
            if (cantElementos09 > 0) {
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
    localStorage.removeItem('lsliquidacionSel');
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    if (AgenciaId === 0) {
        const strIdPais = $(this).val();

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
                localStorage.setItem("lsliquidacionSel", selection.agenciaId);
            });
        }
    }



});

$('#mdvenSelAgenciaSearch').change(async function () {
    const AgenciaId = $(this).val();
    const elcomboAgenciaUsuarios = await getAgenciaUsuario(AgenciaId, 0, 1);
    if (elcomboAgenciaUsuarios !== undefined) {
        let cantElementos09 = elcomboAgenciaUsuarios.length;
        if (cantElementos09 > 0) {
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
async function AbrirModalBusqueda() {
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    if (AgenciaId === 0) {
        $('#divVenSelAgenciaSearch').show();
    } else {
        $('#divVenSelAgenciaSearch').hide();
    }
    if (document.getElementById("mdvenSelPaisSearch").value === '') { 
        document.getElementById("mdvenSelPaisSearch").value = menuPaisId;
    }
    document.getElementById("mdvenSelSituacionSearch").value = "P";
    
    $('#popupModalVentaSearch').modal('show');
}
async function limpiarModalBuqueda() {
    IniciarFechasBsuqueda();
    ReseteoLocalStorage();
    document.getElementById("mdvenNumTarjetaSearch").value = "";
    document.getElementById("mdvenCodExternoSearch").value = "";
    document.getElementById("mdvenSelPaisSearch").value = "";  
    document.getElementById("txtAgencia").value = "";
    document.getElementById("mdvenSelUsuarioSearch").value = "";
    document.getElementById("mdvenSelSituacionSearch").value = "";
    document.getElementById("mdvenSelEjeCobradorSearch").value = "";
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
    const dtfechaHoy = new Date(fechaHoy.setDate(fechaHoy.getDate() - 1));
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;

    const fechaMes = new Date();
    const fecha1mes = new Date(fechaMes.setDate(fechaMes.getDate() - 1));
    const strfecha1mesDia = ("0" + fecha1mes.getDate()).slice(-2)
    const strfecha1mesMes = ("0" + (fecha1mes.getMonth() + 1)).slice(-2)
    const strfecha1mesAnh = fecha1mes.getFullYear();
    const strfecha1mesFin = strfecha1mesAnh + "-" + strfecha1mesMes + "-" + strfecha1mesDia;

    document.getElementById("mdvenFecIncioVigSearch").value = strfecha1mesFin;
    document.getElementById("mdvenFecFinalVigSearch").value = strfechaHoyFin;
}
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

    //$('#dtVenta').on('click', '.group-checkbox', function (e) {      
    //    var groupName = $(this).data('group-name');
    //    var isChecked = this.checked;

    //    // Selecciona o deselecciona los checkboxes del grupo
    //    if (tablaGrid.cells('tr.' + groupName, 0).checkboxes) {
    //        tablaGrid.cells('tr.' + groupName, 0).checkboxes.select(isChecked);
    //    } else {
    //        // Si no usas el plugin, desmarca manualmente los checkboxes
    //        $('tr.' + groupName + ' input[type="checkbox"]').prop('checked', isChecked);
    //    }
    //});
}


var groupColumn = 1;
async function CargarTodo() {    
    const sUrlIdioma = "/travel/spanish.json"
    let botonVisualizar;
    tablaGrid = $("#dtVenta").DataTable({
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" },
            {
                orderable: true,   
                render: DataTable.render.select(),
                targets: 0
            }
        ],
        "order": [["1", "asc"]],       
        "data": [],
        "aoColumns": [
            {
                "sDefaultContent": '',
            }, {
                "mData": "ventaUsuarioAgenciaNombre", "bVisible": false
            }, {
                "mData": "ventaCodigoLiquidacion"
            }, {
                "mData": "cobranzaDocumento"
            }, {
                "mData": "ventaId", "render": function (mData, disp, alldata) {
                    botonVisualizar = "<li class='info'><a href='javascript:void(0);' onclick='AbrirModalConsulta(" + alldata.ventaId + ");'><i class='icon-eye'></i></a></li>"
                    return mData
                }
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
                "mData": "ventaImporteVenta", "className": "editable-precio",
                "createdCell": function (td, cellData, rowData) {
                    $(td).attr('contenteditable', 'true');
                    $(td).attr('data-venta-id', rowData.ventaId);
                    $(td).attr('data-precio-original', cellData);
                    if (rowData.ventaPrecioEditadoManual) {
                        $(td).attr('title', 'Precio editado manualmente');
                        $(td).css('font-style', 'italic');
                    }
                },
                "render": function (mData, disp) {
                    return disp === 'display' ? parseFloat(mData).toFixed(2) : mData;
                }
            },  {
                "mData": "ventaSituacionNombre"
            }, {
                "mData": "ventaCreadoUsuarioNombre"
            }, {
                "mData": "ventaPaisNombre"
            }, {
                "mData": "ventaFormulaLiquidacionNombre"
            }, {
                "mData": "ventaCodigoExterno"
            }, {
                "mData": "ventaUsuarioAgenciaId", "bVisible": false
            }, {
                "mData": "ventaComisionImporte", "bVisible": false
            }, {
                "mData": "ventaIncentivoImporte", "bVisible": false
            }, {
                "mData": "ventaPublicidadImporte", "bVisible": false
            }, {
                "mData": "ventaDescuentoImporte", "bVisible": false
            }, {
                "mData": "ventaAgenciaComision", "bVisible": false
            }, {
                "mData": "ventaFormulaLiquidacion", "bVisible": false
            }, {
                "mData": null, "defaultContent": '', "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonVisualizar + "</ul>";
                }
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": false,
        rowCallback: function (row, data) { },
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            var storedIndexArray = [];

            // Recupera el estado guardado
            //var collapsedGroups = {};
            //var savedGroups = localStorage.getItem('collapsedGroups');
            //if (savedGroups) {
            //    collapsedGroups = JSON.parse(savedGroups);
            //    window.collapsedGroups = collapsedGroups;
            //}
            var collapsedGroups = window.collapsedGroups || {};

            api.column(groupColumn, { page: 'current' })
                .data()
                .each(function (group, i) {
                    var groupKey = group.replace(/[^A-Za-z0-9]/g, '');
                    if (last !== group) {
                        storedIndexArray.push(i);
                        var isCollapsed = collapsedGroups[groupKey] || false;
                        $(rows)
                            .eq(i)
                            .before(
                                `<tr class="group group-start" data-group="${groupKey}">
                                    <td colspan="17" style="cursor:pointer;">
                                        <span class="toggle-group" style="font-weight:bold;">
                                            ${isCollapsed ? '[+]' : '[-]'}
                                        </span>
                                        ${group} (<span class="group-count"></span>)
                                    </td>
                            </tr>`
                            );
                        last = group;
                    }
                });
            storedIndexArray.push(api.column(0, { page: "current" }).data().length);
            for (let i = 0; i < storedIndexArray.length - 1; i++) {
                let element = $(".group-count")[i];
                $(element).text(storedIndexArray[i + 1] - storedIndexArray[i]);
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

            // Evento para expandir/colapsar
            $('.toggle-group').off('click').on('click', function () {
                var $groupRow = $(this).closest('.group.group-start');
                var groupKey = $groupRow.data('group');
                collapsedGroups[groupKey] = !collapsedGroups[groupKey];
                window.collapsedGroups = collapsedGroups; // Mantener estado global
                //localStorage.setItem('collapsedGroups', JSON.stringify(collapsedGroups)); // Guarda el estado
                api.draw(false); // Redibuja sin cambiar de página
            });

            updateCollapseButtonText();
        },
        filter: true,
        pageLength: 50,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        bInfo: true,        
        info: true,
        ordering: true,
        processing: true,
        responsive: true,
        "autoWidth": false,
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        retrieve: true,
        orderCellsTop: true,
        scrollY: "500px",
        scrollCollapse: true,
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
                    if (colIdx != 17) {
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

    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const BusquedaNumTarjeta = document.getElementById("mdvenNumTarjetaSearch").value;
    const BusquedaCodExterno = document.getElementById("mdvenCodExternoSearch").value;
    const BusquedaDesNombres = "";
    const BusquedaDesApellidos = "";
    const BusquedaCodEstado = 'V'; //document.getElementById("mdvenSelEstadoSearch").value;

    let BusquedaCodSituacion = document.getElementById("mdvenSelSituacionSearch").value;
    let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value;
    let BusquedaCodAgencia = localStorage.getItem("lsliquidacionSel");
    let BusquedaCodAgenciaUsuario = document.getElementById("mdvenSelUsuarioSearch").value;
    
    let BusquedaCodPromotor = "";
    let BusquedaCodDistrito = "";
    let BusquedaCodEjeCobrador = document.getElementById("mdvenSelEjeCobradorSearch").value;

    if (BusquedaCodPais === "") {
        BusquedaCodPais = menuPaisId;       
    }
    if (BusquedaCodAgencia === "" || BusquedaCodAgencia == null) {
        BusquedaCodAgencia = 0;
    }
    if (BusquedaCodAgenciaUsuario === "") {
        BusquedaCodAgenciaUsuario = 0;
    }
    if (BusquedaCodPromotor === "") {
        BusquedaCodPromotor = 0;
    }
    if (BusquedaCodDistrito === "") {
        BusquedaCodDistrito = 0;
    }
    if (BusquedaCodEjeCobrador === "") {
        BusquedaCodEjeCobrador = 0;
    }

    if (BusquedaCodSituacion === "") {
        BusquedaCodSituacion = "P"; //PENDIENTE            
    }

    let CodigoBusqueda = 0;
    if (BusquedaNumTarjeta !== "") {
        CodigoBusqueda = parseInt(BusquedaNumTarjeta);
    } else {
        CodigoBusqueda = 0;
    }

    $("#cargar").show();

    const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;
    const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
    const dtfechaIni = fechaIniMoment.toDate();
    const dtfechaVigINI = formatearFechaString(dtfechaIni);
    const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
    const dtfechaFin = fechaFinMoment.toDate();
    const dtfechaVigFIN = formatearFechaString(dtfechaFin);
    const elchkEstado = document.getElementById("mdchkEstado");
    let estadoCheck = 0;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }

    const listadoVentas = await getVentasLiquidacion(menuelOrigen, CodigoBusqueda, dtfechaVigINI, dtfechaVigFIN, AgenciaId, BusquedaDesNombres, BusquedaDesApellidos, BusquedaCodEstado, BusquedaCodSituacion, BusquedaCodExterno, BusquedaCodPais, BusquedaCodAgencia, BusquedaCodAgenciaUsuario, BusquedaCodPromotor, BusquedaCodDistrito, estadoCheck, BusquedaCodEjeCobrador);
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
    setTimeout(async () => {
        await colapsarTodo();
    }, 300);
}

$(document).off('focusout', '#dtVenta td.editable-precio').on('focusout', '#dtVenta td.editable-precio', async function () {
    const celda = $(this);
    const ventaId = parseInt(celda.attr('data-venta-id'));
    const precioOriginal = parseFloat(celda.attr('data-precio-original'));
    const nuevoPrecio = parseFloat(celda.text().trim().replace(',', '.'));

    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
        mostrarMensaje(2, "El precio ingresado no es válido.");
        celda.text(precioOriginal.toFixed(2));
        return;
    }
    if (nuevoPrecio === precioOriginal) {
        celda.text(precioOriginal.toFixed(2));
        return;
    }
    const resultado = await postVentaPrecioActualizarProcesar(ventaId, nuevoPrecio);
    if (resultado !== undefined && resultado.errorCodigo === 200) {
        celda.attr('data-precio-original', nuevoPrecio);
        celda.attr('title', 'Precio editado manualmente');
        celda.css('font-style', 'italic');
        celda.text(nuevoPrecio.toFixed(2));
        mostrarMensaje(1, "Precio actualizado correctamente.");
    } else {
        mostrarMensaje(2, "No se pudo actualizar el precio.");
        celda.text(precioOriginal.toFixed(2));
    }
});
async function postVentaPrecioActualizarProcesar(pVentaID, pPrecio) {
    const urlApiFecht = menuUrlApi + "Venta/VentaPrecioActualizarProcesar";
    const urlParametro = "?pVentaID=" + pVentaID + "&pPrecio=" + pPrecio + "&pUsuarioId=" + menuUserId;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    });
    if (response.status === 200) {
        return await response.json();
    }
    return undefined;
}

$('#btnCollapseAllGroups').off('click').on('click', function () {
    console.log("clickboton");
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
    //localStorage.setItem('collapsedGroups', JSON.stringify(collapsedGroups));
    api.draw(false);

    // Cambia el texto del botón
    if (allCollapsed) {
        $(this).text('Colapsar todo');
    } else {
        $(this).text('Expandir todo');
    }
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


async function AbrirModalConsulta(id) {
    document.getElementById('mdHidIdVentaTarjeta').value = id;
    const eltitulo = document.getElementById("tituloModalVentaRead");
    eltitulo.innerHTML = "Venta Nº " + id;
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
            document.getElementById("mdAtsolVerClienNombApell").innerHTML = laVenta[0].ventaClienteNombres + " " + laVenta[0].ventaClienteApellidos;
            document.getElementById("mdAtsolVerClienDirec").innerHTML = laVenta[0].ventaClienteDireccion + " - " + laVenta[0].ventaClienteDistrito;
            document.getElementById("mdAtsolVerClienTipoDoc").innerHTML = "<b>" + laVenta[0].ventaClienteDocumentoTipoNombre + "</b> :";
            document.getElementById("mdAtsolVerClienDoc").innerHTML = laVenta[0].ventaClienteDocumentoNumero;
            document.getElementById("mdAtsolVerClienCiudad").innerHTML = laVenta[0].ventaClienteCiudad;
            document.getElementById("mdAtsolVerClienMovil").innerHTML = laVenta[0].ventaClienteTelefono;
            if (laVenta[0].ventaClienteFechaNacimiento !== "0001-01-01T00:00:00" && laVenta[0].ventaClienteFechaNacimiento !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(laVenta[0].ventaClienteFechaNacimiento, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdAtsolVerClienFecNac").innerHTML = formatearFechaString(dtfecha);;
            }
            document.getElementById("mdAtsolVerClienPais").innerHTML = laVenta[0].ventaClientePais;

            if (laVenta[0].ventaFechaVigenciaInicio !== "0001-01-01T00:00:00" && laVenta[0].ventaFechaVigenciaInicio !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(laVenta[0].ventaFechaVigenciaInicio, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdAtsolVerVigenciaIni").innerHTML = formatearFechaString(dtfecha);
            }
            if (laVenta[0].ventaFechaVigenciaFin !== "0001-01-01T00:00:00" && laVenta[0].ventaFechaVigenciaFin !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(laVenta[0].ventaFechaVigenciaFin, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdAtsolVerVigenciaFin").innerHTML = formatearFechaString(dtfecha);
            }
            document.getElementById("mdAtsolVerDias").innerHTML = laVenta[0].ventaNumeroDias;
            document.getElementById("mdAtsolVerDestino").innerHTML = laVenta[0].ventaDestino;
            document.getElementById("mdAtsolVerImpoCosto").innerHTML = "US$ " + laVenta[0].ventaImporteVenta;
            document.getElementById("mdAtsolVerImpoProd").innerHTML = laVenta[0].ventaProductoNombre;

            document.getElementById("mdAtsolVerEmerNombApell").innerHTML = laVenta[0].ventaContactoNombres;
            const vvventaContactoDireccion = laVenta[0].ventaContactoDireccion;
            const vvventaContactoDistrito = laVenta[0].ventaContactoDistrito;
            const vvventaContactoPais = laVenta[0].ventaContactoPais;
            let direccionCompleta = "";
            if (vvventaContactoDireccion) {
                direccionCompleta += vvventaContactoDireccion;
            }
            if (vvventaContactoDistrito) {
                if (direccionCompleta) direccionCompleta += ' - ';
                direccionCompleta += vvventaContactoDistrito;
            }

            if (vvventaContactoPais) {
                if (direccionCompleta) direccionCompleta += ', ';
                direccionCompleta += vvventaContactoPais;
            }

            document.getElementById("mdAtsolVerEmerDirec").innerHTML = direccionCompleta;
            document.getElementById("mdAtsolVerEmerMovil").innerHTML = laVenta[0].ventaContactoTelefono;
        }
    }
    $('#popupModalVentaRead').modal('show');
}
async function getVentasLiquidacion(pOrigen, pIdVenta, pfechaIni, pfechaFin, pIdusuario, pNombres, pApellidos, pEstado, pSituacion, pCodExt, pPais, pAgencia, pUsuarioAgencia, pPromotor, pDist, pLiquidacionPendiente, pEjeCobrador) {
    const urlApiFecht = menuUrlApi + "Venta/VentasLiquidacionObtener";
    const urlParametro = "?pOrigen=" + pOrigen + "&pVentaIngresoInicio=" + pfechaIni + "&pVentaIngresoFin=" + pfechaFin + "&pVentaID=" + pIdVenta + "&pUsuarioId=" + pIdusuario + "&pEstadoId=" + pEstado + "&pSituacionId=" + pSituacion + "&pAgenciaId=" + pAgencia + "&pAgenciaUsuarioId=" + pUsuarioAgencia + "&pClienteNombres=" + pNombres + "&pClienteApellidos=" + pApellidos + "&pPaisId=" + pPais + "&pCodigoExterno=" + pCodExt + "&pPromotorId=" + pPromotor + "&pDistritoId=" + pDist + "&int_pLiquidacionPendiente=" + pLiquidacionPendiente + "&pEjecutivoCobradorId=" + (pEjeCobrador || 0);
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
async function getVentas(pOrigen, pIdVenta, pfechaIni, pfechaFin, pIdusuario, pNombres, pApellidos, pEstado, pSituacion, pCodExt, pPais, pAgencia, pUsuarioAgencia, pTipoDoc, pNumeDoc) {
    const urlApiFecht = menuUrlApi + "Venta/VentasObtener";
    const urlParametro = "?pOrigen=" + pOrigen + "&pVentaIngresoInicio=" + pfechaIni + "&pVentaIngresoFin=" + pfechaFin + "&pVentaID=" + pIdVenta + "&pUsuarioId=" + pIdusuario + "&pEstadoId=" + pEstado + "&pSituacionId=" + pSituacion + "&pAgenciaId=" + pAgencia + "&pAgenciaUsuarioId=" + pUsuarioAgencia + "&pClienteNombres=" + pNombres + "&pClienteApellidos=" + pApellidos + "&pPaisId=" + pPais + "&pCodigoExterno=" + pCodExt + "&pTipoDoc=" + pTipoDoc + "&pNumeDoc=" + pNumeDoc;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            //console.log(object3);
            return object3;
        }
    }
}