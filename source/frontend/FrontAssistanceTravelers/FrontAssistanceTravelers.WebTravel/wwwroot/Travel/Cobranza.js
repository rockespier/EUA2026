hideLoader();
CargarTodo();
IniciarTablaClick();
cargarCombosCancelar();
let IdPagoCobranza = 0;
let IdCobranza = 0;

$("#btnExport").click(function (e) {
    const table = $('#dtPagos').DataTable();
    table.page.len(-1).draw();
    var result = 'data:application/vnd.ms-excel;charset=utf-8,%EF%BB%BF' + encodeURIComponent($('#dtPagos').parent().html()).replace('Procesando...', ' ');
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = "Pagos.xls"; //You need to change file_name here.
    link.href = result;
    link.click();
    setTimeout(function () {
        table.page.len(10).draw();
    }, 1000)

});

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}
async function AbrirModalBusqueda() {
    $('#popupModalVentaSearch').modal('show');
}
async function limpiarModalBuqueda() {
    document.getElementById("mdvenFecIncioVigSearch").value = "";
    document.getElementById("mdvenFecFinalVigSearch").value = "";
    document.getElementById("mdvenFecIncioPagoSearch").value = "";
    document.getElementById("mdvenFecFinalPagoSearch").value = "";
}
//LISTADO PRICIPAL
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
            $('#mdvenSelMetodoDetLiquiCance').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboMedioPago) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelMetodoDetLiquiCance').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
}
async function innactivarDocumento(Id) {
    const alerta = await swal({
        title: "¿Está seguro de eliminar el documento de pago?",
        text: "Se va eliminar el documento de pago solo para este proceso.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await deleteCobranzaBorrar(Id);
        if (resultado.errorCodigo == 200) {
            await CargarTodo()
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function clickBuscarVentas() {
    CargarTodo()
    $('#popupModalVentaSearch').modal('hide');
    IniciarTablaClick();
}
async function clickBuscarLimpiar() {
    limpiarModalBuqueda();
}
async function IniciarTablaClick() {
    const tablaGrid = $('#dtCobranza').DataTable();
    $('#dtCobranza tbody').on('click', 'tr td', function () {
        const datavalor = tablaGrid.row(this).data();
        if (datavalor !== undefined) {
            const idRec = tablaGrid.row(this).data().cobranzaId;
            const cellIndex = tablaGrid.column(this).index();
            const columna = tablaGrid.column(cellIndex).header().textContent
            if (columna !== "Acciones" && columna !== "") {
                AbrirModalDocumento(idRec)
            }
        }
    })
}
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonVisualizar;
    let botonEliminar;
    tablaGrid = $("#dtCobranza").DataTable({
        layout: {
            bottomStart: {
                buttons: [
                    {
                        extend: 'copy',
                        text: 'Copiar',
                        title: 'Copiar'
                    },
                    {
                        extend: 'csv',
                        title: 'Pagos'
                    },
                    {
                        extend: 'pdf',
                        title: 'Pagos'
                    },
                    {
                        extend: 'print',
                        text: 'Imprimir',
                        title: 'Pagos'
                    }
                ]
            },
            topEnd: 'search',
        },
        "columnDefs": [
            { className: "seleccionar", targets: "_all" }
        ],
        "data": [],
        "aoColumns": [
            {
                "mData": "cobranzaDocumento", "render": function (mData, disp, alldata) {
                    var resultado = alldata.cobranzaDocumentoTipoNombre + " - " + alldata.cobranzaDocumentoSerie + " - " + alldata.cobranzaDocumentoCorrelativo
                    return resultado;
                }
            }, {
                "mData": "cobranzaCliente", "render": function (mData, disp, alldata) {
                    botonVisualizar = "<li class='info'><a href='javascript:void(0);' onclick='AbrirModalDocumento(" + alldata.cobranzaId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarDocumento(" + alldata.cobranzaId + ");'><i class='icon-trash'></i></a></li>"
                    return mData
                }
            }, {
                "mData": "cobranzaImporteBruto"
            }, {
                "mData": "cobranzaComision"
            }, {
                "mData": "cobranzaIncentivo"
            }, {
                "mData": "cobranzaImportePago", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2); 
                    }
                    return data; 
                }
            }, {
                "mData": "cobranzaPagoFecha", "render": function (mData, disp, alldata) {
                    const fechaMoment = moment(mData, "YYYY-MM-DD");
                    const dtfecha = fechaMoment.toDate();

                    const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
                    const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
                    const strfechaAnh = dtfecha.getFullYear();

                    const strfechaFin = strfechaDia + "/" + strfechaMes + "/" + strfechaAnh;

                    return strfechaFin
                }
            }, {
                "mData": "cobranzaCobradorNombre"
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonVisualizar + "&nbsp;" + botonEliminar + "</ul>";
                }
            }, {
                "mData": "cobranzaId", "bVisible": false
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": false,
        rowCallback: function (row, data) { },
        filter: true,
        pageLength: 25,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        bInfo: false,
        info: false,
        ordering: true,
        processing: true,
        responsive: true,
        "autoWidth": false,
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        retrieve: true,
        orderCellsTop: true,
        scrollY: "400px",
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
                    if (colIdx != 9) {
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

    let BsqLiquidacion = 0;
    const codLiquidacion = document.getElementById("mdCodLiquidacion").value;
   
    if (codLiquidacion === null || codLiquidacion === undefined || codLiquidacion === '') {
        BsqLiquidacion = 0
    } else {
        BsqLiquidacion = codLiquidacion;
    }

    const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;

    let dtfechaVigINI;
    if (BusquedaFechaIni == "") {
        const fecha = new Date(0);
        dtfechaVigINI = formatearFechaString(fecha);
    } else {
        const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
        const dtfechaIni = fechaIniMoment.toDate();
        dtfechaVigINI = formatearFechaString(dtfechaIni);
    }
    let dtfechaVigFIN;
    if (BusquedaFechaFin == "") {
        const fecha = new Date(0);
        dtfechaVigFIN = formatearFechaString(fecha);
    } else {
        const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
        const dtfechaFin = fechaFinMoment.toDate();
        dtfechaVigFIN = formatearFechaString(dtfechaFin);
    }

    const BusquedaFechaPagoIni = document.getElementById("mdvenFecIncioPagoSearch").value;
    const BusquedaFechaPagoFin = document.getElementById("mdvenFecFinalPagoSearch").value;

    let dtfechaVigPagoINI;
    if (BusquedaFechaPagoIni == "") {
        const fecha = new Date(0);
        dtfechaVigPagoINI = formatearFechaString(fecha);
    } else {
        const fechaPagoIniMoment = moment(BusquedaFechaPagoIni, "YYYY-MM-DD");
        const dtfechaPagoIni = fechaPagoIniMoment.toDate();
        dtfechaVigPagoINI = formatearFechaString(dtfechaPagoIni);
    }
    let dtfechaVigPagoFIN;
    if (BusquedaFechaPagoFin == "") {
        const fecha = new Date(0);
        dtfechaVigPagoFIN = formatearFechaString(fecha);
    } else {
        const fechaPagoFinMoment = moment(BusquedaFechaPagoFin, "YYYY-MM-DD");
        const dtfechaPagoFin = fechaPagoFinMoment.toDate();
        dtfechaVigPagoFIN = formatearFechaString(dtfechaPagoFin);
    }

    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const listadoVentas = await getCobranza(0, dtfechaVigINI, dtfechaVigFIN, dtfechaVigPagoINI, dtfechaVigPagoFIN, AgenciaId, BsqLiquidacion);
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
}
async function getCobranza(pId, pfechaIni, pfechaFin, pfechaPagoIni, pfechaPagoFin, pIdusuario, pcodLiquidacion) {
    const urlApiFecht = menuUrlApi + "Cobranza/CobranzasObtener";
    const urlParametro = "?pCobranzaId=" + pId + "&pCobranzaIngresoInicio=" + pfechaIni + "&pCobranzaIngresoFin=" + pfechaFin + "&pCobranzaPagoInicio=" + pfechaPagoIni + "&pCobranzaPagoFin=" + pfechaPagoFin + "&pUsuarioId=" + pIdusuario + "&pcodLiquidacion=" + pcodLiquidacion;
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
async function deleteCobranzaBorrar(id) {
    const urlApiFecht = menuUrlApi + "Cobranza/CobranzasEliminar";
    const urlParametro = "?pCobranzaID=" + id;
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
//DOCUMENTO PAGO
let elvalidarSolcitudAnular = $("#modalDatosVentaCancelar").validate({
    rules: {
        mdvenSelMetodoDetLiquiCance: "required",
        mdvenFecPagoDetLiquiCance: {
            required: true,
        },
        mdvenTxtObservaDetLiquiCance: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdvenFilePagoDetLiquiCance: "required",
        mdvenTxtPagoDetLiquiCance: {
            required: true,
            number: true,
            min: 0.01,
            step: 0.01
        }
    },
    messages: {
        mdvenSelMetodoDetLiquiCance: "Seleccione un metodo de pago.",
        mdvenFecPagoDetLiquiCance: {
            required: "Seleccione fecha de pago.",
        },
        mdvenTxtObservaDetLiquiCance: {
            required: "Ingresar una observación.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdvenFilePagoDetLiquiCance: "Debe adjuntar un comprobante de pago.",
        mdvenTxtPagoDetLiquiCance: {
            required: "Ingrese un monto de pago.",
            number: "Debe ser un número válido.",
            min: "El monto debe ser mayor a 0.",
            step: "El monto debe ser de solo 2 decimales."
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
async function limpiarValidacionPago() {
    $("#mdvenSelMetodoDetLiquiCance").removeClass("is-valid");
    $("#mdvenSelMetodoDetLiquiCance").removeClass("is-invalid");

    $("#mdvenFecPagoDetLiquiCance").removeClass("is-valid");
    $("#mdvenFecPagoDetLiquiCance").removeClass("is-invalid");

    $("#mdvenFilePagoDetLiquiCance").removeClass("is-valid");
    $("#mdvenFilePagoDetLiquiCance").removeClass("is-invalid");

    $("#mdvenTxtPagoDetLiquiCance").removeClass("is-valid");
    $("#mdvenTxtPagoDetLiquiCance").removeClass("is-invalid");

    $("#mdvenTxtObservaDetLiquiCance").removeClass("is-valid");
    $("#mdvenTxtObservaDetLiquiCance").removeClass("is-invalid");

    $("#mdvenTxtCorreLiquiCance").removeClass("is-valid");
    $("#mdvenTxtCorreLiquiCance").removeClass("is-invalid");

    $("#mdvenFecPagooLiquiCance").removeClass("is-valid");
    $("#mdvenFecPagooLiquiCance").removeClass("is-invalid");

    document.getElementById('mdvenFilePagoDetLiquiCance').value = "";
    document.getElementById("mdvenTxtPagoDetLiquiCance").value = "";
    document.getElementById("mdvenTxtObservaDetLiquiCance").value = "";
    document.getElementById("mdvenSelMetodoDetLiquiCance").value = "";
    document.getElementById("mdvenFecPagoDetLiquiCance").value = "";
}
async function AbrirModalDocumento(id) {
    limpiarValidacionPago();
    IdPagoCobranza = 0;
    IdCobranza = id;
    const fechaNulla = new Date(0);
    dtfechaNulla = formatearFechaString(fechaNulla);
    const cobranza = await getCobranza(id, dtfechaNulla, dtfechaNulla, dtfechaNulla, dtfechaNulla, menuUserId,0);
    if (cobranza !== undefined) {
        if (cobranza.length > 0) {
            document.getElementById("mdvenTxtClieLiquiCance").value = cobranza[0].cobranzaCliente;
            document.getElementById("mdvenTxtImpBrutoLiquiCance").value = cobranza[0].cobranzaImporteBruto.toFixed(2);
            document.getElementById("mdvenTxtComisionLiquiCance").value = cobranza[0].cobranzaComision.toFixed(2);
            document.getElementById("mdvenTxtIncentLiquiCance").value = cobranza[0].cobranzaIncentivo.toFixed(2);
            document.getElementById("mdvenTxtImpCreditoLiquiCance").value = parseFloat(cobranza[0].cobranzaNotaCredito).toFixed(2);
            document.getElementById("mdvenTxtImpPagoLiquiCance").value = cobranza[0].cobranzaImportePago.toFixed(2);
            document.getElementById("mdvenSelTipoLiquiCance").value = cobranza[0].cobranzaDocumentoTipoId;
            document.getElementById("mdvenTxtSerieLiquiCance").value = cobranza[0].cobranzaDocumentoSerie;
            document.getElementById("mdvenTxtCorreLiquiCance").value = cobranza[0].cobranzaDocumentoCorrelativo;
            document.getElementById("mdvenTxtObservaLiquiCance").value = cobranza[0].cobranzaObservacion;
            document.getElementById("mdvenSelCobradorLiquiCance").value = cobranza[0].cobranzaCobradorId;
            const fechaMoment = moment(cobranza[0].cobranzaPagoFecha, "YYYY-MM-DD");
            const dtfecha = fechaMoment.toDate();
            document.getElementById("mdvenFecPagooLiquiCance").value = formatearFechaString(dtfecha);
            await CargarPagos(id);
        }
    }
    $('#popupModalVentaCancelar').modal('show');
}
async function AbrirComprobante(url) {
    $("#urlEvidencia").attr("src", url);
    $('#popupVerEvidencia').modal('show');
}
async function CargarPagos(id) {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEliminar;
    tablaGridPagos = $("#dtDetallePago").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "cobranzapagoMedioNombre", "render": function (mData, disp, alldata, row) {
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='borrarCobranzaPago(" + alldata.cobranzapagoId + ");'><i class='icon-trash'></i></a></li>"
                    if (alldata.usuarioActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData
                }
            }, {
                "mData": "cobranzapagoImporte", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return data;
                }
            }, {
                "mData": "cobranzapagoObservacion"
            }, {
                "mData": "cobranzapagoFecha", "render": function (mData, disp, alldata) {
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
                "mData": "cobranzapagoEvidenciaRuta", "className": "text-center", "render": function (mData, disp, alldata) {
                    let ruta = menuelapiUrlImagenes + "evidencias_eua/" + mData
                    let variablever = `<li class='edit'><a href='javascript:void(0);' onclick='AbrirComprobante("${ruta}");'><i class='icon-image'></i></a></li>`
                    if (mData.includes(".pdf") == true || mData.includes(".mp4") == true || mData.includes(".doc") == true || mData.includes(".docx") == true) {
                        variablever = `<li class='edit'><a href='${ruta}' target="_blank";'><i class='icon-clip'></i></a></li>`
                    }
                    return "<ul class='action'>" + variablever + "</ul>"
                }
            }, {
                "mData": "cobranzapagoEstadoNombre"
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonEliminar + "</ul>";
                }
            }, {
                "mData": "cobranzapagoId", "bVisible": false
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": true,
        rowCallback: function (row, data) { },
        filter: true,
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
    const listadoPagos = await getCobranzaPago(id);
    if (listadoPagos !== undefined) {
        if (listadoPagos.length > 0) {
            tablaGridPagos.clear().draw();
            tablaGridPagos.rows.add(listadoPagos).draw();
        }
    } else {
        const listadoVacio = [];
        tablaGridPagos.clear().draw();
        tablaGridPagos.rows.add(listadoVacio).draw();
    }
}
async function clickValidarPasajero() {
    if ($("#modalDatosVentaCancelar").valid()) {
        const resultado = await ProcesaCobranzaPago();
        if (resultado.errorCodigo == 200) {
            await CargarPagos(IdCobranza)
            mostrarMensaje(1, resultado.errorDescripcion)
            limpiarValidacionPago();
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function ProcesaCobranzaPago() {

    const elimportepagoTotal = parseFloat(document.getElementById("mdvenTxtImpPagoLiquiCance").value);
    const elimportePagoDetalle = parseFloat(document.getElementById("mdvenTxtPagoDetLiquiCance").value);
    let elimportePagoAcumulado = 0.00;
    const tablaDetPagos = $("#dtDetallePago").DataTable();
    tablaDetPagos.rows().data().each(function (value, index) {
        const valorImporteGuardado = value.cobranzapagoImporte;
        elimportePagoAcumulado += parseFloat(valorImporteGuardado);
    });
    const elimportePagoAcumuladoTotal = elimportePagoAcumulado + elimportePagoDetalle;
    if (elimportePagoAcumuladoTotal > elimportepagoTotal) {
        const dataEnviarError = {
            errorCodigo: 401,
            errorDescripcion: "El total de los montos de pagos exceden al importe de pago."
        };
        return dataEnviarError;
    }
    const Archivos = document.getElementById('mdvenFilePagoDetLiquiCance');
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
    const elmotivoObserva = document.getElementById("mdvenTxtObservaDetLiquiCance");
    const elimportePago = document.getElementById("mdvenTxtPagoDetLiquiCance");
    const elcboMetodo = document.getElementById("mdvenSelMetodoDetLiquiCance");
    const valorelcboMetodo = elcboMetodo.options[elcboMetodo.selectedIndex].value;
    const ladatFechaPago = document.getElementById("mdvenFecPagoDetLiquiCance");
    let fechaFormateaPago;
    if (ladatFechaPago.value == "") {
        const fecha = new Date(0);
        fechaFormateaPago = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaPago.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaPago = formatearFechaString(dtfechaIniV);
    }

    const dataEnviar = {
        cobranzapagoId: parseInt(IdPagoCobranza),
        cobranzapagoCobranzaId: parseInt(IdCobranza),
        cobranzapagoMedioId: parseInt(valorelcboMetodo),
        cobranzapagoFecha: fechaFormateaPago,
        cobranzapagoImporte: parseFloat(elimportePago.value),
        cobranzapagoCreadoUsuario: parseInt(menuUserId),
        extensionArchivo: eltipofile,
        archivoBase64: base64archivoFinal,
        cobranzapagoEvidenciaRuta: "",
        cobranzapagoObservacion: elmotivoObserva.value
    };
    const resultado = await postCobranzaPago(dataEnviar);
    return resultado;
}
async function borrarCobranzaPago(Id) {
    const alerta = await swal({
        title: "¿Está seguro de eliminar el pago?",
        text: "Se va eliminar el pagoo solo para este proceso.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await deleteCobranzaPagoBorrar(Id);
        if (resultado.errorCodigo == 200) {
            await CargarPagos(IdCobranza)
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function getCobranzaPago(pId) {
    const urlApiFecht = menuUrlApi + "Cobranza/CobranzasPagoObtener";
    const urlParametro = "?pCobranzaId=" + pId;
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
async function postCobranzaPago(enviarBody) {
    const urlApiFecht = menuUrlApi + "Cobranza/CobranzasPagoProcesar";
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
async function deleteCobranzaPagoBorrar(id) {
    const urlApiFecht = menuUrlApi + "Cobranza/CobranzasPagoEliminar";
    const urlParametro = "?pCobranzaPagoID=" + id;
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