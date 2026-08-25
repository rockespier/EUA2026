hideLoader();
IniciarFechasBsuqueda();
CargarTodo();

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
}
async function AbrirComprobante(url) {
    $("#urlEvidencia").attr("src", url);
    $('#popupVerEvidencia').modal('show');
}


async function aprobarPago(Id) {
    const alerta = await swal({
        title: "¿Está seguro de aprobar este pago?",
        text: "Al realizar esta acción se considera el incentivo como pagado.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await updatePagoEstado(Id, 2);
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

async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonVisualizar;
    let botonEliminar;
    tablaGrid = $("#dtPagos").DataTable({
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" }
        ],
        "data": [],
        "aoColumns": [
            {
                "mData": "agenciaNombre"
            }, {
                "mData": "ventaCreadoFecha", "render": function (mData, disp, alldata) {
                    const fechaMoment = moment(mData, "YYYY-MM-DD");
                    const dtfecha = fechaMoment.toDate();

                    const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
                    const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
                    const strfechaAnh = dtfecha.getFullYear();

                    const strfechaFin = strfechaDia + "/" + strfechaMes + "/" + strfechaAnh;

                    return strfechaFin
                }
            }, {
                "mData": "ventaUsuarioAgenciaNombre", "render": function (mData, disp, alldata) {
                    botonVisualizar = "<li class='edit'><a href='javascript:void(0);' onclick='aprobarPago(" + alldata.ventaid + "," + alldata.beneficiarioId +");' title='Pagar'><i class='fa fa-check-square'></i></a></li>"                    
                    return mData
                }
            }, {
                "mData": "ventaid"
            }, {
                "mData": "ventaImporteventa", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "incentivoEstadoPago"
            }, {
                "mData": "incentivoPagoFecha", "render": function (mData, disp, alldata) {                    
                    if (mData === "0001-01-01T00:00:00") {
                        return "";
                    } else {
                        const fechaMoment = moment(mData, "YYYY-MM-DD");
                        const dtfecha = fechaMoment.toDate();

                        const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
                        const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
                        const strfechaAnh = dtfecha.getFullYear();

                        const strfechaFin = strfechaDia + "/" + strfechaMes + "/" + strfechaAnh;

                        return strfechaFin
                    }
                    
                }
            }, {
                "mData": "incentivoCuentaBancaria"
            }, {
                "mData": "ventaIncentivoImporte", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonVisualizar + "&nbsp;</ul>";
                }
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
        },
        footerCallback: function (row, data, start, end, display) {
            let api = this.api();
            const simbolo = 'USD ';            
            // Remove the formatting to get integer data for summation
            let intVal = function (i) {
                return typeof i === 'string'
                    ? i.replace(/[\$,]/g, '') * 1
                    : typeof i === 'number'
                        ? i
                        : 0;
            };

            // Total over all pages
            total = api
                .column(8)
                .data()
                .reduce((a, b) => intVal(a) + intVal(b), 0);

            // Total over this page
            pageTotal = api
                .column(8, { page: 'current' })
                .data()
                .reduce((a, b) => intVal(a) + intVal(b), 0);

            // Update footer
            api.column(8).footer().innerHTML =
                simbolo + pageTotal + ' ( ' + simbolo + ' ' + total + ' total general)';
        }
    });
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
   
    let AgenciaId = 0;
    //if (menuelOrigen !== 'U') {
    //    AgenciaId = menuelAgenciaUsuarioId;
    //}

    const listadoVentas = await getPago(AgenciaId, dtfechaVigINI, dtfechaVigFIN);
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
async function clickBuscarVentas() {
    CargarTodo()
    $('#popupModalVentaSearch').modal('hide');
    /*IniciarTablaClick();*/
}

async function IniciarFechasBsuqueda() {
    const fechaHoy = new Date();
    const dtfechaHoy = new Date(fechaHoy.setDate(fechaHoy.getDate() + 1));
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;

    const fechaMes = new Date();
    const fecha1mes = new Date(fechaMes.setDate(fechaMes.getDate() - 30));
    const strfecha1mesDia = ("0" + fecha1mes.getDate()).slice(-2)
    const strfecha1mesMes = ("0" + (fecha1mes.getMonth() + 1)).slice(-2)
    const strfecha1mesAnh = fecha1mes.getFullYear();
    const strfecha1mesFin = strfecha1mesAnh + "-" + strfecha1mesMes + "-" + strfecha1mesDia;

    document.getElementById("mdvenFecIncioVigSearch").value = strfecha1mesFin;
    document.getElementById("mdvenFecFinalVigSearch").value = strfechaHoyFin;
}

async function getPago(pId, dte_pFechaInicio, dte_pFechaFin) {
    const urlApiFecht = menuUrlApi + "Cobranza/IncentivoPagoObtener";
    const urlParametro = "?int_pBeneficiarioId=" + pId + "&dte_pFechaInicio=" + dte_pFechaInicio + "&dte_pFechaFin=" + dte_pFechaFin;
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

function clickDescargarPlantillaIncentivos() {
    const link = document.createElement('a');
    link.href = '/descargarPlantillaPagoIncentivos';
    link.download = 'PagoIncentivos_Plantilla.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function AbrirModalImportarIncentivos() {
    const formModal = document.getElementById("modalDatosImportarIncentivos");
    formModal.reset();
    inActivarImportacionCargaIncentivos();
    $('#divResultadoIncentivos').hide();
    $('#popupModalImportarIncentivos').modal('show');
}
async function clickImportarIncentivosLimpiar() {
    limpiarModaImportarIncentivos();
}
function limpiarModaImportarIncentivos() {
    document.getElementById("mdFileImportarIncentivos").value = "";
    $('#mdDescargarErrorIncentivos').empty();
    $('#divResultadoIncentivos').hide();
}
async function activarImportacionCargaIncentivos() {
    $('#mdBotImportarIncentivos').hide();
    $('#mdBotImportarIncentivosCarga').show();
}
async function inActivarImportacionCargaIncentivos() {
    $('#mdBotImportarIncentivos').show();
    $('#mdBotImportarIncentivosCarga').hide();
}
const toBase64Incentivos = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
$('#mdBotImportarIncentivos').on('click', async function (e) {
    const Archivos = document.getElementById('mdFileImportarIncentivos');
    const CantidadArchivos = Archivos.files.length;
    if (CantidadArchivos == 0) {
        mostrarMensaje(3, "Por favor seleccionar al menos un archivo para cargar.");
        return false;
    }
    const imobj = Archivos.files[0];
    const eltipo = imobj.type;
    const eltamano = imobj.size;
    if (eltamano > 500000000) {
        mostrarMensaje(3, "El archivo excede el máximo  de 500MB, por favor seleccionar un archivo menor.");
        return false;
    }
    const infoQuitaDatoBase64 = "data:" + eltipo + ";base64,";
    const base64archivo = await toBase64Incentivos(imobj);
    const base64archivoFinal = base64archivo.replace(infoQuitaDatoBase64, "")
    showLoader();
    activarImportacionCargaIncentivos();
    try {
        const info = {
            base64archivo: base64archivoFinal,
        };
        let response = await fetch('/importarExcelPagoIncentivos', {
            method: 'POST',
            headers: {
                'Accept': 'application/octet-stream',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
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
            if (fileName == "ok.xlsx") {
                CargarTodo();
                $('#divResultadoIncentivos').hide();
                $('#popupModalImportarIncentivos').modal('hide');
                mostrarMensaje(1, "Se actualizaron los post-incentivos correctamente.");
            } else {
                const originalBlob = await response.blob();
                const contenido = await originalBlob.text();
                const blob = new Blob(
                    [new TextEncoder().encode(contenido)],
                    { type: "text/plain;charset=utf-8" }
                );
                $('#mdDescargarErrorIncentivos').empty();
                const eldjuntodescargar = document.getElementById("mdDescargarErrorIncentivos");
                const aDescarga = document.createElement("a");
                const rutaUrl = URL.createObjectURL(blob);
                aDescarga.setAttribute("href", rutaUrl);
                aDescarga.setAttribute("target", "_blank");
                aDescarga.style.color = "red";
                aDescarga.innerHTML = `Existen errores en la importación, click aquí para ver los errores.`
                eldjuntodescargar.appendChild(aDescarga)
                $('#divResultadoIncentivos').show();
            }
        } else {
            mostrarMensaje(1, "Error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {
        hideLoader();
        inActivarImportacionCargaIncentivos();
    }
});

async function updatePagoEstado(ventaId, beneficiarioId) {
    const urlApiFecht = menuUrlApi + "Cobranza/IncentivoPagoProcesar";
    const urlParametro = "?pVentaId=" + ventaId + "&pBeneficiarioId=" + beneficiarioId + "&pUsuarioId=" + menuUserId;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'PUT',
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