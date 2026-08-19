IniciarFechasBsuqueda();
CargarTodo();
hideLoader();

function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}

// Función para copiar al portapapeles y mostrar mensaje
async function copyNumero(valor) {
    try {
        if (!valor) {
            swal("Aviso", "No hay número para copiar", "warning");
            return;
        }
        // Preferir Clipboard API moderna
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(valor);
        } else {
            // Fallback para navegadores antiguos: textarea + execCommand
            const textarea = document.createElement('textarea');
            textarea.value = valor;
            // Evitar que el textarea afecte el layout y asegurar selección
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            // @ts-ignore: evita la advertencia TS6387 en proyectos con checkJs
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        swal("Número copiado", valor, "success");
    } catch (err) {
        console.error(err);
        swal("Error", "No se pudo copiar el número", "error");
    }
}

async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    
    tablaGrid = $("#dtVenta").DataTable({
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" }            
        ],
        "order": [["24", "asc"]],
        "data": [],
        "aoColumns": [
            {
                // Columna de acción: botón para copiar el número
                "mData": null,
                "className": "text-center",
                "orderable": false,
                "render": function (mData, disp, alldata) {
                    const numero = alldata.pasajeroDocumentoNumero ? String(alldata.pasajeroDocumentoNumero).replace(/"/g, '\\"') : "";
                    return "<button class='btn btn-sm btn-outline-primary' onclick='copyNumero(\"" + numero + "\")' title='Copiar número'><i class='fa fa-copy'></i></button>";
                }
            },
            {
                "mData": "pasajeroDocumentoTipoNombre"
            }, {
                "mData": "pasajeroDocumentoNumero"
            }, {
                "mData": "pasajeroNombres"
            }, {
                "mData": "pasajeroApellidos"
            }, {
                "mData": "pasajeroFechaNacimiento", "render": function (mData, disp, alldata) {
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
                "mData": "pasajeroEdad"
            }, {
                "mData": "contactoProducto"
            }, {
                "mData": "fechaInicio"
            }, {
                "mData": "fechaFin"
            }, {
                "mData": "contactoAgencia"
            }, {
                "mData": "pasajeroEmail"
            }, {
                "mData": "pasajeroDireccion"
            }, {
                "mData": "pasajeroDistrito"
            }, {
                "mData": "pasajeroTelefono"
            }, {
                "mData": "pasajeroCiudad"
            }, {
                "mData": "pasajeroPais"
            }, {
                "mData": "contactoNombres"
            }, {
                "mData": "contactoDireccion"
            }, {
                "mData": "contactoEmail"
            }, {
                "mData": "contactoTelefono"
            }, {
                "mData": "contactoDistrito"
            }, {
                "mData": "contactoPais"
            }, {
                "mData": "dias"
            }, {
                "mData": "pasajeroFechaRegistro", "render": function (mData, disp, alldata) {
                    const strfechaDesde2 = mData;
                    const fechaDesdeMoment = moment(strfechaDesde2, "YYYY-MM-DD");
                    const dtfechaDesde = fechaDesdeMoment.toDate();
                    const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
                    const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
                    const strfechaDesdeAnh = dtfechaDesde.getFullYear();
                    const strfechaDesdeFin = strfechaDesdeDia + "/" + strfechaDesdeMes + "/" + strfechaDesdeAnh;
                    return strfechaDesdeFin
                }
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": true,
        rowCallback: function (row, data) { },               
        filter: true,
        pageLength: 25,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        bInfo: false,
        bAutoWidth: true,
        info: false,
        ordering: true,
        processing: true,
        responsive: true,
        "autoWidth": true,
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
        }
    });       

    const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;
    const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
    const dtfechaIni = fechaIniMoment.toDate();
    const dtfechaVigINI = formatearFechaString(dtfechaIni);
    const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
    const dtfechaFin = fechaFinMoment.toDate();
    const dtfechaVigFIN = formatearFechaString(dtfechaFin);
    const listadoVentas = await getPasajeros('','',dtfechaVigINI, dtfechaVigFIN);
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
async function getPasajeros(pDocumentipo,pDocumentoNumero,pfechaIni, pfechaFin) {
    const urlApiFecht = menuUrlApi + "generales/PasajeroListar";
    const urlParametro = "?DocumentoTipo=" + pDocumentipo + "&DocumentoNumero=" + pDocumentoNumero +"&Inicio=" + pfechaIni + "&Fin=" + pfechaFin;
    console.log(urlApiFecht + urlParametro);
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

async function AbrirModalBusqueda() { 
    $('#popupModalVentaSearch').modal('show');
}
async function limpiarModalBuqueda() {
    IniciarFechasBsuqueda();   
}
async function clickBuscarLimpiar() {
    limpiarModalBuqueda();
}
async function clickBuscarVentas() {
    CargarTodo()
    $('#popupModalVentaSearch').modal('hide');   
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