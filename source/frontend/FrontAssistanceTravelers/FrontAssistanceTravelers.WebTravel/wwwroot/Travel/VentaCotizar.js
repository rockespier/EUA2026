//POPUP PARCIAL
cargarCombos();
iniciarPredeterminado();
//cargar el autocompletar de agencias
async function iniciarPredeterminado() {
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    $('#divVenSelAgencias').hide();
    if (AgenciaId === 0) {
        $('#divVenSelAgencias').show();
        let PaisId = "0";
        if (menuUserId !== "1") {
            PaisId = menuPaisId.toString();
        }
        const elcomboAgencia = await getAgencia(0, -1, PaisId, menuUserId, '', '');
        let cantElementos00 = elcomboAgencia.length;
        if (cantElementos00 > 0) {
            var dataSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['agenciaNombre', 'agenciaRUC']),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: elcomboAgencia
            });
            $('#mdvenSelAgencias').typeahead(
                {
                    hint: true,
                    highlight: true,
                    minLength: 1 // Start searching after 1 character
                },
                {
                    name: 'agenciaId',
                    display: 'agenciaNombre', // Show the 'label' value                   
                    source: dataSource
                },
            );

            $('#mdvenSelAgencias').on('typeahead:select', async function (e, selection) {
                $('#mdvenSelAgencias').val(selection.agenciaId); // Muestra el ID en el input
                localStorage.setItem("lsagenciaIdSelVenta", selection.agenciaId); // Guarda el ID


                const elcomboProductos = await getProducto(0, 1, menuelAgenciaPaisId, selection.agenciaId);
                if (elcomboProductos !== undefined) {
                    let cantElementos02 = elcomboProductos.length;
                    if (cantElementos02 > 0) {
                        $('#mdvenSelProductoProd').empty();
                        $('#mdvenSelProductoProd').append($('<option/>').attr("value", "").text('---Seleccione---'));
                        for (const cboobj of elcomboProductos) {
                            const valorId = cboobj.productoId;
                            const valorNombre = cboobj.productoNombre;
                            $('#mdvenSelProductoProd').append($('<option/>').attr("value", valorId).text(valorNombre));
                        }
                    }
                }

            });
        }
    }
}

async function cargarCombos() {
    const elcomboTipo = await getValoresTipo('ventaClienteDocumentoTipoId', 1);
    const elcomboNacionalidad = await getValoresTipo('NacionalidadVenta', 1);

    if (elcomboTipo !== undefined) {
        let cantElementos01 = elcomboTipo.length;
        if (cantElementos01 > 0) {
            $('#mdvenSelTipoDoc').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelTipoDoc').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

    //if (elcomboNacionalidad !== undefined) {
    //    let cantElementos05 = elcomboNacionalidad.length;
    //    if (cantElementos05 > 0) {
    //        $('#mdvenSelNacionalidad').append($('<option/>').attr("value", "").text('---Seleccione---'));
    //        for (const cboobj of elcomboNacionalidad) {
    //            const valorId = cboobj.valorId;
    //            const valorNombre = cboobj.valorNombre;
    //            $('#mdvenSelNacionalidad').append($('<option/>').attr("value", valorId).text(valorNombre));
    //        }
    //    }
    //}

    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    //if (AgenciaId !== 0) {
    const elcomboProductos = await getProducto(0, 1, menuelAgenciaPaisId, AgenciaId);
    if (elcomboProductos !== undefined) {
        let cantElementos02 = elcomboProductos.length;
        if (cantElementos02 > 0) {
            $('#mdvenSelProductoProd').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboProductos) {
                const valorId = cboobj.productoId;
                const valorNombre = cboobj.productoNombre;
                $('#mdvenSelProductoProd').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
        // }
    }
}

async function AbrirModal(productoId, agenciaId, agenciaNombre) {
    const eltitulo = document.getElementById("tituloModalVenta");
    const formModal01 = document.getElementById("modalDatosVenta")
    const formModal02 = document.getElementById("modalDatosVentaPasajero")
    const dias = document.getElementById("numerodias").innerHTML;
    formModal01.reset();
    formModal02.reset();
    limpiarModalPasajero();
    limpiarModalDatosVenta();
    document.getElementById('GuardarVenta').removeAttribute("disabled");
    document.getElementById("GuardarVenta").textContent = "Continuar"
    estadoProcesarVenta = 1;
    eltitulo.innerHTML = "Nueva Venta";
    let divEstado = document.getElementById('estadoModalVenta');
    divEstado.setAttribute("class", "derecha badge rounded-pill badge-success");
    divEstado.innerHTML = `Por vender`
    const resultadoCorrelativo = await generarCodigoCorrelativo('VentaGrupalId');
    idVenta = resultadoCorrelativo.errorCodigo;
    if (productoId > 0) {
        document.getElementById("mdvenSelProductoProd").value = productoId;
        $("#mdvenSelProductoProd").trigger("change");
        var startDate = $('#rangoFechasLista').data('daterangepicker').startDate._d;
        var endDate = $('#rangoFechasLista').data('daterangepicker').endDate._d;

        document.getElementById("mdvenFecIncioVig").value = formatearFechaString(startDate);
        document.getElementById("mdvenFecFinalVig").value = formatearFechaString(endDate);
        document.getElementById("mdvenDiasVig").value = dias;
        var selDestino = document.getElementById("mdselDestino");
        document.getElementById("mdvenDestinoVig").value = selDestino.options[selDestino.selectedIndex].text;
    }
    if (agenciaId > 0) {
        $('#mdvenSelAgencias').typeahead('val', agenciaNombre);
        localStorage.setItem("lsagenciaIdSelVenta", agenciaId);
        $('#mdvenSelAgencias').blur();
    }

    idPasajero = 0;
    await CargarPasajeros(idVenta)
    setTimeout(async () => {
        //localStorage.removeItem('lsagenciaIdSel');
        //localStorage.removeItem('lsagenciaIdSelVenta');
        $('#popupModalVenta').modal('show');
        $('#top-tab2 a[href="#top-datos"]').tab('show');
    }, 50);
}
async function IniciarFechaDatos() {
    const fechaHoy = new Date();
    const dtfechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    const fecha3meses = new Date(fechaHoy.setDate(fechaHoy.getDate() + 6));
    const strfecha3mesesDia = ("0" + fecha3meses.getDate()).slice(-2)
    const strfecha3mesesMes = ("0" + (fecha3meses.getMonth() + 1)).slice(-2)
    const strfecha3mesesAnh = fecha3meses.getFullYear();
    const strfecha3mesesFin = strfecha3mesesAnh + "-" + strfecha3mesesMes + "-" + strfecha3mesesDia;
    document.getElementById("mdvenFecIncioVig").value = strfechaHoyFin;
    document.getElementById("mdvenFecIncioVig").min = strfechaHoyFin;
    document.getElementById("mdvenFecFinalVig").value = strfecha3mesesFin;
    document.getElementById("mdvenFecFinalVig").min = strfechaHoyFin;
    let Difference_In_Time = dtfechaHoy.getTime() - fecha3meses.getTime();
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    document.getElementById("mdvenDiasVig").value = (Difference_In_Days * -1) + 1;
}
async function limpiarModalDatosVenta() {
    IniciarFechaDatos();
    document.getElementById("mdvenDestinoVig").value = "";
    document.getElementById("mdvenSelProductoProd").value = "";

    document.getElementById("mdvenEdadMinProd").value = "";
    document.getElementById("mdvenEdadMaxProd").value = "";
    document.getElementById("mdvenTarifaProd").value = "";

    document.getElementById("mdvenTxtNombresEmer").value = "";;
    document.getElementById("mdvenTxtCorreoEmer").value = "";;
    document.getElementById("mdvenTxtDireccEmer").value = "";;
    document.getElementById("mdvenTxtDistritoEmer").value = "";;
    document.getElementById("mdvenTxtMovilEmer").value = "";;
    document.getElementById("mdvenTxtPaisEmer").value = "";;

    $("#mdvenSelProductoProd").removeClass("is-valid");
    $("#mdvenSelProductoProd").removeClass("is-invalid");

    $("#mdvenSelProductoProdPromo").removeClass("is-valid");
    $("#mdvenSelProductoProdPromo").removeClass("is-invalid");

    $("#mdvenSelAgencias").removeClass("is-valid");
    $("#mdvenSelAgencias").removeClass("is-invalid");

    $("#mdvenFecIncioVig").removeClass("is-valid");
    $("#mdvenFecIncioVig").removeClass("is-invalid");

    $("#mdvenFecFinalVig").removeClass("is-valid");
    $("#mdvenFecFinalVig").removeClass("is-invalid");

    $("#mdvenDestinoVig").removeClass("is-valid");
    $("#mdvenDestinoVig").removeClass("is-invalid");

    $("#mdvenTarifaProd").removeClass("is-valid");
    $("#mdvenTarifaProd").removeClass("is-invalid");


    $("#mdvenTxtNombresEmer").removeClass("is-valid");
    $("#mdvenTxtNombresEmer").removeClass("is-invalid");

    $("#mdvenTxtCorreoEmer").removeClass("is-valid");
    $("#mdvenTxtCorreoEmer").removeClass("is-invalid");

    $("#mdvenTxtDireccEmer").removeClass("is-valid");
    $("#mdvenTxtDireccEmer").removeClass("is-invalid");

    $("#mdvenTxtMovilEmer").removeClass("is-valid");
    $("#mdvenTxtMovilEmer").removeClass("is-invalid");

    $("#mdvenTxtPaisEmer").removeClass("is-valid");
    $("#mdvenTxtPaisEmer").removeClass("is-invalid");
}
$('#mdvenFecIncioVig').change(function () {
    console.log('entro mdvenFecIncioVig_change');
    const strfechaSelecVigIni = $(this).val();
    const strfechaSelecVigIniMoment = moment(strfechaSelecVigIni, "YYYY-MM-DD");
    const dtfechaSelecVigIni = strfechaSelecVigIniMoment.toDate();
    const strfechaVigFinActiva = document.getElementById("mdvenFecFinalVig").value;
    const strfechaVigFinActivaMoment = moment(strfechaVigFinActiva, "YYYY-MM-DD");
    const dtfechaVigFinActiva = strfechaVigFinActivaMoment.toDate();
    if (document.getElementById('mdHidTipoProducto').value === "365") {
        var fechaNuevaVigFin = new Date();
        //fechaNuevaVigFin.setDate(dtfechaSelecVigIni.getDate() + 364);
        fechaNuevaVigFin = sumarUnAno(dtfechaSelecVigIni);
        const strfechaNuevVigFinDia = ("0" + fechaNuevaVigFin.getDate()).slice(-2)
        const strfechaNuevVigFinMes = ("0" + (fechaNuevaVigFin.getMonth() + 1)).slice(-2)
        const strfechaNuevVigFinAnh = fechaNuevaVigFin.getFullYear();
        const strfechaNuevVigFinFin = strfechaNuevVigFinAnh + "-" + strfechaNuevVigFinMes + "-" + strfechaNuevVigFinDia;
        document.getElementById('mdvenFecFinalVig').value = strfechaNuevVigFinFin;
        document.getElementById("mdvenDiasVig").value = 365
        actualizarTarifaTarifa();
    } else {
        let Difference_In_Time = dtfechaSelecVigIni.getTime() - dtfechaVigFinActiva.getTime();
        let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
        document.getElementById("mdvenFecFinalVig").min = strfechaSelecVigIni;
        if (Difference_In_Days >= 0) {
            document.getElementById("mdvenFecFinalVig").value = strfechaSelecVigIni;
            Difference_In_Days = 0;
        }
        document.getElementById("mdvenDiasVig").value = (Difference_In_Days * -1) + 1;
        actualizarTarifaTarifa();
    }

});
$('#mdvenFecFinalVig').change(function () {
    console.log('entro mdvenFecFinalVig_change');
    const strfechaSelecVigFin = $(this).val();
    const strfechaSelecVigFinMoment = moment(strfechaSelecVigFin, "YYYY-MM-DD");
    const dtfechaSelecVigFin = strfechaSelecVigFinMoment.toDate();
    const strfechaVigIniActiva = document.getElementById("mdvenFecIncioVig").value;
    const strfechaVigIniActivaMoment = moment(strfechaVigIniActiva, "YYYY-MM-DD");
    const dtfechaVigIniActiva = strfechaVigIniActivaMoment.toDate();
    let Difference_In_Time = dtfechaVigIniActiva.getTime() - dtfechaSelecVigFin.getTime();
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    document.getElementById("mdvenDiasVig").value = (Difference_In_Days * -1) + 1;
    actualizarTarifaTarifa();
});
$('#mdvenSelProductoProd').change(async function () {
    console.log('entro mdvenSelProductoProd_change');
    const strIdProducto = $(this).val();
    let AgenciaId = 0;
    if (menuelOrigen === 'U') {
        AgenciaId = localStorage.getItem("lsagenciaIdSelVenta");
    } else {
        AgenciaId = menuelAgenciaUsuarioId
    }
    const datosProducto = await getProducto(strIdProducto, 1, menuelAgenciaPaisId, AgenciaId);
    if (datosProducto !== undefined) {
        if (datosProducto.length > 0) {
            if (datosProducto[0].productoNumeroDias === 365) {
                document.getElementById('mdHidTipoProducto').value = 365
                const strfechaVigIni = document.getElementById("mdvenFecIncioVig").value;
                const strfechaVigIniMoment = moment(strfechaVigIni, "YYYY-MM-DD");
                const dtfechaVigIni = strfechaVigIniMoment.toDate();
                var fechaNuevaVigFin = new Date();
                //fechaNuevaVigFin.setDate(dtfechaVigIni.getDate() + 364);
                fechaNuevaVigFin = sumarUnAno(dtfechaVigIni);
                const strfechaNuevVigFinDia = ("0" + fechaNuevaVigFin.getDate()).slice(-2)
                const strfechaNuevVigFinMes = ("0" + (fechaNuevaVigFin.getMonth() + 1)).slice(-2)
                const strfechaNuevVigFinAnh = fechaNuevaVigFin.getFullYear();
                const strfechaNuevVigFinFin = strfechaNuevVigFinAnh + "-" + strfechaNuevVigFinMes + "-" + strfechaNuevVigFinDia;
                document.getElementById('mdvenFecFinalVig').value = strfechaNuevVigFinFin;
                document.getElementById("mdvenFecFinalVig").disabled = true;
                document.getElementById('mdvenDiasVig').value = 365
                document.getElementById('mdvenEdadMinProd').value = datosProducto[0].productoEdadMinima;
                document.getElementById('mdvenEdadMaxProd').value = datosProducto[0].productoEdadMaxima;
                document.getElementById('mdHidVenEdadMaxProdAdi').value = datosProducto[0].productoImporteDiaAdicional;
                actualizarTarifaTarifa();
            } else {
                document.getElementById('mdHidTipoProducto').value = 0
                //IniciarFechaDatos();
                document.getElementById("mdvenFecFinalVig").disabled = false;
                document.getElementById('mdvenEdadMinProd').value = datosProducto[0].productoEdadMinima;
                document.getElementById('mdvenEdadMaxProd').value = datosProducto[0].productoEdadMaxima;
                document.getElementById('mdHidVenEdadMaxProdAdi').value = datosProducto[0].productoImporteDiaAdicional;
                actualizarTarifaTarifa();
            }
        }
    }
    //console.log(datosProducto);
});
$('#mdvenSelProductoProdPromo').change(async function () {
    const idPromocion = $(this).val();

    if (idPromocion === '0') {
        document.getElementById('mdvenTarifaProd').value = parseFloat(document.getElementById('mdHidPrecioIni').value);
    } else {
        const datosPromocion = await getPaisPromocion(0, idPromocion, 0, 0, 0);
        if (datosPromocion !== undefined) {
            if (datosPromocion.length > 0) {
                //Si aplica promoción a todos los pasajeros
                if (datosPromocion[0].promocionPasajeroId === 0) {
                    const valorOld = parseFloat(document.getElementById('mdvenTarifaProd').value);
                    const valorDes = parseFloat(datosPromocion[0].promocionDescuento);
                    const promocionTarifia = Math.round((valorOld - ((valorOld * valorDes) / 100)));
                    document.getElementById('mdvenTarifaProd').value = parseFloat(promocionTarifia);
                } else {
                    document.getElementById('mdvenTarifaProd').value = parseFloat(document.getElementById('mdHidPrecioIni').value);
                }
            }
        } else {
            document.getElementById('mdvenTarifaProd').value = parseFloat(document.getElementById('mdHidPrecioIni').value);
        }
    }
});
async function actualizarTarifaTarifa() {
    const IdProducto = document.getElementById('mdvenSelProductoProd').value;
    const Dias = document.getElementById('mdvenDiasVig').value;
    const datosTarifa = await getTarifaXProdDias(IdProducto, Dias);
    if (datosTarifa !== undefined) {
        if (datosTarifa.length > 0) {
            document.getElementById('mdvenTarifaProd').value = parseFloat(datosTarifa[0].tarifaImporte);
            document.getElementById('mdHidPrecioIni').value = parseFloat(datosTarifa[0].tarifaImporte);
        }
    }
    let PaisId = "0";
    if (menuUserId !== "1") {
        PaisId = menuPaisId.toString();
    }
    let AgenciaId = 0;
    if (menuelOrigen === 'U') {
        AgenciaId = localStorage.getItem("lsagenciaIdSelVenta");;
    } else {
        AgenciaId = menuelAgenciaUsuarioId
    }
    const datosPromocion = await getPaisPromocion(PaisId, 0, AgenciaId, IdProducto, Dias);
    if (datosPromocion !== undefined) {
        if (datosPromocion.length > 0) {
            $('#mdvenSelProductoProdPromo').empty();
            $('#mdvenSelProductoProdPromo').append($('<option/>').attr("value", "0").text('---Con Promoción---'));
            for (const cboobj of datosPromocion) {
                const valorId = cboobj.promocionPromocionID;
                const valorNombre = cboobj.promocionNombre;
                $('#mdvenSelProductoProdPromo').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        } else {
            $('#mdvenSelProductoProdPromo').empty();
            $('#mdvenSelProductoProdPromo').append($('<option/>').attr("value", "0").text('---Sin Promoción---'));
        }
    } else {
        $('#mdvenSelProductoProdPromo').empty();
        $('#mdvenSelProductoProdPromo').append($('<option/>').attr("value", "0").text('---Sin Promoción---'));
    }
}

async function getTarifaXProdDias(idProducto, dias) {
    const urlApiFecht = menuUrlApi + "generales/TarifaProductosDiasObtener";
    const urlParametro = "?pProductoID=" + idProducto + "&pNumeroDias=" + dias;
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
async function clickValidarDatos() {
    document.getElementById('GuardarVenta').setAttribute("disabled", "disabled");
    const tablaPasajeros = $("#dtPasajeros").DataTable();
    const dataPasajeros = tablaPasajeros.rows().data();
    const numRecords = dataPasajeros.length
    if (numRecords === 0) {
        mostrarMensaje(3, "Por favor, continua ingresando los datos del pasajero.");
        $('#top-tab2 a[href="#top-pasajero"]').tab('show');
        document.getElementById('GuardarVenta').removeAttribute("disabled");
        document.getElementById("GuardarVenta").textContent = "Emitir"
        return false;
    }
    if (document.getElementById("GuardarVenta").textContent === "Continuar") {
        document.getElementById('GuardarVenta').removeAttribute("disabled");
        $('#top-tab2 a[href="#top-pasajero"]').tab('show');
        return false;
    }
    $('#top-tab2 a[href="#top-datos"]').tab('show');
    setTimeout(async () => {
        if ($("#modalDatosVenta").valid()) {
            const resultado = await ProcesarVenta();
            if (resultado.errorCodigo == 200) {
                localStorage.removeItem('lsagenciaIdSelVenta');
                localStorage.removeItem('lsagenciaIdSel');
                CargarTodo()
                $('#popupModalVenta').modal('hide');
                mostrarMensaje(1, resultado.errorDescripcion)
                return false;
            } else {
                mostrarMensaje(2, resultado.errorDescripcion);
                document.getElementById('GuardarVenta').removeAttribute("disabled");
                return false;
            }
        } else {
            document.getElementById('GuardarVenta').removeAttribute("disabled");
            return false;
        }
    }, 50);
}
let elvalidarVentaDatos = $("#modalDatosVenta").validate({
    rules: {
        mdvenCounterVig: {
            required: true,
            minlength: 1,
            maxlength: 300,
        },
        mdvenSelProductoProd: "required",
        mdvenTarifaProd: {
            required: true
        },
    },
    messages: {
        mdvenCounterVig: {
            required: "Ingresar un counter.",
            minlength: "Debe al menos con 1 caracter.",
            maxlength: "No debe pasar de los 300 caracteres.",
        },
        mdvenSelProductoProd: "Seleccione un producto.",
        mdvenTarifaProd: {
            required: "La tarifa debe ser mayor a 0."
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
async function ProcesarVenta() {
    const ladatFechaIniV = document.getElementById("mdvenFecIncioVig");
    const ladatFechaFinV = document.getElementById("mdvenFecFinalVig");
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
    const eltxtDiasVigente = document.getElementById("mdvenDiasVig");
    const eltxtDestinoVigente = document.getElementById("mdvenDestinoVig");

    const elcboProducto = document.getElementById("mdvenSelProductoProd");
    const valorelcboProductoId = elcboProducto.options[elcboProducto.selectedIndex].value;
    const valorelcboProductoDes = elcboProducto.options[elcboProducto.selectedIndex].text;
    const eltxtEdadMin = document.getElementById("mdvenEdadMinProd");
    const eltxtEdadMax = document.getElementById("mdvenEdadMaxProd");
    const eltxtTarifa = document.getElementById("mdvenTarifaProd"); //importe de venta
    const eltxtTarifaIni = document.getElementById("mdHidPrecioIni");   //importe del producto

    const eltxtNombresEmer = document.getElementById("mdvenTxtNombresEmer");
    const eltxtCorreoEmer = document.getElementById("mdvenTxtCorreoEmer");
    const eltxtDireccionEmer = document.getElementById("mdvenTxtDireccEmer");
    const eltxtDistritoEmer = document.getElementById("mdvenTxtDistritoEmer");
    const eltxtMovilmer = document.getElementById("mdvenTxtMovilEmer");
    const eltxtPaisEmer = document.getElementById("mdvenTxtPaisEmer");

    const eltxtCounter = document.getElementById("mdvenCounterVig");

    const elcboDescuento = document.getElementById("mdvenSelProductoProdPromo");
    const valorelcboDescuentoId = elcboDescuento.options[elcboDescuento.selectedIndex].value;

    let AgenciaId = 0;
    let OrigenGrabar = menuelOrigen;
    if (menuelOrigen === 'U') {
        AgenciaId = localStorage.getItem("lsagenciaIdSelVenta");
        OrigenGrabar = "A";
    } else {
        AgenciaId = menuelAgenciaUsuarioId
    }
    // ✅ FIX: converti toFixed() in numero con parseFloat()
    const importeVenta = parseFloat(parseFloat(eltxtTarifa.value).toFixed(4));
    const importeProducto = parseFloat(parseFloat(eltxtTarifaIni.value).toFixed(4));

    console.log('Tipo importeVenta:', typeof importeVenta, 'Valore:', importeVenta);
    
    const dataEnviar = {
        ventaGrupalId: idVenta,
        ventaFechaVigenciaInicio: fechaFormateaIniV,
        ventaFechaVigenciaFin: fechaFormateaFinV,
        ventaNumeroDias: parseInt(eltxtDiasVigente.value),
        ventaDestino: (eltxtDestinoVigente.value || '').toUpperCase(),
        ventaProductoId: valorelcboProductoId,
        ventaProductoNombre: (valorelcboProductoDes || '').toUpperCase(),
        ventaProductoImporte: importeProducto,
        ventaCreadoUsuarioId: menuUserId,
        ventaUsuarioAgenciaId: AgenciaId,
        ventaUsuarioOrigen: menuelOrigen,
        ventaCounter: (eltxtCounter.value || '').toUpperCase(),
        ventaAgenciaNombre: "",
        ventaAgenciaDireccion: "",
        ventaAgenciaCorreo: "",
        ventaContactoNombres: (eltxtNombresEmer.value || '').toUpperCase(),
        ventaContactoDireccion: (eltxtDireccionEmer.value || '').toUpperCase(),
        ventaContactoEmail: (eltxtCorreoEmer.value || '').toUpperCase(),
        ventaContactoTelefono: (eltxtMovilmer.value || '').toUpperCase(),
        ventaContactoDistrito: (eltxtDistritoEmer.value || '').toUpperCase(),
        ventaContactoPais: (eltxtPaisEmer.value || '').toUpperCase(),
        ventaImporteVenta: importeVenta,
        ventaSituacionId: "A",
        ventaObservacion: "",
        ventaPromocionId: parseInt(valorelcboDescuentoId)
    };
    
    console.log('JSON inviato:', JSON.stringify(dataEnviar));

    const resultado = await postVentaProcesar(dataEnviar);
    return resultado;
}
async function postVentaProcesar(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasProcesar";
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
async function getPaisPromocion(paisId, promocionId, agenciaId, productoId, dias) {
    const urlApiFecht = menuUrlApi + "mantenimiento/PromocionPaisObtener";
    const urlParametro = "?int_pPromocionPaisId=" + paisId + "&int_pPromocionID=" + promocionId + "&int_pAgenciaID=" + agenciaId + "&int_pProductoID=" + productoId + "&int_pDias=" + dias;
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
            // console.log(object3);
            return object3;
        }
    }
}
//TAB DE PASAJEROS
async function limpiarModalPasajero() {
    IniciarFechaNacimineto();
    document.getElementById("mdvenSelTipoDoc").value = "";
    document.getElementById("mdvenTxtNumDocumento").value = "";
    document.getElementById("mdvenTxtNombres").value = "";
    document.getElementById("mdvenTxtApellidos").value = "";
    document.getElementById("mdvenTxtCorreo").value = "";;
    document.getElementById("mdvenTxtMovil").value = "";;
    document.getElementById("mdvenTxtDireccion").value = "";;
    document.getElementById("mdvenTxtDistrito").value = "";;
    document.getElementById("mdvenTxtCiudad").value = "";;
    document.getElementById("mdvenTxtPais").value = "";;
    $("#mdvenSelTipoDoc").removeClass("is-valid");
    $("#mdvenSelTipoDoc").removeClass("is-invalid");
    $("#mdvenTxtNumDocumento").removeClass("is-valid");
    $("#mdvenTxtNumDocumento").removeClass("is-invalid");
    $("#mdvenTxtNombres").removeClass("is-valid");
    $("#mdvenTxtNombres").removeClass("is-invalid");
    $("#mdvenTxtApellidos").removeClass("is-valid");
    $("#mdvenTxtApellidos").removeClass("is-invalid");
    $("#mdvenTxtFecNac").removeClass("is-valid");
    $("#mdvenTxtFecNac").removeClass("is-invalid");
    $("#mdvenTxtEdad").removeClass("is-valid");
    $("#mdvenTxtEdad").removeClass("is-invalid");
    $("#mdvenTxtCorreo").removeClass("is-valid");
    $("#mdvenTxtCorreo").removeClass("is-invalid");
    $("#mdvenTxtMovil").removeClass("is-valid");
    $("#mdvenTxtMovil").removeClass("is-invalid");
    $("#mdvenTxtDireccion").removeClass("is-valid");
    $("#mdvenTxtDireccion").removeClass("is-invalid");
    $("#mdvenTxtDistrito").removeClass("is-valid");
    $("#mdvenTxtDistrito").removeClass("is-invalid");
    $("#mdvenTxtCiudad").removeClass("is-valid");
    $("#mdvenTxtCiudad").removeClass("is-invalid");
    $("#mdvenTxtPais").removeClass("is-valid");
    $("#mdvenTxtPais").removeClass("is-invalid");
    $("#mdvenTxtNacionalidad").removeClass("is-valid");
    $("#mdvenTxtNacionalidad").removeClass("is-invalid");
}
let elvalidarVenta = $("#modalDatosVentaPasajero").validate({
    rules: {
        mdvenSelTipoDoc: "required",
        mdvenTxtNumDocumento: {
            required: true,
            minlength: 6,
            maxlength: 20,
        },
        mdvenTxtNombres: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdvenTxtApellidos: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdvenTxtFecNac: {
            required: true,
        },
        mdvenTxtCorreo: {
            email: true
        },
        mdvenTxtMovil: {
            required: true,
            minlength: 1,
            maxlength: 15,
        },
    },
    messages: {
        mdvenSelTipoDoc: "Seleccione un producto.",
        mdvenTxtNumDocumento: {
            required: "Ingresar numero de documento.",
            minlength: "Debe al menos con 6 caracteres.",
            maxlength: "No debe pasar de los 20 caracteres.",
        },
        mdvenTxtNombres: {
            required: "Ingresar nombres.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtApellidos: {
            required: "Ingresar apellidos.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenTxtFecNac: {
            required: "Seleccione fecha nacimiento.",
        },
        mdvenTxtCorreo: {
            email: "Formato incorrecto.",
        },
        mdvenTxtMovil: {
            required: "Ingresar numero de telefono.",
            minlength: "Debe al menos con 6 caracteres.",
            maxlength: "No debe pasar de los 15 caracteres.",
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
$('#mdvenBtnBuscarDoc').on('click', async function (e) {
    await buscarPorDocumento();
});
$('#mdvenTxtNumDocumento').bind("enterKey", async function (e) {
    await buscarPorDocumento();
});
$('#mdvenTxtNumDocumento').keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

// Helper: cerca e seleziona opzione per value o text
function setSelectByValueOrText(selectId, searchTerm) {
    const select = document.getElementById(selectId);
    if (!select || !searchTerm) return false;

    // 1. Cerca per value
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === searchTerm.toString()) {
            select.selectedIndex = i;
            return true;
        }
    }

    // 2. Cerca per text (case insensitive)
    const searchLower = searchTerm.toString().toLowerCase().trim();
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().trim() === searchLower) {
            select.selectedIndex = i;
            return true;
        }
    }

    return false; // non trovato
}

async function buscarPorDocumento() {
    const eldocumento = document.getElementById("mdvenTxtNumDocumento").value;
    const eltipodocumento = document.getElementById("mdvenSelTipoDoc").value;
    if (eltipodocumento === "") {
        mostrarMensaje(5, "Seleccione primero el tipo de documento de identidad", "mdvenSelTipoDoc");
        return false;
    }
    if (eldocumento === "") {
        mostrarMensaje(5, "Ingresar numero de documento de identidad", "mdvenTxtNumDocumento");
        return false;
    }

    const elpasajero = await getPasajero(eltipodocumento, eldocumento);
    if (elpasajero != undefined) {
        if (elpasajero != null) {
            if (elpasajero.length > 0) {
                limpiarModalPasajero();
                document.getElementById("mdvenSelTipoDoc").value = elpasajero[0].pasajeroDocumentoTipoId;
                document.getElementById("mdvenTxtNumDocumento").value = elpasajero[0].pasajeroDocumentoNumero;
                document.getElementById("mdvenTxtNombres").value = elpasajero[0].pasajeroNombres;
                document.getElementById("mdvenTxtApellidos").value = elpasajero[0].pasajeroApellidos;

                document.getElementById('mdvenTxtNacionalidad').value = elpasajero[0].pasajeroNacionalidad;
                // CAMBIO: usa la funzione helper per assegnare per value o text
                //setSelectByValueOrText('mdvenSelNacionalidad', elpasajero[0].pasajeroNacionalidad);


                const strfecha = elpasajero[0].pasajeroFechaNacimiento;
                const fechaMoment = moment(strfecha, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
                const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
                const strfechaAnh = dtfecha.getFullYear();
                const strfechaFin = strfechaAnh + "-" + strfechaMes + "-" + strfechaDia;
                document.getElementById("mdvenTxtFecNac").value = strfechaFin;
                $("#mdvenTxtFecNac").trigger("change");

                const strfechaini = elpasajero[0].fechaInicio;
                const fechaMomentini = moment(strfechaini, "YYYY-MM-DD");
                const dtfechaini = fechaMomentini.toDate();
                console.log(dtfechaini, 'dtfechaini');
                // Verifica se l'anno di dtfechaini è uguale all'anno corrente
                const currentYear = (new Date()).getFullYear();
                const dtfechainiIsCurrentYear = (dtfechaini.getFullYear() >= currentYear);
                if (dtfechainiIsCurrentYear) {
                    const strfechaDiaini = ("0" + dtfechaini.getDate()).slice(-2)
                    const strfechaMesini = ("0" + (dtfechaini.getMonth() + 1)).slice(-2)
                    const strfechaAnhini = dtfechaini.getFullYear();
                    const strfechainiF = strfechaAnhini + "-" + strfechaMesini + "-" + strfechaDiaini;
                    document.getElementById("mdvenFecIncioVig").value = strfechainiF;
                    console.log(strfechainiF, 'mdvenFecIncioVig');
                    //if (elpasajero[0].dias > 0) {

                    //    document.getElementById("mdvenDiasVig").value = elpasajero[0].dias;
                    //}                    
                }
                const strfechafin = elpasajero[0].fechaFin;
                const fechaMomentfin = moment(strfechafin, "YYYY-MM-DD");
                const dtfechafin = fechaMomentfin.toDate();
                console.log(dtfechafin, 'dtfechafin');
                const dtfechafinIsCurrentYear = (dtfechafin.getFullYear() >= currentYear);
                if (dtfechafinIsCurrentYear) {
                    const strfechaDiafin = ("0" + dtfechafin.getDate()).slice(-2)
                    const strfechaMesfin = ("0" + (dtfechafin.getMonth() + 1)).slice(-2)
                    const strfechaAnhfin = dtfechafin.getFullYear();
                    const strfechaFinfin = strfechaAnhfin + "-" + strfechaMesfin + "-" + strfechaDiafin;
                    document.getElementById("mdvenFecFinalVig").value = strfechaFinfin;
                    console.log(strfechaFinfin, 'mdvenFecFinalVig');
                }

                let vInicio = document.getElementById("mdvenFecIncioVig").value;
                let vFin = document.getElementById("mdvenFecFinalVig").value;
                const fechaMomentinicio = moment(vInicio, "YYYY-MM-DD");
                const dtfechainicio = fechaMomentinicio.toDate();
                const fechaMomentfinal = moment(vFin, "YYYY-MM-DD");
                const dtfechafinal = fechaMomentfinal.toDate();

                let Difference_In_Time = dtfechainicio.getTime() - dtfechafinal.getTime();
                let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
                console.log((Difference_In_Days * -1) + 1);
                document.getElementById("mdvenDiasVig").value = (Difference_In_Days * -1) + 1;

                document.getElementById("mdvenTxtCorreo").value = elpasajero[0].pasajeroEmail;
                document.getElementById("mdvenTxtMovil").value = elpasajero[0].pasajeroTelefono;
                document.getElementById("mdvenTxtDireccion").value = elpasajero[0].pasajeroDireccion;
                document.getElementById("mdvenTxtDistrito").value = elpasajero[0].pasajeroDistrito;
                document.getElementById("mdvenTxtCiudad").value = elpasajero[0].pasajeroCiudad;
                document.getElementById("mdvenTxtPais").value = elpasajero[0].pasajeroPais;
                if (elpasajero[0].contactoProducto != "") {
                    document.getElementById("mdvenDestinoVig").value = elpasajero[0].contactoProducto;
                }
                if (elpasajero[0].contactoAgencia != "") {
                    document.getElementById("mdvenCounterVig").value = elpasajero[0].contactoAgencia;
                }
                document.getElementById("mdvenTxtNombresEmer").value = elpasajero[0].contactoNombres;
                document.getElementById("mdvenTxtCorreoEmer").value = elpasajero[0].contactoEmail;
                document.getElementById("mdvenTxtDireccEmer").value = elpasajero[0].contactoDireccion;
                document.getElementById("mdvenTxtDistritoEmer").value = elpasajero[0].contactoDistrito;
                document.getElementById("mdvenTxtMovilEmer").value = elpasajero[0].contactoTelefono;
                document.getElementById("mdvenTxtPaisEmer").value = elpasajero[0].contactoPais;

                //Actualizar la tarifa según los días
                actualizarTarifaTarifa();
                return false;

            }
            else {
                mostrarMensaje(4, "No existe el pasajero, por favor crearlo.");
                return false;
            }
        } else {
            mostrarMensaje(4, "No existe el pasajero, por favor crearlo.");
            return false;
        }
    } else {
        document.getElementById("mdvenTxtNombres").value = "";
        document.getElementById("mdvenTxtApellidos").value = "";
        IniciarFechaNacimineto();
        mostrarMensaje(5, "No existe el pasajero, por favor crearlo.", "mdvenTxtNombres");
        return false;
    }
}
async function IniciarFechaNacimineto() {
    const fechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear() - 1;
    const strfechaHoyAnhMax = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    const strfechaHoyFinMax = strfechaHoyAnhMax + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    document.getElementById("mdvenTxtFecNac").value = strfechaHoyFin;
    document.getElementById("mdvenTxtFecNac").max = strfechaHoyFinMax;
    const strEdad = strfechaHoyAnhMax - strfechaHoyAnh;
    document.getElementById("mdvenTxtEdad").value = strEdad;
}
$('#mdvenTxtFecNac').on('change', function (e) {
    const valorFecha = this.value;
    const anhos = new Date(new Date() - new Date(valorFecha)).getFullYear() - 1970;
    document.getElementById("mdvenTxtEdad").value = anhos;
});
async function CargarPasajeros(id) {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
    tablaGridPasa = $("#dtPasajeros").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "ventaClienteDocumentoTipoNombre", "render": function (mData, disp, alldata, row) {
                    botonEditar = `<li class='edit'><a href='javascript:void(0);' onclick='editarPasajeroVenta(${JSON.stringify(alldata)});'><i class='icon-pencil-alt'></i></a></li>`
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='borrarPasajeroVenta(" + alldata.ventaClienteId + ");'><i class='icon-trash'></i></a></li>"
                    if (alldata.usuarioActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData
                }
            }, {
                "mData": "ventaClienteDocumentoNumero"
            }, {
                "mData": "ventaClienteNombres"
            }, {
                "mData": "ventaClienteApellidos"
            }, {
                "mData": "ventaClienteFechaNacimiento", "render": function (mData, disp, alldata) {
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
                "mData": "ventaClienteEdad"
            }, {
                "mData": "ventaClienteEmail"
            }, {
                "mData": "ventaClienteTelefono"
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonEditar + "&nbsp;" + botonEliminar + "</ul>";
                }
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "layout": {
            topStart: null,
            bottom: null,
            bottomStart: null,
            bottomEnd: null
        },
        "deferRender": true,
        rowCallback: function (row, data) { },
        filter: false,
        pageLength: 5,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        bInfo: false,
        info: false,
        ordering: false,
        processing: true,
        responsive: true,
        "autoWidth": false,
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        retrieve: true,
    });
    const listadoPasajeros = await getVentasGrupoPasajeros(id);
    if (listadoPasajeros !== undefined) {
        if (listadoPasajeros.length > 0) {
            tablaGridPasa.clear().draw();
            tablaGridPasa.rows.add(listadoPasajeros).draw();
        }
    } else {
        const listadoVacio = [];
        tablaGridPasa.clear().draw();
        tablaGridPasa.rows.add(listadoVacio).draw();
    }
}
async function clickValidarPasajero() {
    const ValidarProducto = document.getElementById("mdvenSelProductoProd").value;
    if (ValidarProducto === "") {
        mostrarMensaje(3, "Por favor, seleccione el producto primero.");
        return false;
    }
    const ValidarProductoEdadMaxima = parseInt(document.getElementById("mdvenEdadMaxProd").value);
    const ValidarPasajeroEdad = parseInt(document.getElementById("mdvenTxtEdad").value)
    const ValidarPasajeroAdicional = parseInt(document.getElementById("mdHidVenEdadMaxProdAdi").value)
    if (ValidarPasajeroAdicional === 0) {
        if (ValidarPasajeroEdad > ValidarProductoEdadMaxima) {
            mostrarMensaje(3, "El pasajero no puede exceder de la edad maxima que permite el producto.");
            return false;
        }
    } else {
        if (ValidarPasajeroEdad > ValidarPasajeroAdicional) {
            mostrarMensaje(3, "El pasajero no puede exceder de la edad maxima que permite el producto.");
            return false;
        }
    }

    if ($("#modalDatosVentaPasajero").valid()) {
        const resultado = await ProcesarPasajero();
        if (resultado.errorCodigo == 200) {
            idPasajero = 0;
            await CargarPasajeros(idVenta)
            mostrarMensaje(1, resultado.errorDescripcion)
            limpiarModalPasajero();
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function ProcesarPasajero() {
    const elcboTipoDoc = document.getElementById("mdvenSelTipoDoc");
    const valorelcboTipoDoc = elcboTipoDoc.options[elcboTipoDoc.selectedIndex].value;
    const eltxtNumDocumento = document.getElementById("mdvenTxtNumDocumento");
    const eltxtNombres = document.getElementById("mdvenTxtNombres");
    const eltxtApellidos = document.getElementById("mdvenTxtApellidos");
    let fechaFormateaNacimiento;
    const ladatNacimiento = document.getElementById("mdvenTxtFecNac");
    if (ladatNacimiento.value == "") {
        const fecha = new Date(0);
        fechaFormateaNacimiento = formatearFechaString(fecha);
    } else {
        const fechaNacimientoMoment = moment(ladatNacimiento.value, "YYYY-MM-DD");
        const dtfechaNacimiento = fechaNacimientoMoment.toDate();
        fechaFormateaNacimiento = formatearFechaString(dtfechaNacimiento)
    }
    const eltxtEdad = document.getElementById("mdvenTxtEdad");
    const eltxtCorreo = document.getElementById("mdvenTxtCorreo");
    const eltxtMovil = document.getElementById("mdvenTxtMovil");
    const eltxtDireccion = document.getElementById("mdvenTxtDireccion");
    const eltxtDistrito = document.getElementById("mdvenTxtDistrito");
    const eltxtCiudad = document.getElementById("mdvenTxtCiudad");
    const eltxtPais = document.getElementById("mdvenTxtPais");
    // CAMBIO: ottieni il testo dell'opzione selezionata
    const textoNacionalidad = document.getElementById("mdvenTxtNacionalidad"); //$('#mdvenSelNacionalidad option:selected').text();

    const dataEnviar = {
        ventaClienteId: idPasajero,
        ventaId: idVenta,
        ventaClienteDocumentoTipoId: valorelcboTipoDoc,
        ventaClienteDocumentoNumero: eltxtNumDocumento.value,
        ventaClienteNombres: eltxtNombres.value,
        ventaClienteApellidos: eltxtApellidos.value,
        ventaClienteFechaNacimiento: fechaFormateaNacimiento,
        ventaClienteEdad: eltxtEdad.value,
        ventaClienteEmail: eltxtCorreo.value,
        ventaClienteDireccion: eltxtDireccion.value,
        ventaClienteTelefono: eltxtMovil.value,
        ventaClienteDistrito: eltxtDistrito.value,
        ventaClienteCiudad: eltxtCiudad.value,
        ventaClientePais: eltxtPais.value,
        ventaNacionalidad: textoNacionalidad.value
    };
    const resultado = await postPasajeroProcesar(dataEnviar);
    return resultado;
}
async function editarPasajeroVenta(data) {
    if (data !== undefined) {
        idPasajero = data.ventaClienteId;
        document.getElementById("mdvenSelTipoDoc").value = data.ventaClienteDocumentoTipoId;
        document.getElementById("mdvenTxtNumDocumento").value = data.ventaClienteDocumentoNumero;
        document.getElementById("mdvenTxtNombres").value = data.ventaClienteNombres;
        document.getElementById("mdvenTxtApellidos").value = data.ventaClienteApellidos;
        const strfecha = data.ventaClienteFechaNacimiento;
        const fechaMoment = moment(strfecha, "YYYY-MM-DD");
        const dtfecha = fechaMoment.toDate();
        const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
        const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
        const strfechaAnh = dtfecha.getFullYear();
        const strfechaFin = strfechaAnh + "-" + strfechaMes + "-" + strfechaDia;
        document.getElementById("mdvenTxtFecNac").value = strfechaFin;
        $("#mdvenTxtFecNac").trigger("change");
        document.getElementById("mdvenTxtCorreo").value = data.ventaClienteEmail;
        document.getElementById("mdvenTxtMovil").value = data.ventaClienteTelefono;
        document.getElementById("mdvenTxtDireccion").value = data.ventaClienteDireccion;
        document.getElementById("mdvenTxtDistrito").value = data.ventaClienteDistrito;
        document.getElementById("mdvenTxtCiudad").value = data.ventaClienteCiudad;
        document.getElementById("mdvenTxtPais").value = data.ventaClientePais;
    }
}
async function borrarPasajeroVenta(Id) {
    const alerta = await swal({
        title: "¿Está seguro de eliminar el cliente?",
        text: "Se va eliminar el cliente solo para el proceso de venta.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await deletePasajeroBorrar(Id);
        if (resultado.errorCodigo == 200) {
            await CargarPasajeros(idVenta)
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function getVentasGrupoPasajeros(id) {
    const urlApiFecht = menuUrlApi + "Venta/VentasPasajeroGrupoObtener";
    const urlParametro = "?pVentaClienteVentaID=" + id;
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
            // console.log(object3);
            return object3;
        }
    }
}
async function postPasajeroProcesar(enviarBody) {
    const urlApiFecht = menuUrlApi + "Venta/VentasPasajeroGrupoProcesar";
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
async function deletePasajeroBorrar(id) {
    const urlApiFecht = menuUrlApi + "Venta/VentasPasajeroGrupoEliminar";
    const urlParametro = "?pVentaClienteID=" + id;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'DELETE',
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

async function InitialTabs() {
    document.addEventListener("DOMContentLoaded", function () {
        const tabLinks = document.querySelectorAll('#top-tab2 a[data-bs-toggle="tab"]');

        tabLinks.forEach(function (tab) {
            tab.addEventListener('shown.bs.tab', function (event) {
                const clickedTabId = event.target.id;
                myTabClickHandler(clickedTabId);
            });
        });
    });
}
InitialTabs();
function myTabClickHandler(tabId) {
    if (tabId === "datos-top-tab2") {
        document.getElementById("GuardarVenta").textContent = "Continuar"
    } else if (tabId === "pasajero-top-tab2") {
        document.getElementById("GuardarVenta").textContent = "Emitir"
    }
}

