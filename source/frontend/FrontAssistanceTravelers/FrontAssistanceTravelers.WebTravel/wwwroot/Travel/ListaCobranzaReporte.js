hideLoader();
IniciarFechasBsuqueda();
CargarTodo();
cargarCombosCancelar();
IniciarTablaClick();

function join(date, options, separator) {
    function format(option) {
        let formatter = new Intl.DateTimeFormat('en', option);
        return formatter.format(date);
    }
    return options.map(format).join(separator);
}
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

//const table = $('#dtPagos').DataTable();

//$("#btnExport").click(function (e) {
//    table.page.len(-1).draw();
//    var result = 'data:application/vnd.ms-excel;charset=utf-8,%EF%BB%BF' + encodeURIComponent($('#dtPagos').parent().html()).replace('Procesando...', ' ');
//    var link = document.createElement("a");
//    document.body.appendChild(link);
//    link.download = "Reporte_der_Cobranzas.xls"; //You need to change file_name here.
//    link.href = result;
//    link.click();
//    setTimeout(function () {
//        table.page.len(10).draw();
//    }, 1000)

//});

async function IniciarTablaClick() {
    const tablaGrid = $('#dtPagos').DataTable();
    $('#dtPagos tbody').on('click', 'tr td', function () {
        const datavalor = tablaGrid.row(this).data();       
        if (datavalor !== undefined) {
            const idRec = tablaGrid.row(this).data().cobranzaId;
            const cellIndex = tablaGrid.column(this).index();
            const columna = tablaGrid.column(cellIndex).header().textContent
            if (columna !== "") {
                AbrirModalCancelar(idRec)
            }
        }
    })
}

async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"    
    tablaGrid = $("#dtPagos").DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'copy',
                        text: 'Copiar',
                        title: 'Copiar'
                    },
                    {
                        extend: 'csv',
                        title: 'ReportedeCobranza'
                    },
                    {
                        extend: 'pdf',
                        title: 'ReportedeCobranza'
                    },
                    {
                        extend: 'print',
                        text: 'Imprimir',
                        title: 'ReportedeCobranza'
                    }
                ]
            }
        },
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" },
            {
                orderable: false,
                render: DataTable.render.select(),
                targets: 0
            }
        ],
        "data": [],
        "aoColumns": [
            {
                "sDefaultContent": '',
            },
            {
                "mData": "cobranzaPeriodoAnio", "render": function (mData, disp, alldata) {
                    
                    const strPeriodo = alldata.cobranzaPeriodoAnio + '-' + alldata.cobranzaPeriodoMes;

                    return strPeriodo
                }
            }, {
                "mData": "cobranzaCliente"
            }, {
                "mData": "cobranzaDocumentoTipoNombre", "render": function (mData, disp, alldata) {

                    const strDocumento = alldata.cobranzaDocumentoTipoNombre + ' ' + alldata.cobranzaDocumentoSerie + '-' + alldata.cobranzaDocumentoCorrelativo;

                    return strDocumento
                }
            }, {
                "mData": "cobranzaPagoFecha", "render": function (mData, disp, alldata) {
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
                "mData": "cobranzaFechaLiquidacion", "render": function (mData, disp, alldata) {
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
                "mData": "cobranzaFormulaLiquidacion"
            }, {
                "mData": "cobranzaEstadoPago"
            }, {
                "mData": "cobranzaImportePago", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "cobranzaPagos", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "cobranzaSaldo", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;               
                }
            }, {
                "mData": "cobranzaComision", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "cobranzaIncentivo", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "cobranzaNotaCredito", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "cobranzaDescuento", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "cobranzaImporteBruto", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
                }
            }, {
                "mData": "cobranzaObservacion"
            }, {
                "mData": "cobranzaPagoMedioNombre"
            }, {
                "mData": "cobranzaId"
            }, {
                "mData": "cobranzaCobradorNombre"
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
        ordering: false,
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
                });
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;

            // converting to interger to find total
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // computing column Total of the complete result 
            var nTotal1 = api
                .column(8)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var nTotal2 = api
                .column(9)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var nTotal3 = api
                .column(10)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var nTotal4 = api
                .column(11)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var nTotal5 = api
                .column(12)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            var nTotal6 = api
                .column(13)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            var nTotal7 = api
                .column(14)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            var nTotal8 = api
                .column(15)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);            

            // Update footer by showing the total with the reference of the column index 
            $(api.column(7).footer()).html('Total');
            $(api.column(8).footer()).html(formatNumber(nTotal1));
            $(api.column(9).footer()).html(formatNumber(nTotal2));
            $(api.column(10).footer()).html(formatNumber(nTotal3));
            $(api.column(11).footer()).html(formatNumber(nTotal4));
            $(api.column(12).footer()).html(formatNumber(nTotal5));        
            $(api.column(13).footer()).html(formatNumber(nTotal6));        
            $(api.column(14).footer()).html(formatNumber(nTotal7));        
            $(api.column(15).footer()).html(formatNumber(nTotal8));        
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
            
    const listadoVentas = await getCobranzaReporte(dtfechaVigINI, dtfechaVigFIN, dtfechaVigINI, dtfechaVigFIN);
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

function formatNumber(n) {
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
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
    const fecha1mes = new Date(fechaMes.setDate(fechaMes.getDate() - 30));
    const strfecha1mesDia = ("0" + fecha1mes.getDate()).slice(-2)
    const strfecha1mesMes = ("0" + (fecha1mes.getMonth() + 1)).slice(-2)
    const strfecha1mesAnh = fecha1mes.getFullYear();
    const strfecha1mesFin = strfecha1mesAnh + "-" + strfecha1mesMes + "-" + strfecha1mesDia;

    document.getElementById("mdvenFecIncioVigSearch").value = strfecha1mesFin;
    document.getElementById("mdvenFecFinalVigSearch").value = strfechaHoyFin;
   }

async function getCobranzaReporte(dte_pFechaInicio, dte_pFechaFin, dte_pFechaInicioPago, dte_pFechaFinPago) {
    const urlApiFecht = menuUrlApi + "cobranza/CobranzaReporteObtener";
    const urlParametro = "?dte_pFechaInicio=" + dte_pFechaInicio + "&dte_pFechaFin=" + dte_pFechaFin + "&dte_pFechaInicioPago=" + dte_pFechaInicioPago + "&dte_pFechaFinPago=" + dte_pFechaFinPago;
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

async function AbrirModalCancelar(id) {
   
    if (id == '0' || id == undefined) {
        limpiarModalCancelacion();
    } else {
   
        document.getElementById('mdHidIdCobranza').value = id;
        console.log(id);
        let optionsVacia = [{ day: 'numeric' }, { month: 'numeric' }, { year: 'numeric' }];
        const dtfechaIniVacia = join(new Date(1900, 0, 1), optionsVacia, '/');
        const dtfechaFinVacia = join(new Date(1900, 0, 1), optionsVacia, '/');
        const laCobranza = await getCobranza(id, dtfechaIniVacia, dtfechaFinVacia, dtfechaIniVacia, dtfechaFinVacia, 0, 0);
        if (laCobranza !== undefined) {
            if (laCobranza.length > 0) {
                window.laCobranza = laCobranza[0];
                document.getElementById("mdvenSelTipoLiquiCance").value = laCobranza[0].cobranzaDocumentoTipoId;
                document.getElementById("mdvenTxtSerieLiquiCance").value = laCobranza[0].cobranzaDocumentoSerie;
                document.getElementById("mdvenTxtCorreLiquiCance").value = laCobranza[0].cobranzaDocumentoCorrelativo;
                document.getElementById("mdvenTxtClieLiquiCance").value = laCobranza[0].cobranzaCliente;
                document.getElementById("mdvenTxtImpBrutoLiquiCance").value = parseFloat(laCobranza[0].cobranzaImporteBruto).toFixed(2);
                document.getElementById("mdvenTxtObservaLiquiCance").value = laCobranza[0].cobranzaObservacion;
                document.getElementById("mdvenTxtComisionLiquiCance").value = parseFloat(laCobranza[0].cobranzaComision).toFixed(2);
                document.getElementById("mdvenTxtIncentLiquiCance").value = parseFloat(laCobranza[0].cobranzaIncentivo).toFixed(2);
                document.getElementById("mdvenTxtImpDescuento").value = parseFloat(laCobranza[0].cobranzaDescuento).toFixed(2);
                document.getElementById("mdvenTxtImpCreditoLiquiCance").value = parseFloat(laCobranza[0].cobranzaNotaCredito).toFixed(2);
                document.getElementById("mdvenTxtImpPagoLiquiCance").value = parseFloat(laCobranza[0].cobranzaImportePago).toFixed(2);
                document.getElementById("mdvenSelCobradorLiquiCance").value = laCobranza[0].cobranzaCobradorId;
                document.getElementById("mdvenSelMetoPagoLiquiCance").value = laCobranza[0].cobranzaPagoMedioId;

                const fechaMoment = moment(laCobranza[0].cobranzaPagoFecha, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdvenFecPagooLiquiCance").value = formatearFechaString(dtfecha);

            }
        }
    }          
    
    $('#popupModalVentaCancelar').modal('show');
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
async function clickValidarCancelacion() {
    if ($("#modalDatosVentaCancelar").valid()) {

        const resultado = await llamarFuncion();

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

async function llamarFuncion() {
    const txtCodCobranza = document.getElementById("mdHidIdCobranza");
    
    if (txtCodCobranza.value != '') {
        return actualizarCancelcacion();
    } else {
        return procesarCancelcacion();
    }
    
}

async function limpiarModalCancelacion() {
    document.getElementById("mdHidIdCobranza").value = "";
    document.getElementById("mdvenSelTipoLiquiCance").value = "";
    document.getElementById("mdvenTxtSerieLiquiCance").value = "";
    document.getElementById("mdvenTxtCorreLiquiCance").value = "";
    document.getElementById("mdvenTxtClieLiquiCance").value = "";
    document.getElementById("mdvenTxtImpBrutoLiquiCance").value = "";
    document.getElementById("mdvenTxtComisionLiquiCance").value = "";
    document.getElementById("mdvenTxtIncentLiquiCance").value = "";
    document.getElementById("mdvenTxtImpCreditoLiquiCance").value = "";
    document.getElementById("mdvenTxtImpPagoLiquiCance").value = "";
    document.getElementById("mdvenTxtImpDescuento").value = "";
    document.getElementById("mdvenSelMetoPagoLiquiCance").value = "";
    document.getElementById("mdvenFecPagooLiquiCance").value = "";
    document.getElementById("mdvenSelCobradorLiquiCance").value = "";
    document.getElementById("mdvenTxtObservaLiquiCance").value = "";
}

async function procesarCancelcacion() {
    //Nuevo
    debugger;
   const resultadoCorrelativo = await generarCodigoCorrelativo('cobranzaId');
   const idCobranza = resultadoCorrelativo.errorCodigo;
       
    const txtCobranzaCliente = document.getElementById("mdvenTxtClieLiquiCance");
    const txtCobranzaDocumentoSerie = document.getElementById("mdvenTxtSerieLiquiCance");
    const txtCobranzaDocumentoCorrelativo = document.getElementById("mdvenTxtCorreLiquiCance");
    const txtCobranzaObservaciones = document.getElementById("mdvenTxtObservaLiquiCance");
    const ladatFechaPago = document.getElementById("mdvenFecPagooLiquiCance")
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
    const txtCobranzaImporteBruto = document.getElementById("mdvenTxtImpBrutoLiquiCance");
    const txtCobranzaImpPago = document.getElementById("mdvenTxtImpPagoLiquiCance");
    const elcboTipoDoc = document.getElementById("mdvenSelTipoLiquiCance");
    const valoreselcboTipoDoc = elcboTipoDoc.options[elcboTipoDoc.selectedIndex].value;
    const elcboCobrador = document.getElementById("mdvenSelCobradorLiquiCance");
    const valoreselcboCobrador = elcboCobrador.options[elcboCobrador.selectedIndex].value;
    //const txtVentas = document.getElementById("mdHidIdVentas");
    //const txtCodLiquidacion = document.getElementById("mdHidCodLiquidacion");
    const elcboMetoPago = document.getElementById("mdvenSelMetoPagoLiquiCance");
    const valoreselcboMetoPago = elcboMetoPago.options[mdvenSelMetoPagoLiquiCance.selectedIndex].value;

    const dataEnviar = {
        cobranzaId: parseInt(idCobranza),
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
        cobranzaVentaIds: '',
        cobranzaDescuento: txtCobranzaDescuento.value,
        cobranzaCodigoLiquidacion: 0
    };
    console.log(dataEnviar);
    
    const resultado = await postLiquidacionCancelar(dataEnviar);
    
    return resultado;
}

async function actualizarCancelcacion() {
    //Actualizar
    const txtCodCobranza = document.getElementById("mdHidIdCobranza");
   
    let idCobranza = txtCodCobranza.value;
   
    const txtCobranzaCliente = document.getElementById("mdvenTxtClieLiquiCance");
    const txtCobranzaDocumentoSerie = document.getElementById("mdvenTxtSerieLiquiCance");
    const txtCobranzaDocumentoCorrelativo = document.getElementById("mdvenTxtCorreLiquiCance");
    const txtCobranzaObservaciones = document.getElementById("mdvenTxtObservaLiquiCance");
    const ladatFechaPago = document.getElementById("mdvenFecPagooLiquiCance")
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
    const txtCobranzaImporteBruto = document.getElementById("mdvenTxtImpBrutoLiquiCance");
    const txtCobranzaImpPago = document.getElementById("mdvenTxtImpPagoLiquiCance");
    const elcboTipoDoc = document.getElementById("mdvenSelTipoLiquiCance");
    const valoreselcboTipoDoc = elcboTipoDoc.options[elcboTipoDoc.selectedIndex].value;
    const elcboCobrador = document.getElementById("mdvenSelCobradorLiquiCance");
    const valoreselcboCobrador = elcboCobrador.options[elcboCobrador.selectedIndex].value;
    //const txtVentas = document.getElementById("mdHidIdVentas");
    //const txtCodLiquidacion = document.getElementById("mdHidCodLiquidacion");
    const elcboMetoPago = document.getElementById("mdvenSelMetoPagoLiquiCance");
    const valoreselcboMetoPago = elcboMetoPago.options[mdvenSelMetoPagoLiquiCance.selectedIndex].value;
    //const txtPublicidad = document.getElementById("mdvenTxtImpCreditoLiquiCance"); 

    const dataEnviar = {
        cobranzaId: parseInt(idCobranza),
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
        cobranzaVentaIds: '',
        cobranzaDescuento: txtCobranzaDescuento.value,
        cobranzaCodigoLiquidacion: 0,
        //cobranzaPublicidad: parseFloat(txtPublicidad.value).toFixed(2)
    };
    console.log(dataEnviar);
    
    const resultado = await postActualizarCancelar(dataEnviar);
   
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
async function postActualizarCancelar(enviarBody) {
    const urlApiFecht = menuUrlApi + "liquidacion/LiqCancelarActualizar";
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

async function documentoEliminar() {
    const checkExtornar = [];
    const tablaGrid = $('#dtPagos').DataTable();
    let contador = 0;
    tablaGrid.rows().every(function () {
        const cell = this.node();
        const data = this.data();
        const objeto = $(cell).find('input[type="checkbox"]')
        if (objeto.length > 0) {
            if (objeto[0].checked) {
                const row = cell.closest('tr');                            
                const situa = row.cells[5].innerText;                
                if (situa === "") {                    
                    const venta = {
                        idVenta: parseInt(data.cobranzaId.toString())                            
                    };
                    checkExtornar.push(venta);
                    contador += 1;                    
                } else {                    
                        tablaGrid.row(this.index()).deselect();                    
                }
            }
        }
    });
    if (contador == 0) {
        mostrarMensaje(3, "Seleccione como minimo un Documento sin liquidación, para realizar la eliminación.");
        return false;
    }
    
    const alerta = await swal({
        title: "¿Está seguro de eliminar lo(s) documento(s)?",
        text: "Se van eliminar los documentos.",
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
            const resultado = await postEliminarDocumento(ventaId);
            if (resultado.errorCodigo == 200) {
                cantidadOK += 1;
                resultadoDes = "Se elimino correctamente";
            } else {
                cantidadEror += 1;
                if (resultadoDes === "") {
                    resultadoDes = String(ventaId) + " - " + resultado.errorDescripcion;
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
async function postEliminarDocumento(id) {
    const urlApiFecht = menuUrlApi + "cobranza/CobranzasEliminar";
    const urlParametro = "?pCobranzaID=" + id;
    console.log(urlApiFecht + urlParametro);
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

async function exportaReporteCobranza() {
    const sesionActiva = await fetch('/validateJS', { credentials: 'include' });
    if (!sesionActiva.ok) {
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return;
    }
    const tablaGrid = $('#dtPagos').DataTable();
    const dataVentas = tablaGrid.rows().data();
    if (dataVentas.length == 0) {
        mostrarMensaje(2, "No existe información para generar el excel de ventas.");
        return false;
    }
    showLoader();
    try {

        const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
        const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;

        let dtfechaVigINI;
        let dtfechaVigFIN;
      
            const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
            const dtfechaIni = fechaIniMoment.toDate();
            dtfechaVigINI = formatearFechaString(dtfechaIni);
       
            const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
            const dtfechaFin = fechaFinMoment.toDate();
            dtfechaVigFIN = formatearFechaString(dtfechaFin);       
        
        const ventasParama = {
            fechaInicio: dtfechaVigINI,
            fechaFin: dtfechaVigFIN,
            fechaPagoInicio: dtfechaVigINI,
            fechaPagoFin: dtfechaVigFIN,
            usuarioNombre: window.loggedUserName || menuUserId,
            agenciaId: menuUserId,
            codliquidacion:0
        };

        console.log(ventasParama);

        let response = await fetch('/ReporteCobranzaGenerarExcel', {
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
            //CargarTodo();
        } else {
            mostrarMensaje(1, "Error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {
        hideLoader();
    }
}