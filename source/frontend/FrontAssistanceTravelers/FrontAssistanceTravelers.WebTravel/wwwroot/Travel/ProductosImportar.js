// Importar Excel (Tarifas / Beneficios) en la pantalla de Productos.
// Depende de Productos.js: idEntidad, CargarTarifasTodo, CargarBeneficiosTodo.
let tipoImportarProducto = 'tarifas';

function idiomaBeneficioSeleccionado() {
    const v = $("#mdSelIdiomaBeneficio option:selected").val();
    return (v != undefined && v != '') ? parseInt(v) : 1;
}
function AbrirModalImportarProducto(tipo) {
    tipoImportarProducto = tipo;
    document.getElementById("modalDatosImportarProducto").reset();
    document.getElementById("tituloModalImportarProducto").innerHTML = tipo === 'tarifas' ? "Importar Tarifas desde Excel" : "Importar Beneficios desde Excel";
    limpiarModalImportarProducto();
    $('#mdBotImportarProducto').show();
    $('#mdBotImportarProductoCarga').hide();
    $('#popupModalImportarProducto').modal('show');
}
function limpiarModalImportarProducto() {
    document.getElementById("mdFileImportarProducto").value = "";
    $('#mdDescargarErrorImportarProducto').empty();
    $('#divResultadoImportarProducto').hide();
}
function clickDescargarPlantillaProducto() {
    const esTarifas = tipoImportarProducto === 'tarifas';
    const link = document.createElement('a');
    link.href = esTarifas
        ? '/descargarPlantillaProductoTarifas?productoId=' + idEntidad
        : '/descargarPlantillaProductoBeneficios?productoId=' + idEntidad + '&idiomaId=' + idiomaBeneficioSeleccionado();
    link.download = esTarifas ? 'Tarifas_Plantilla.xlsx' : 'Beneficios_Plantilla.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const toBase64Producto = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
function showLoader() {
    document.getElementById('mdBotImportarProductoCarga').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('mdBotImportarProductoCarga').style.display = 'none';
}

function recargarListadoProducto(esTarifas) {
    if (esTarifas) { CargarTarifasTodo(true); } else { CargarBeneficiosTodo(true); }
}
$('#mdBotImportarProducto').on('click', async function () {
    const archivos = document.getElementById('mdFileImportarProducto');
    if (archivos.files.length == 0) {
        mostrarMensaje(3, "Por favor seleccionar al menos un archivo para cargar.");
        return false;
    }
    const imobj = archivos.files[0];
    if (imobj.size > 50000000) {
        mostrarMensaje(3, "El archivo excede el máximo de 50MB, por favor seleccionar un archivo menor.");
        return false;
    }
    const esTarifas = tipoImportarProducto === 'tarifas';
    const dataUrl = await toBase64Producto(imobj);
    const base64archivo = dataUrl.substring(dataUrl.indexOf(',') + 1);
    showLoader();
    $('#mdBotImportarProducto').hide();
    $('#mdBotImportarProductoCarga').show();
    try {
        const info = { base64archivo: base64archivo, productoId: idEntidad, idiomaId: esTarifas ? 0 : idiomaBeneficioSeleccionado() };
        const response = await fetch(esTarifas ? '/importarExcelProductoTarifas' : '/importarExcelProductoBeneficios', {
            method: 'POST',
            headers: { 'Accept': 'application/octet-stream', 'Content-Type': 'application/json' },
            body: JSON.stringify(info)
        });
        if (response.ok) {
            const contentDisposition = response.headers.get('Content-Disposition') || '';
            const esOk = contentDisposition.indexOf('ok.xlsx') >= 0;
            if (esOk) {
                $('#popupModalImportarProducto').modal('hide');
                recargarListadoProducto(esTarifas);
                mostrarMensaje(1, esTarifas ? "Se actualizaron las tarifas correctamente." : "Se actualizaron los beneficios correctamente.");
            } else {
                const contenido = await response.text();
                const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
                $('#mdDescargarErrorImportarProducto').empty();
                const aDescarga = document.createElement("a");
                aDescarga.setAttribute("href", URL.createObjectURL(blob));
                aDescarga.setAttribute("target", "_blank");
                aDescarga.style.color = "red";
                aDescarga.innerHTML = "Existen errores en la importación, click aquí para ver los errores.";
                document.getElementById("mdDescargarErrorImportarProducto").appendChild(aDescarga);
                $('#divResultadoImportarProducto').show();
                // Pudo haber filas guardadas antes de un error de procesamiento
                recargarListadoProducto(esTarifas);
            }
        } else {
            mostrarMensaje(2, "Error al procesar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(2, "Error inesperado: " + error);
    } finally {
        hideLoader();
        $('#mdBotImportarProducto').show();
        $('#mdBotImportarProductoCarga').hide();
    }
});
