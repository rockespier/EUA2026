// Reporte Personalizado de Ventas: el usuario elige cualquier combinacion de campos
// de BEVenta (la misma entidad que devuelve Venta/VentasObtener) para armar su propio
// listado, y lo exporta a Excel/PDF igual que el resto de los reportes.
const LS_COLUMNAS_REPORTE_PERSONALIZADO = "lsReportePersonalizadoVentasColumnas";

const COLUMNAS_VENTA = [
    {
        grupo: "General", campos: [
            { campo: "ventaId", etiqueta: "ID Venta", tipo: "numero" },
            { campo: "ventaCodigoExterno", etiqueta: "Código Externo", tipo: "texto" },
            { campo: "ventaEstadoNombre", etiqueta: "Estado", tipo: "texto" },
            { campo: "ventaSituacionNombre", etiqueta: "Situación", tipo: "texto" },
            { campo: "ventaCounter", etiqueta: "Counter", tipo: "texto" },
            { campo: "ventaCupon", etiqueta: "Cupón", tipo: "texto" },
            { campo: "ventaObservacion", etiqueta: "Observación", tipo: "texto" }
        ]
    },
    {
        grupo: "Fechas", campos: [
            { campo: "ventaCreadoFecha", etiqueta: "Fecha de Creación", tipo: "fecha" },
            { campo: "ventaModificadoFecha", etiqueta: "Fecha de Modificación", tipo: "fecha" },
            { campo: "ventaAnuladoFecha", etiqueta: "Fecha de Anulación", tipo: "fecha" },
            { campo: "ventaFechaVigenciaInicio", etiqueta: "Vigencia Inicio", tipo: "fecha" },
            { campo: "ventaFechaVigenciaFin", etiqueta: "Vigencia Fin", tipo: "fecha" },
            { campo: "ventaCobranzaPagoFecha", etiqueta: "Fecha de Pago Cobranza", tipo: "fecha" },
            { campo: "ventaIncentivoFechaPago", etiqueta: "Fecha Pago Incentivo", tipo: "fecha" },
            { campo: "ventaIncentivoPostFechaPago", etiqueta: "Fecha Pago Post-Incentivo", tipo: "fecha" },
            { campo: "ventaIncentivoModificadoFecha", etiqueta: "Fecha Modificación Incentivo", tipo: "fecha" },
            { campo: "ventaPagoFecha", etiqueta: "Fecha de Pago", tipo: "texto" }
        ]
    },
    {
        grupo: "Cliente", campos: [
            { campo: "ventaClienteApellidoNombre", etiqueta: "Cliente (Apellidos y Nombres)", tipo: "texto" },
            { campo: "ventaClienteNombres", etiqueta: "Nombres", tipo: "texto" },
            { campo: "ventaClienteApellidos", etiqueta: "Apellidos", tipo: "texto" },
            { campo: "ventaClienteDocumentoTipoNombre", etiqueta: "Tipo de Documento", tipo: "texto" },
            { campo: "ventaClienteDocumentoNumero", etiqueta: "Nº de Documento", tipo: "texto" },
            { campo: "ventaClienteFechaNacimiento", etiqueta: "Fecha de Nacimiento", tipo: "fecha" },
            { campo: "ventaClienteEdad", etiqueta: "Edad", tipo: "numero" },
            { campo: "ventaClienteEmail", etiqueta: "Email", tipo: "texto" },
            { campo: "ventaClienteTelefono", etiqueta: "Teléfono", tipo: "texto" },
            { campo: "ventaClienteDireccion", etiqueta: "Dirección", tipo: "texto" },
            { campo: "ventaClienteDistrito", etiqueta: "Distrito", tipo: "texto" },
            { campo: "ventaClienteCiudad", etiqueta: "Ciudad", tipo: "texto" },
            { campo: "ventaClientePais", etiqueta: "País", tipo: "texto" },
            { campo: "ventaNacionalidad", etiqueta: "Nacionalidad", tipo: "texto" }
        ]
    },
    {
        grupo: "Contacto", campos: [
            { campo: "ventaContactoNombres", etiqueta: "Nombres Contacto", tipo: "texto" },
            { campo: "ventaContactoDireccion", etiqueta: "Dirección Contacto", tipo: "texto" },
            { campo: "ventaContactoTelefono", etiqueta: "Teléfono Contacto", tipo: "texto" },
            { campo: "ventaContactoEmail", etiqueta: "Email Contacto", tipo: "texto" },
            { campo: "ventaContactoDistrito", etiqueta: "Distrito Contacto", tipo: "texto" },
            { campo: "ventaContactoPais", etiqueta: "País Contacto", tipo: "texto" }
        ]
    },
    {
        grupo: "Agencia y Promotor", campos: [
            { campo: "ventaAgenciaNombre", etiqueta: "Agencia", tipo: "texto" },
            { campo: "ventaUsuarioAgenciaNombre", etiqueta: "Usuario Agencia", tipo: "texto" },
            { campo: "ventaAgenciaDireccion", etiqueta: "Dirección Agencia", tipo: "texto" },
            { campo: "ventaAgenciaCorreo", etiqueta: "Correo Agencia", tipo: "texto" },
            { campo: "ventaAgenciaRUC", etiqueta: "RUC Agencia", tipo: "texto" },
            { campo: "ventaAgenciaIdExterno", etiqueta: "ID Externo Agencia", tipo: "texto" },
            { campo: "ventaAgenciaVip", etiqueta: "Agencia VIP", tipo: "numero" },
            { campo: "ventaPromotorNombre", etiqueta: "Promotor", tipo: "texto" },
            { campo: "ventaPaisNombre", etiqueta: "País de Venta", tipo: "texto" },
            { campo: "ventaUsuarioOrigen", etiqueta: "Usuario Origen", tipo: "texto" },
            { campo: "ventaCreadoUsuarioNombre", etiqueta: "Creado Por", tipo: "texto" },
            { campo: "ventaModificadoUsuarioNombre", etiqueta: "Modificado Por", tipo: "texto" },
            { campo: "ventaAnuladoUsuarioNombre", etiqueta: "Anulado Por", tipo: "texto" }
        ]
    },
    {
        grupo: "Producto y Viaje", campos: [
            { campo: "ventaProductoNombre", etiqueta: "Producto", tipo: "texto" },
            { campo: "productoATVCodigo", etiqueta: "Código ATV Producto", tipo: "texto" },
            { campo: "ventaProductoEdadMinima", etiqueta: "Edad Mínima Producto", tipo: "numero" },
            { campo: "ventaProductoEdadMaxima", etiqueta: "Edad Máxima Producto", tipo: "numero" },
            { campo: "ventaNumeroDias", etiqueta: "Número de Días", tipo: "numero" },
            { campo: "ventaOrigen", etiqueta: "Origen", tipo: "texto" },
            { campo: "ventaDestino", etiqueta: "Destino", tipo: "texto" },
            { campo: "ventaDesOrigen", etiqueta: "Descripción Origen", tipo: "texto" },
            { campo: "ventaInicio", etiqueta: "Inicio", tipo: "texto" },
            { campo: "ventaFin", etiqueta: "Fin", tipo: "texto" },
            { campo: "ventaPromocionNombre", etiqueta: "Promoción", tipo: "texto" }
        ]
    },
    {
        grupo: "Importes", campos: [
            { campo: "ventaImporteVenta", etiqueta: "Importe Venta", tipo: "moneda" },
            { campo: "ventaProductoImporte", etiqueta: "Importe Producto", tipo: "moneda" },
            { campo: "ventaDescuento", etiqueta: "Descuento (%)", tipo: "numero" },
            { campo: "ventaDescuentoImporte", etiqueta: "Importe Descuento", tipo: "moneda" },
            { campo: "ventaPaisImpuesto", etiqueta: "Impuesto País (%)", tipo: "numero" },
            { campo: "ventaPaisImpuestoVenta", etiqueta: "Impuesto País Venta", tipo: "moneda" },
            { campo: "ventaComisionImporte", etiqueta: "Importe Comisión", tipo: "moneda" },
            { campo: "ventaAgenciaComision", etiqueta: "Comisión Agencia", tipo: "moneda" },
            { campo: "ventaIncentivoImporte", etiqueta: "Importe Incentivo", tipo: "moneda" },
            { campo: "ventaIncentivo", etiqueta: "Incentivo", tipo: "moneda" },
            { campo: "ventaIncentivoTarifa", etiqueta: "Tarifa Incentivo", tipo: "moneda" },
            { campo: "ventaIncentivoPostImporte", etiqueta: "Importe Post-Incentivo", tipo: "moneda" },
            { campo: "ventaPublicidadImporte", etiqueta: "Importe Publicidad", tipo: "moneda" },
            { campo: "ventaPublicidadTarifa", etiqueta: "Tarifa Publicidad", tipo: "moneda" },
            { campo: "ventaCobranzaComision", etiqueta: "Comisión Cobranza", tipo: "moneda" },
            { campo: "ventaCobranzaIncentivo", etiqueta: "Incentivo Cobranza", tipo: "moneda" },
            { campo: "ventaCobranzaImportePago", etiqueta: "Importe Pago Cobranza", tipo: "moneda" },
            { campo: "cobranzaDocumento", etiqueta: "Documento Cobranza", tipo: "texto" },
            { campo: "ventaPagoDocumento", etiqueta: "Documento de Pago", tipo: "texto" }
        ]
    },
    {
        grupo: "Liquidación", campos: [
            { campo: "ventaCodigoLiquidacion", etiqueta: "Código Liquidación", tipo: "numero" },
            { campo: "ventaFormulaLiquidacionNombre", etiqueta: "Fórmula Liquidación", tipo: "texto" },
            { campo: "ventaPagarLiquidacion", etiqueta: "A Pagar Liquidación", tipo: "moneda" },
            { campo: "ventaIncentivoPost", etiqueta: "Post-Incentivo", tipo: "numero" },
            { campo: "ventaPrecioEditadoManual", etiqueta: "Precio Editado Manualmente", tipo: "texto" }
        ]
    },
    {
        grupo: "Identificadores (avanzado)", campos: [
            { campo: "ventaProductoId", etiqueta: "ID Producto", tipo: "numero" },
            { campo: "ventaGrupalId", etiqueta: "ID Grupal", tipo: "numero" },
            { campo: "ventaClienteId", etiqueta: "ID Cliente", tipo: "numero" },
            { campo: "ventaUsuarioAgenciaId", etiqueta: "ID Usuario Agencia", tipo: "numero" },
            { campo: "ventaPromocionId", etiqueta: "ID Promoción", tipo: "numero" }
        ]
    }
];

const CAMPOS_POR_DEFECTO = [
    "ventaId", "ventaCreadoFecha", "ventaEstadoNombre", "ventaSituacionNombre",
    "ventaProductoNombre", "ventaClienteApellidoNombre", "ventaAgenciaNombre",
    "ventaPromotorNombre", "ventaImporteVenta"
];

let ventasData = [];
let tablaGrid = null;

cargarCombosBusqueda();
IniciarFechasBsuqueda();
construirPanelColumnas();

function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}

function obtenerColumnasSeleccionadas() {
    const guardadas = localStorage.getItem(LS_COLUMNAS_REPORTE_PERSONALIZADO);
    if (guardadas) {
        try {
            const parseadas = JSON.parse(guardadas);
            if (Array.isArray(parseadas) && parseadas.length > 0) {
                return parseadas;
            }
        } catch (e) {
            console.warn('No se pudo leer la selección de columnas guardada:', e);
        }
    }
    return CAMPOS_POR_DEFECTO.slice();
}

function buscarMetaColumna(campo) {
    for (const grupo of COLUMNAS_VENTA) {
        const encontrado = grupo.campos.find(c => c.campo === campo);
        if (encontrado) return encontrado;
    }
    return null;
}

function construirPanelColumnas() {
    const panel = document.getElementById('panelColumnasVenta');
    const seleccionadas = obtenerColumnasSeleccionadas();
    panel.innerHTML = '';
    for (const grupo of COLUMNAS_VENTA) {
        const titulo = document.createElement('h6');
        titulo.textContent = grupo.grupo;
        panel.appendChild(titulo);
        for (const col of grupo.campos) {
            const div = document.createElement('div');
            div.className = 'form-check form-check-inline';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'form-check-input chkColumnaVenta';
            input.id = 'chkCol_' + col.campo;
            input.value = col.campo;
            input.checked = seleccionadas.includes(col.campo);
            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.setAttribute('for', input.id);
            label.textContent = col.etiqueta;
            div.appendChild(input);
            div.appendChild(label);
            panel.appendChild(div);
        }
    }
}

$(document).on('change', '#chkColumnasTodas', function () {
    const marcar = $(this).is(':checked');
    $('.chkColumnaVenta').prop('checked', marcar);
});

async function AbrirModalColumnas() {
    construirPanelColumnas();
    $('#popupModalColumnas').modal('show');
}

function clickAplicarColumnas() {
    const seleccionadas = [];
    for (const grupo of COLUMNAS_VENTA) {
        for (const col of grupo.campos) {
            if ($('#chkCol_' + col.campo).is(':checked')) {
                seleccionadas.push(col.campo);
            }
        }
    }
    if (seleccionadas.length === 0) {
        swal("Aviso", "Debe seleccionar al menos una columna", "warning");
        return;
    }
    localStorage.setItem(LS_COLUMNAS_REPORTE_PERSONALIZADO, JSON.stringify(seleccionadas));
    $('#popupModalColumnas').modal('hide');
    renderTabla();
}

function formatearFechaVisualizar(mData) {
    if (!mData || mData === "0001-01-01T00:00:00" || mData === "1970-01-01T00:00:00") {
        return "";
    }
    const fechaMoment = moment(mData, moment.ISO_8601);
    if (!fechaMoment.isValid() || fechaMoment.year() <= 1901) {
        return "";
    }
    return fechaMoment.format("DD/MM/YYYY");
}

function formatearMoneda(mData) {
    if (mData === null || mData === undefined || mData === "" || isNaN(mData)) {
        return "";
    }
    return parseFloat(mData).toFixed(2);
}

function renderTabla() {
    const seleccionadas = obtenerColumnasSeleccionadas();
    const columnas = seleccionadas.map(campo => {
        const meta = buscarMetaColumna(campo) || { campo: campo, etiqueta: campo, tipo: 'texto' };
        const columna = { data: meta.campo, title: meta.etiqueta, defaultContent: '' };
        if (meta.tipo === 'fecha') {
            columna.render = function (mData) { return formatearFechaVisualizar(mData); };
        } else if (meta.tipo === 'moneda') {
            columna.className = 'text-end';
            columna.render = function (mData) { return formatearMoneda(mData); };
        }
        return columna;
    });

    if (tablaGrid) {
        tablaGrid.destroy();
        $('#dtVenta').empty();
    }

    const sUrlIdioma = "/travel/spanish.json";
    tablaGrid = $('#dtVenta').DataTable({
        data: ventasData,
        columns: columnas,
        language: { url: sUrlIdioma },
        deferRender: true,
        scrollX: true,
        order: []
    });
}

async function AbrirModalBusqueda() {
    $('#popupModalVentaSearch').modal('show');
}

function clickBuscarLimpiar() {
    IniciarFechasBsuqueda();
    document.getElementById("mdvenSelPaisSearch").value = "";
    document.getElementById("mdvenSelEstadoSearch").value = "";
    document.getElementById("mdvenSelSituacionSearch").value = "";
    document.getElementById("txtAgencia").value = "";
    localStorage.removeItem("lsReportePersonalizadoAgenciaSel");
}

async function clickBuscarVentas() {
    $('#popupModalVentaSearch').modal('hide');
    await buscarVentas();
}

function IniciarFechasBsuqueda() {
    const hoy = moment();
    const haceUnMes = moment().subtract(30, 'days');
    document.getElementById("mdvenFecIncioVigSearch").value = haceUnMes.format("YYYY-MM-DD");
    document.getElementById("mdvenFecFinalVigSearch").value = hoy.format("YYYY-MM-DD");
}

async function cargarCombosBusqueda() {
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const elcomboEstado = await getValoresTipo('ventaEstadoId', 1);
    if (elcomboEstado !== undefined) {
        $('#mdvenSelEstadoSearch').append($('<option/>').attr("value", "").text('---Todos---'));
        for (const cboobj of elcomboEstado) {
            $('#mdvenSelEstadoSearch').append($('<option/>').attr("value", cboobj.valorId).text(cboobj.valorNombre));
        }
    }

    const elcomboSituacion = await getValoresTipo('ventaSituacionId', 1);
    if (elcomboSituacion !== undefined) {
        $('#mdvenSelSituacionSearch').append($('<option/>').attr("value", "").text('---Todos---'));
        for (const cboobj of elcomboSituacion) {
            $('#mdvenSelSituacionSearch').append($('<option/>').attr("value", cboobj.valorId).text(cboobj.valorNombre));
        }
    }

    const elcomboPais = await getPais(0, 1);
    if (elcomboPais !== undefined) {
        $('#mdvenSelPaisSearch').append($('<option/>').attr("value", "").text('---Todos---'));
        for (const cboobj of elcomboPais) {
            $('#mdvenSelPaisSearch').append($('<option/>').attr("value", cboobj.paisId).text(cboobj.paisNombre));
        }
        if (menuPaisId) {
            $('#mdvenSelPaisSearch').val(menuPaisId);
        }
    }

    if (AgenciaId === 0) {
        const elcomboAgencia = await getAgencia(0, 1, menuPaisId, menuUserId, '', '');
        if (elcomboAgencia !== undefined && elcomboAgencia.length > 0) {
            var dataSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: elcomboAgencia
            });
            $('#txtAgencia').typeahead(
                { hint: true, highlight: true, minLength: 1 },
                { name: 'agenciaId', display: 'agenciaNombre', source: dataSource }
            );
            $('#txtAgencia').on('typeahead:select', function (e, selection) {
                $('#txtAgencia').val(selection.agenciaId);
                localStorage.setItem("lsReportePersonalizadoAgenciaSel", selection.agenciaId);
            });
        }
    } else {
        $('#divVenSelAgenciaSearch').hide();
    }
}

async function buscarVentas() {
    showLoader();
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;
    const dtfechaVigINI = formatearFechaString(moment(BusquedaFechaIni, "YYYY-MM-DD").toDate());
    const dtfechaVigFIN = formatearFechaString(moment(BusquedaFechaFin, "YYYY-MM-DD").toDate());

    let BusquedaCodPais = document.getElementById("mdvenSelPaisSearch").value || 0;
    const BusquedaCodEstado = document.getElementById("mdvenSelEstadoSearch").value;
    const BusquedaCodSituacion = document.getElementById("mdvenSelSituacionSearch").value;

    let BusquedaCodAgencia = localStorage.getItem("lsReportePersonalizadoAgenciaSel");
    if (AgenciaId !== 0) {
        BusquedaCodAgencia = AgenciaId;
    }
    if (BusquedaCodAgencia === null || BusquedaCodAgencia === undefined || BusquedaCodAgencia === '') {
        BusquedaCodAgencia = 0;
    }

    let BusquedaCodPromotor = 0;
    if (menuPerfilId === "6") {
        BusquedaCodPromotor = menuUserId;
    }

    const listado = await getVentasPersonalizado(menuelOrigen, dtfechaVigINI, dtfechaVigFIN, menuUserId, BusquedaCodEstado,
        BusquedaCodSituacion, BusquedaCodAgencia, BusquedaCodPais, BusquedaCodPromotor);

    ventasData = listado !== undefined ? listado : [];
    if (ventasData.length === 0) {
        swal("Aviso", "No se encontraron ventas para los filtros seleccionados", "warning");
    }
    renderTabla();
    hideLoader();
}

async function getVentasPersonalizado(pOrigen, pfechaIni, pfechaFin, pUsuarioId, pEstado, pSituacion, pAgencia, pPais, pPromotor) {
    const urlApiFecht = menuUrlApi + "Venta/VentasObtener";
    const urlParametro = "?pOrigen=" + pOrigen + "&pVentaIngresoInicio=" + pfechaIni + "&pVentaIngresoFin=" + pfechaFin
        + "&pUsuarioId=" + pUsuarioId + "&pEstadoId=" + pEstado + "&pSituacionId=" + pSituacion + "&pAgenciaId=" + pAgencia
        + "&pPaisId=" + pPais + "&pPromotorId=" + pPromotor;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    });
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        console.log(responseError);
        return [];
    } else if (response.status === 200) {
        return await response.json();
    }
    return [];
}

function exportarReportePersonalizado(tipo) {
    if (!tablaGrid || ventasData.length === 0) {
        swal("Aviso", "No hay datos para exportar", "warning");
        return;
    }
    const extend = tipo === 'pdf' ? 'pdfHtml5' : 'excelHtml5';
    const filename = 'Reporte_Personalizado_Ventas_' + moment().format('YYYYMMDD_HHmmss');
    const buttonConfig = {
        extend: extend,
        title: filename,
        filename: filename,
        exportOptions: {
            columns: ':visible',
            modifier: { page: 'all', search: 'applied' }
        }
    };
    if (extend === 'pdfHtml5') {
        buttonConfig.orientation = 'landscape';
        buttonConfig.pageSize = 'A4';
    }
    const buttons = new $.fn.dataTable.Buttons(tablaGrid, { buttons: [buttonConfig] });
    const container = buttons.container().appendTo('body');
    setTimeout(function () {
        const selectorBoton = extend === 'pdfHtml5' ? '.buttons-pdf' : '.buttons-excel';
        const boton = container.find(selectorBoton);
        if (boton.length > 0) {
            boton[0].click();
        }
        setTimeout(function () {
            try {
                buttons.destroy();
                container.remove();
            } catch (error) {
                console.warn('Error al limpiar botones de exportación:', error);
            }
        }, 500);
    }, 50);
}

$('#btnExport').on('click', function (e) {
    e.preventDefault();
    exportarReportePersonalizado('excel');
});
$('#btnExportPdf').on('click', function (e) {
    e.preventDefault();
    exportarReportePersonalizado('pdf');
});

renderTabla();
