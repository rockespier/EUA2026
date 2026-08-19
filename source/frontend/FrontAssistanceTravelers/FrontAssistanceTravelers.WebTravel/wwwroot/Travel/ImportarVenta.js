hideLoader();
CargarTodo(0);
let correlativoMasivo = "";
cargarCorrelativo();
//iniciarCampoUnaVez();
function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
/*function iniciarCampoUnaVez() {
    const th = document.getElementById("idExternoCampo");
    th.style.display = "none";
}*/
/*function iniciarCampo() {
    const internoRadio = document.getElementById("idExternoCampo");
    if (document.getElementById("radInterno").checked === true) {
        internoRadio.checked = true;
        internoRadio.dispatchEvent(new Event("change"));
    }
    if (document.getElementById("radExterno").checked === true) {
        internoRadio.checked = true;
        internoRadio.dispatchEvent(new Event("change"));
    }
}*/
function clickDescargarPlantilla() {
    let nombreArchivo = "";
    if (document.getElementById("radInterno").checked === true) {
        nombreArchivo = "VentasMasivas_Interna_Plantilla.xlsx";
    }
    if (document.getElementById("radExterno").checked === true) {
        nombreArchivo = "VentasMasivas_Externa_Plantilla.xlsx";
    }
    const link = document.createElement('a');
    link.href = '/archivos/Cargados/Importacion/' + nombreArchivo ;
    link.download = nombreArchivo; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
    //iniciarCampo();
}
async function cargarCorrelativo() {
    const resultadoCorrelativo = await generarCodigoCorrelativo('VentaMasivoId');
    correlativoMasivo = resultadoCorrelativo.errorCodigo;
}
async function activarImportacionCarga() {
    $('#mdBotImportar').hide();
    $('#mdBotImportarCarga').show();
}
async function inActivarImportacionCarga() {
    $('#mdBotImportar').show();
    $('#mdBotImportarCarga').hide();
    //iniciarCampo();
}
function changeActive(radio) {
    const btnGroup = radio.closest('.btn-group');
    const buttons = btnGroup.querySelectorAll('.btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    const currentBtn = radio.closest('.btn');
    currentBtn.classList.add('active');
    CargarTodo(0);
    /*const th = document.getElementById("idExternoCampo");
    if (radio.id === "radExterno") {
        th.style.display = "";
        CargarTodo(0);
    } else {
        th.style.display = "none";
        CargarTodo(0);
    }*/
}

async function AbrirModaImportar() {
    const eltitulo = document.getElementById("tituloModalVentaSearch");
    const formModal = document.getElementById("modalDatosVentaSearch")
    formModal.reset();
    eltitulo.innerHTML = "Importar Ventas";
    inActivarImportacionCarga();
  
    $('#divResultado').hide();
    $('#popupModalVentaSearch').modal('show');
}
async function clickImportarLimpiar() {
    limpiarModaImportar();
}
async function limpiarModaImportar() {
    document.getElementById("mdFileImportar").value = "";
    $('#mdDescargarError').empty();
    const internoRadio = document.getElementById("radInterno");
    internoRadio.checked = true;
    internoRadio.dispatchEvent(new Event("change"));
}
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
$('#mdBotImportar').on('click', async function (e) {
    const Archivos = document.getElementById('mdFileImportar');
    const CantidadArchivos = Archivos.files.length;
    if (CantidadArchivos == 0) {
        mostrarMensaje(3, "Por favor seleccionar al menos un archivo para cargar.");
        return false;
    }
    let eltipofile = "";
    const imobj = Archivos.files[0];
    const elnombre = imobj.name;
    const eltipo = imobj.type;
    const eltamano = imobj.size;
    if (eltamano > 500000000) {
        mostrarMensaje(3, "El archivo excede el máximo  de 500MB, por favor seleccionar un archivo menor.");
        return false;
    }
    const infoQuitaDatoBase64 = "data:" + eltipo + ";base64,";
    const base64archivo = await toBase64(imobj);
    const base64archivoFinal = base64archivo.replace(infoQuitaDatoBase64, "")
    let tipoProcesar = "";
    if (document.getElementById("radInterno").checked === true) {
        tipoProcesar = "1";
    }
    if (document.getElementById("radExterno").checked === true) {
        tipoProcesar = "2";
    }
    showLoader();
    activarImportacionCarga();
    try {
        const info = {
            base64archivo: base64archivoFinal,
            tipoProcesar: tipoProcesar,
            correlativo: correlativoMasivo.toString(),
         };
        let response = await fetch('/importarExcelVentas', {
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
                CargarTodo(correlativoMasivo);
                cargarCorrelativo();
                $('#divResultado').hide();
                $('#popupModalVentaSearch').modal('hide');
            } else {
                const originalBlob = await response.blob();
                const contenido = await originalBlob.text();
                const blob = new Blob(
                    [new TextEncoder().encode(contenido)],
                    { type: "text/plain;charset=utf-8" }
                );
                $('#mdDescargarError').empty();
                const eldjuntodescargar = document.getElementById("mdDescargarError");
                const aDescarga = document.createElement("a");
                const rutaUrl = URL.createObjectURL(blob);
                aDescarga.setAttribute("href", rutaUrl);
                aDescarga.setAttribute("target", "_blank");
                aDescarga.style.color = "red";
                aDescarga.innerHTML = `Existe errors en la importación click aqui para ver los errores.`
                eldjuntodescargar.appendChild(aDescarga)
                $('#divResultado').show();
            }
        } else {
            mostrarMensaje(1, "Error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {
       hideLoader();
       inActivarImportacionCarga();
    }
});


async function CargarTodo(id) {
    const sUrlIdioma = "/travel/spanish.json"
    let botonVisualizar;
    tablaGrid = $("#dtVenta").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "ventaUsuarioAgenciaNombre"
            },{
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
                "mData": "ventaProductoImporte"
            }, {
                "mData": "ventaClienteApellidoNombre", "render": function (mData, disp, alldata) {
                    const resultado = alldata.ventaClienteApellidos + ", " + alldata.ventaClienteNombres;
                    return "<span title='" + resultado + "'>" + resultado + "</span>";
                }
            }, {
                "mData": "ventaClienteFechaNacimiento", "render": function (mData, disp, alldata) {
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
                "mData": "ventaCodigoExterno"
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": false,
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
        orderCellsTop: true,
        fixedHeader: true,
    });
   
    const listadoVentas = await getVentaMasivaPro(id);
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
async function getVentaMasivaPro(pId) {
    const urlApiFecht = menuUrlApi + "Venta/VentasMasivasObtenerProcesar";
    const urlParametro = "?pVentaMasivaId=" + pId;
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
