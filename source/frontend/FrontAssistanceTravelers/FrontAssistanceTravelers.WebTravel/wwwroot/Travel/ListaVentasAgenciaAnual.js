
cargarCombosBusqueda();

cargarAcciones();
async function cargarAcciones() {
    await CargarTodo('dtVenta', 0);
    await CargarTodo('dtVenta2', 1);
    setTimeout(async () => {
        await drawTable('dtVenta');
        await drawTable('dtVenta2');
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

async function drawTable(dt) {
    const BusquedaTipoReporte = $("#mdvenselTipoReporteSearch option:selected").val();
    var dTable = $('#' + dt).DataTable();

    if (BusquedaTipoReporte == 2) {
        dTable.columns(2).header().to$().text('Cantidad');
    } else {
        dTable.columns(2).header().to$().text('Importe USD');
    }
    dTable.columns.adjust().draw();
}

// Nueva función para registrar eventos de exportación
function registrarEventosExportacion() {
    // Limpiar eventos previos para evitar duplicados
    $("#btnExport").off('click');
    $("#btnExport2").off('click');

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
                        title: 'Ventas_por_Agencia_' + anioFiltro,
                        filename: 'Ventas_por_Agencia_' + anioFiltro,
                        exportOptions: {
                            columns: [0, 1, 2],
                            footer: false, // Desactivar footer
                            format: {
                                body: function (data, row, column, node) {
                                    if (column === 2) {
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

    // Evento para el segundo botón de exportación (APLICAR EL MISMO CAMBIO)
    $("#btnExport2").on('click', function (e) {
        e.preventDefault();
        console.log('Click en btnExport2 detectado');

        try {
            let anioFiltro2 = $("#mdvenselAnioSearch option:selected").val() || new Date().getFullYear();
            anioFiltro2 = anioFiltro2 - 1;

            const table2 = $('#dtVenta2').DataTable();

            if (!table2 || !table2.rows().count()) {
                console.warn('La tabla 2 está vacía o no existe');
                swal("Aviso", "No hay datos para exportar", "warning");
                return;
            }

            const buttons2 = new $.fn.dataTable.Buttons(table2, {
                buttons: [
                    {
                        extend: 'excelHtml5',
                        title: 'Ventas_por_Agencia_' + anioFiltro2,
                        filename: 'Ventas_por_Agencia_' + anioFiltro2,
                        exportOptions: {
                            columns: [0, 1, 2],
                            footer: false,
                            format: {
                                body: function (data, row, column, node) {
                                    if (column === 2) {
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

            const container2 = buttons2.container().appendTo('body');

            setTimeout(function () {
                const excelBtn2 = container2.find('.buttons-excel');
                if (excelBtn2.length > 0) {
                    excelBtn2[0].click();
                    console.log('Exportación 2 iniciada');
                } else {
                    console.error('No se encontró el botón de Excel para tabla 2');
                }

                // ✅ CAMBIO: Aumentar el tiempo de limpieza a 500ms
                setTimeout(function () {
                    // ✅ AÑADIDO: Verificar que el botón aún existe antes de destruir
                    if (buttons2 && typeof buttons2.destroy === 'function') {
                        try {
                            buttons2.destroy();
                            container2.remove();
                            console.log('Botones 2 limpiados correctamente');
                        } catch (error) {
                            console.warn('Error al limpiar botones 2:', error);
                        }
                    }
                }, 500); // Aumentado de 100ms a 500ms
            }, 50);

        } catch (error) {
            console.error('Error en exportación 2:', error);
            swal("Error", "Ocurrió un error al exportar: " + error.message, "error");
        }
    });

    console.log('Eventos de exportación registrados correctamente');
}

async function CargarTodo(dt, periodo) {
    const sUrlIdioma = "/travel/spanish.json"
    tablaGrid = $("#" + dt).DataTable({
        layout: {
            topStart: null,
            bottom: null,
            bottomStart: null,
            bottomEnd: null
        },
        "data": [],
        "aoColumns": [
            {
                "mData": "anio"
            }, {
                "mData": "nombre"
            }, {
                "mData": "importe", "render": function (mData, disp, alldata) {
                    if (alldata.tipoReporte == 1) { return $.fn.dataTable.render.number(',', '.', 2, '').display(mData); }
                    else {
                        return mData;
                    }
                }
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        rowCallback: function (row, data) { },
        "ordering": false,
        "dom": "<'top'i>rt<'bottom'pl><'clear'>",
        "paging": false,
        "scrollY": '50vh',
        "bInfo": false,
        "bAutoWidth": true,
        "bPaginate": false,
        "bLengthChange": true,
        "processing": true,
        "scrollCollapse": true,
        "deferRender": true,
        "bDestroy": true,   
        select: {
            style: 'multi',
            selector: 'td:first-child',
            items: 'row'
        },
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
                .column(2)
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
                    api.column(2).footer()
                ];

                // Solo actualizar si todos los footers existen
                if (footerCells.every(cell => cell !== null && cell !== undefined)) {
                    $(footerCells[0]).html('Total:');
                    $(footerCells[1]).html('');                   
                    $(footerCells[2]).html(newCurrancy);
                }
            } catch (err) {
                console.warn('No se pudo actualizar el footer:', err);
            }
        }
    });
       
    const anioActual = new Date().getFullYear();

    let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value;    
    let BusquedaCancelacion = document.getElementById("mdvenselCancelacionSearch").value;
    let BusquedaTipoReporte = document.getElementById("mdvenselTipoReporteSearch").value;
    let BusquedaAnio = document.getElementById("mdvenselAnioSearch").value;
    let usuarioFiltro = 0;

    
    if (BusquedaCodPais === null || BusquedaCodPais === undefined || BusquedaCodPais === '') {
        BusquedaCodPais = menuPaisId;
    }   
  
    if (BusquedaCancelacion === "") {
        BusquedaCancelacion = "0";
    }
    if (BusquedaTipoReporte === "") {
        BusquedaTipoReporte = 1;
    }
    if (BusquedaAnio === "") {
        console.log('periodo', periodo);
        BusquedaAnio = anioActual - periodo;
    } else {
        BusquedaAnio = BusquedaAnio - periodo;
    }

    if (menuPerfilId == 6) {
        usuarioFiltro = menuUserId;
    }

    const listadoVentas = await getVentasAgencia(BusquedaCodPais, BusquedaCancelacion, BusquedaAnio, BusquedaTipoReporte, usuarioFiltro);

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

async function getVentasAgencia(int_pPaisId, int_pSituacionId, int_pAnio, int_TipoReporte, int_pUsuarioId) {
    const urlApiFecht = menuUrlApi + "Reportes/VentasAnualAgenciaObtener";
    const urlParametro = "?int_pPaisId=" + int_pPaisId + "&int_pSituacionId=" + int_pSituacionId + "&int_pAnio=" + int_pAnio + "&int_TipoReporte=" + int_TipoReporte + "&int_pUsuarioId=" + int_pUsuarioId;
    console.log(urlParametro);
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

    setTimeout(async () => {      
        $('#popupModalVentaSearch').modal('show');
    }, 50);
}
async function limpiarModalBuqueda() {

    document.getElementById("mdvenSelPaisSearch").value = "";   
    document.getElementById("mdvenselCancelacionSearch").value = "";
    document.getElementById("mdvenselTipoReporteSearch").value = "";

}
async function clickBuscarLimpiar() {
    setTimeout(async () => {      
        limpiarModalBuqueda();
    }, 50);
}


let elvalidarBuscar = $("#modalDatosVentaSearch").validate({
    rules: {
        mdvenSelPaisSearch: "required"
    },
    messages: {
        mdvenSelPaisSearch: "Seleccione un pais."
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
async function clickValidarBuscar() {
    if ($("#modalDatosVentaSearch").valid()) {
        cargarAcciones();
        $('#popupModalVentaSearch').modal('hide');
    }
}

async function cargarCombosBusqueda() {
    
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
        $('#divVenSelPaisSearch').hide();      
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
   

    const anioActual = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
        const anio = anioActual - i;
        $('#mdvenselAnioSearch').append($('<option/>').attr("value", anio).text(anio));
    }
}

