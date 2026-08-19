IniciarFechasBsuqueda();
cargarCombosBusqueda();
CargarTodo();
hideLoader();

function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}


async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"

    tablaGrid = $("#dtVenta").DataTable({
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" }
        ],
        "order": [["23", "asc"]],
        "data": [],
        "aoColumns": [
            {
                "mData": "ventaUsuarioAgenciaNombre"
            }, {
                "mData": "ventaId"
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
                "mData": "ventaClienteTelefono"
            }, {
                "mData": "ventaClienteEmail"
            }, {
                "mData": "ventaProductoImporte"
            }, {
                "mData": "ventaCreadoUsuarioNombre"
            }, {
                "mData": "ventaClienteDocumentoNumero"
            }, {
                "mData": "ventaPaisNombre"
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

    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const BusquedaNumTarjeta = document.getElementById("mdvenNumTarjetaSearch").value;
    const BusquedaCodExterno = document.getElementById("mdvenCodExternoSearch").value;
    const BusquedaDesNombres = document.getElementById("mdvenTxtNombresSearch").value;
    const BusquedaDesApellidos = document.getElementById("mdvenTxtApellidosSearch").value;
    //const BusquedaCodEstado = document.getElementById("mdvenSelEstadoSearch").value;
    //const BusquedaCodSituacion = document.getElementById("mdvenSelSituacionSearch").value;
    const BusquedaCodSituacion = '';

    let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value;
    let BusquedaCodAgencia = localStorage.getItem("lscotizacionesSel");
    let BusquedaCodAgenciaUsuario = document.getElementById("mdvenSelUsuarioSearch").value;

    if (BusquedaCodPais === "") {
        BusquedaCodPais = 0;
    }
    if (BusquedaCodAgencia === "" || BusquedaCodAgencia === null) {
        BusquedaCodAgencia = 0;
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
    const listadoVentas = await getVentas(menuelOrigen, CodigoBusqueda, dtfechaVigINI, dtfechaVigFIN, AgenciaId, BusquedaDesNombres, BusquedaDesApellidos, 'W', BusquedaCodSituacion, BusquedaCodExterno, BusquedaCodPais, BusquedaCodAgencia, BusquedaCodAgenciaUsuario,"","");
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
async function getVentas(pOrigen, pIdVenta, pfechaIni, pfechaFin, pIdusuario, pNombres, pApellidos, pEstado, pSituacion, pCodExt, pPais, pAgencia, pUsuarioAgencia, pTipoDoc, pNumeDoc) {
    const urlApiFecht = menuUrlApi + "Venta/VentasObtener";
    const urlParametro = "?pOrigen=A&pVentaIngresoInicio=" + pfechaIni + "&pVentaIngresoFin=" + pfechaFin + "&pVentaID=" + pIdVenta + "&pUsuarioId=" + pIdusuario + "&pEstadoId=" + pEstado + "&pSituacionId=" + pSituacion + "&pAgenciaId=" + pAgencia + "&pAgenciaUsuarioId=" + pUsuarioAgencia + "&pClienteNombres=" + pNombres + "&pClienteApellidos=" + pApellidos + "&pPaisId=" + pPais + "&pCodigoExterno=" + pCodExt + "&pTipoDoc=" + pTipoDoc + "&pNumeDoc=" + pNumeDoc + "&pTipoDoc=" + pTipoDoc + "&pNumeDoc=" + pNumeDoc;
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
        localStorage.removeItem('lscotizacionesSel');
        $('#popupModalVentaSearch').modal('show');
    }, 50);
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

async function cargarCombosBusqueda() { 
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
                    localStorage.setItem("lscotizacionesSel", selection.agenciaId); // Guarda el ID
                });
            }
        }
    }
}
$('#mdvenSelPaisSearch').change(async function () {
    const strIdPais = $(this).val();
    // 1. Destruir el typeahead existente
    $('#txtAgencia').typeahead('destroy');
    $('#txtAgencia').val(''); // Limpiar el input
    const elcomboAgencia = await getAgencia(0, 1, strIdPais, 0,'','');
    if (elcomboAgencia !== undefined) {
        let cantElementos05 = elcomboAgencia.length;
        if (cantElementos05 > 0) {
            $('#mdvenSelAgenciaSearch').empty();
            $('#mdvenSelAgenciaSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboAgencia) {
                const valorId = cboobj.agenciaId;
                const valorNombre = cboobj.agenciaNombre;
                $('#mdvenSelAgenciaSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
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