ReseteoLocalStorage();
hideLoader();
CargarTodo();

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

function ReseteoLocalStorage() {
    localStorage.removeItem('lspagosel');
}

function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}

async function AbrirModalBusqueda() {
    cargarCombosBusqueda();
    $('#popupModalVentaSearch').modal('show');
}
async function limpiarModalBuqueda() {
    document.getElementById("mdCodLiquidacion").value = "";    
    ReseteoLocalStorage()
}

async function cargarCombosBusqueda() {
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;        
    }
   
    if (AgenciaId === 0) {
        const elcomboAgencia = await getAgencia(0, 1, 0, 0, '', '');
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
                    localStorage.setItem("lspagosel", selection.agenciaId); // Guarda el ID
                });
            }
        }
    }

    
}

async function AbrirComprobante(url) {
    $("#urlEvidencia").attr("src", url);
    $('#popupVerEvidencia').modal('show');
}

async function denegarPago(Id) {
    const alerta = await swal({
        title: "¿Está seguro de rechazar este pago?",
        text: "Las ventas no se cancelarán.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await updatePagoEstado(Id, 3);
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
async function aprobarPago(Id) {
    const alerta = await swal({
        title: "¿Está seguro de aprobar este pago?",
        text: "Las ventas relacionadas a este pago se cancelarán.",
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
async function clickBuscarVentas() {
    CargarTodo()
    $('#popupModalVentaSearch').modal('hide');
   
}
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonVisualizar;
    let botonEliminar;
    tablaGrid = $("#dtPagos").DataTable({
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
                "mData": "Documento", "render": function (mData, disp, alldata) {
                    var resultado = alldata.cobranzaDocumentoTipoNombre + " - " + alldata.documento
                    return resultado;
                }
            }, {
                "mData": "cobranzapagoAgenciaNombre"
            }, {
                "mData": "cobranzapagoMedioNombre", "render": function (mData, disp, alldata) {
                    botonVisualizar = "<li class='edit'><a href='javascript:void(0);' onclick='aprobarPago(" + alldata.cobranzapagoId + ");' title='Aprobar pago'><i class='fa fa-check-square'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='denegarPago(" + alldata.cobranzapagoId + ");' title='Denegar pago'><i class='fa fa-minus-square'></i></a></li>"
                    return mData
                }
            }, {
                "mData": "cobranzapagoFecha", "render": function (mData, disp, alldata) {
                    const fechaMoment = moment(mData, "YYYY-MM-DD");
                    const dtfecha = fechaMoment.toDate();

                    const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
                    const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
                    const strfechaAnh = dtfecha.getFullYear();

                    const strfechaFin = strfechaDia + "/" + strfechaMes + "/" + strfechaAnh;

                    return strfechaFin
                }
            }, {
                "mData": "cobranzapagoImporte", "render": function (mData, disp, alldata) {
                    if (mData != null && !isNaN(mData)) {
                        return parseFloat(mData).toFixed(2);
                    }
                    return mData;
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
                "mData": "cobranzapagoObservacion"
            }, {
                "mData": "cobranzapagoCreadoFecha", "render": function (mData, disp, alldata) {
                    const fechaMoment = moment(mData, "YYYY-MM-DD");
                    const dtfecha = fechaMoment.toDate();

                    const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
                    const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
                    const strfechaAnh = dtfecha.getFullYear();

                    const strfechaFin = strfechaDia + "/" + strfechaMes + "/" + strfechaAnh;

                    return strfechaFin
                }
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonVisualizar + "&nbsp;" + botonEliminar + "</ul>";
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
        }
    });
    /*const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
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
    }*/


    //const listadoVentas = await getPago(0, dtfechaVigINI, dtfechaVigFIN, dtfechaVigPagoINI, dtfechaVigPagoFIN, menuUserId);
    let BsqLiquidacion = 0;
    const codLiquidacion = document.getElementById("mdCodLiquidacion").value;

    if (codLiquidacion === null || codLiquidacion === undefined || codLiquidacion === '') {
        BsqLiquidacion = 0
    } else {
        BsqLiquidacion = codLiquidacion;
    }

    let bsqAgenciaId = 0;
    let AgenciaId = localStorage.getItem("lspagosel");
    if (AgenciaId === null || AgenciaId === undefined || AgenciaId === '') {
        bsqAgenciaId = 0;
    } else {
        bsqAgenciaId = AgenciaId;
    }
    if (menuelOrigen !== 'U') {
        bsqAgenciaId = menuelAgenciaUsuarioId;
    }

    const listadoVentas = await getPago(bsqAgenciaId, BsqLiquidacion);
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

async function getPago(pId, BsqLiquidacion) {
    const urlApiFecht = menuUrlApi + "Cobranza/CobranzasVerificarPagoObtener";
    const urlParametro = "?pAgenciaId=" + pId + "&int_pCodLiquidacion=" + BsqLiquidacion;
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

async function updatePagoEstado(id, estado) {
    const urlApiFecht = menuUrlApi + "Cobranza/CobranzasVerificarPagoProcesar";
    const urlParametro = "?pCobranzaId=" + id + "&pEstadoId=" + estado;
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