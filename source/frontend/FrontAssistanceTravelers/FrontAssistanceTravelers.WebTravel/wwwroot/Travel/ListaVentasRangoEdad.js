
cargarCombosBusqueda();

cargarAcciones();
async function cargarAcciones() {
    await CargarTodo();
    setTimeout(async () => {
        await drawTable();
        // Registrar eventos de exportación después de que las tablas estén listas
        registrarEventosExportacion();
    }, 600);
    hideLoader();
}


function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}

async function drawTable() {
    const BusquedaTipoReporte = $("#mdvenselTipoReporteSearch option:selected").val();
    var dTable = $('#dtVenta').DataTable();
    console.log('tipo reporte', BusquedaTipoReporte);
    if (BusquedaTipoReporte == 2) {
        dTable.columns(3).header().to$().text('Cantidad');
    } else {
        dTable.columns(3).header().to$().text('Importe USD');
    }
    dTable.columns.adjust().draw();
}

const table = $('#dtVenta').DataTable();

// Nueva función para registrar eventos de exportación
function registrarEventosExportacion() {
    // Limpiar eventos previos para evitar duplicados
    $("#btnExport").off('click');
   
    // Evento para el primer botón de exportación
    $("#btnExport").on('click', function (e) {
        e.preventDefault();
        console.log('Click en btnExport detectado');

        try {
            let anioFiltro = $("#mdvenselAnioSearch option:selected").val() || new Date().getFullYear();
            const table = $('#dtVenta').DataTable();

            // Verifica que la tabla exista
            if (!table || !table.rows().count()) {
                console.warn('La tabla está vacía o no existe');
                swal("Aviso", "No hay datos para exportar", "warning");
                return;
            }

            // ✅ SOLUCIÓN: Configuración mejorada de exportación
            const buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    {
                        extend: 'excelHtml5',
                        title: 'Ventas_por_rango_edad_' + anioFiltro,
                        filename: 'Ventas_por_rango_edad_' + anioFiltro,
                        exportOptions: {
                            columns: [0, 1, 2, 3],
                            footer: false, // Desactivar footer
                            format: {
                                body: function (data, row, column, node) {
                                    if (column === 3) {
                                        const cleanValue = String(data).replace(/[^0-9.-]/g, '');
                                        const numValue = parseFloat(cleanValue);
                                        return !isNaN(numValue) ? numValue : 0;
                                    }
                                    return data;
                                },
                                header: function (data, column, node) {
                                    return data || '';
                                }
                            },
                            modifier: {
                                page: 'all',
                                search: 'applied'
                            }
                        },
                        customize: function (xlsx) {
                            const sheet = xlsx.xl.worksheets['sheet1.xml'];

                            // Aplica formato numérico a la columna E (Importe)
                            $('row c[r^="E"]', sheet).each(function (index) {
                                if (index > 0) {
                                    $(this).attr('s', '2');
                                    const value = $(this).find('v').text();
                                    if (value && !isNaN(value)) {
                                        $(this).attr('t', 'n');
                                    }
                                }
                            });
                        }
                    }
                ]
            });

            // Agregar el botón temporal al DOM
            const container = buttons.container().appendTo('body');

            // Esperar un momento antes de hacer click
            setTimeout(function () {
                const excelBtn = container.find('.buttons-excel');
                if (excelBtn.length > 0) {
                    excelBtn[0].click();
                    console.log('Exportación iniciada');
                } else {
                    console.error('No se encontró el botón de Excel');
                }

                // ✅ CAMBIO: Aumentar el tiempo de limpieza a 500ms para evitar race condition
                // Esto da tiempo suficiente para que termine el proceso async (100ms) + margen de seguridad
                setTimeout(function () {
                    // ✅ AÑADIDO: Verificar que el botón aún existe antes de destruir
                    if (buttons && typeof buttons.destroy === 'function') {
                        try {
                            buttons.destroy();
                            container.remove();
                            console.log('Botones limpiados correctamente');
                        } catch (error) {
                            console.warn('Error al limpiar botones:', error);
                        }
                    }
                }, 500); // Aumentado de 100ms a 500ms
            }, 50);

        } catch (error) {
            console.error('Error en exportación:', error);
            swal("Error", "Ocurrió un error al exportar: " + error.message, "error");
        }
    });

    

    console.log('Eventos de exportación registrados correctamente');
}

async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    tablaGrid = $("#dtVenta").DataTable({
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
                        title: 'VentasporProducto'
                    },
                    {
                        extend: 'pdf',
                        title: 'VentasporProducto'
                    },
                    {
                        extend: 'print',
                        text: 'Imprimir',
                        title: 'VentasporProducto'
                    }
                ]
            }
        },
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" },
            { width: '40%', targets: 2 }
        ],
        "data": [],
        "aoColumns": [
            {
                "mData": "anio"
            }, {
                "mData": "mes"
            }, {
                "mData": "nombre"
            }, {
                "mData": "importe", "render": function (mData, disp, alldata) {
                    if (alldata.tipoReporte == 1) { return $.fn.dataTable.render.number(',', '.', 0, '').display(mData); }
                    else {
                        return mData;
                    }
                }
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
        },
        footerCallback: function (row, data, start, end, display) {
            let api = this.api();

            let intVal = function (i) {
                return typeof i === 'string'
                    ? i.replace(/[\$,]/g, '') * 1
                    : typeof i === 'number'
                        ? i
                        : 0;
            };

            // Calcular el total
            let total = api
                .column(3)
                .data()
                .reduce((a, b) => intVal(a) + intVal(b), 0);

            let newCurrancy = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(total);

            // ✅ SOLUCIÓN DEFINITIVA: Verificar que el footer existe antes de actualizar
            try {
                // Verificar si cada footer existe antes de actualizarlo
                const footerCells = [
                    api.column(0).footer(),
                    api.column(1).footer(),
                    api.column(2).footer(),
                    api.column(3).footer()
                ];

                // Solo actualizar si todos los footers existen
                if (footerCells.every(cell => cell !== null && cell !== undefined)) {
                    $(footerCells[0]).html('Total:');
                    $(footerCells[1]).html('');
                    $(footerCells[2]).html('');
                    $(footerCells[3]).html(newCurrancy);
                }
            } catch (err) {
                console.warn('No se pudo actualizar el footer:', err);
            }
        }
    });

    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const anioActual = new Date().getFullYear();

    let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value;
    let BusquedaCodProducto = document.getElementById("mdvenselProductoSearch").value;
    let BusquedaCodAgencia = localStorage.getItem("lsventarangoSel");
    let BusquedaCancelacion = document.getElementById("mdvenselCancelacionSearch").value;
    let BusquedaTipoReporte = document.getElementById("mdvenselTipoReporteSearch").value;
    let BusquedaAnio = document.getElementById("mdvenselAnioSearch").value;

    if (BusquedaCodPais === "") {
        BusquedaCodPais = menuPaisId;
    }
    if (BusquedaCodProducto === "") {
        BusquedaCodProducto = 0;
    }
    console.log(BusquedaCodAgencia);

    if (BusquedaCodAgencia == "" || BusquedaCodAgencia == null) {
        BusquedaCodAgencia = 0;
    }
    if (BusquedaCancelacion === "") {
        BusquedaCancelacion = "0";
    }
    if (BusquedaTipoReporte === "") {
        BusquedaTipoReporte = 1;
    }
    if (BusquedaAnio === "") {
        BusquedaAnio = anioActual;
    }

    const listadoVentas = await getVentasRangoEdad(BusquedaCodPais, BusquedaCancelacion, BusquedaAnio, BusquedaTipoReporte, BusquedaCodAgencia, 0, BusquedaCodProducto);
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
async function getVentasRangoEdad(int_pPaisId, int_pSituacionId, int_pAnio, int_TipoReporte, BusquedaCodAgencia, int_pPromotorId, BusquedaCodProducto) {
    const urlApiFecht = menuUrlApi + "Reportes/VentasRangoEdadObtener";
    const urlParametro = "?int_pGrupoId=1&int_pPaisId=" + int_pPaisId + "&int_pSituacionId=" + int_pSituacionId + "&int_pAnio=" + int_pAnio + "&int_pMes=0&int_TipoReporte=" + int_TipoReporte + "&int_pAgenciaId=" + BusquedaCodAgencia + "&int_pPromotorId=" + int_pPromotorId + "&int_pProductoId=" + BusquedaCodProducto;
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
    cargarAcciones();
    $('#popupModalVentaSearch').modal('hide');
}

async function cargarCombosBusqueda() {
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const elcomboProductos = await getProducto(0, 1, menuelAgenciaPaisId, AgenciaId);
    if (elcomboProductos !== undefined) {
        let cantElementos02 = elcomboProductos.length;
        if (cantElementos02 > 0) {
            $('#mdvenselProductoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboProductos) {
                const valorId = cboobj.productoId;
                const valorNombre = cboobj.productoNombre;
                $('#mdvenselProductoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

    const elcomboPais = await getPais(0, 1);
    if (elcomboPais !== undefined) {
        let cantElementos04 = elcomboPais.length;
        if (cantElementos04 > 0) {
            $('#mdvenSelPaisSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboPais) {
                const valorId = cboobj.paisId;
                const valorNombre = cboobj.paisNombre;
                $('#mdvenSelPaisSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    if (AgenciaId === 0) {
        const elcomboAgencia = await getAgencia(0, 1, 0, 0,'','');
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
                    localStorage.setItem("lsventarangoSel", selection.agenciaId); // Guarda el ID
                });
            }
        }
    }

    const anioActual = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
        const anio = anioActual - i;
        $('#mdvenselAnioSearch').append($('<option/>').attr("value", anio).text(anio));
    }
}
$('#mdvenSelPaisSearch').change(async function () {
    localStorage.removeItem('lsventarangoSel');
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const strIdPais = $(this).val();

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
                localStorage.setItem("lsventarangoSel", selection.agenciaId);
            });
        }
    }
    /*
    const elcomboTipo = await getPromotoresPais(menuUserId, strIdPais);
    if (elcomboTipo != undefined) {
        let cantElementos11 = elcomboTipo.length;
        if (cantElementos11 > 0) {
            $('#mdvenselPromotorSearch').empty();
            $('#mdvenselPromotorSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdvenselPromotorSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    */
});

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
        console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            console.log(object3);
            return object3;
        }
    }
}