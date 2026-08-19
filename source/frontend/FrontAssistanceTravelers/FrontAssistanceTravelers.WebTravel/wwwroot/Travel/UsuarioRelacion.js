const urlGetEntidad = "mantenimiento/UsuarioRelacionObtener";
const urlPostEntidad = "mantenimiento/ProductoProcesar";
const urlDeleteEntidad = "mantenimiento/ProductoAnular";

CargarTodo();

let idEntidad;
const nombreModal = "popupModalUsuario";
const nombreFormulario = "modalUsuario";
const nombreEntidad = "relación usuario";

async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
    tablaGridProducto = $("#dtUsuarioRelacion").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "nombreUsuarioPadre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.usuarioRelacionPadreId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarUsuario(" + alldata.usuarioRelacionPadreId + ");'><i class='icon-trash'></i></a></li>"                    
                    return mData;
                }
            }, {
                "mData": "nombreUsuarioHijo"
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonEditar + "&nbsp;" + botonEliminar + "</ul>";
                }
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": true,
        rowCallback: function (row, data) { },
        filter: true,
        info: false,
        ordering: false,
        processing: true,
        responsive: true,
        "autoWidth": false,
        retrieve: true
    });
    const listadoUsuarios = await getUsuarioRelacion(0, 0, 0);
    if (listadoUsuarios.length > 0) {
        tablaGridProducto.clear().draw();
        tablaGridProducto.rows.add(listadoUsuarios).draw();
    }
}
function getDate(element) {
    let date;
    try {
        date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
        date = null;
    }
    return date;
}

async function getUsuarioRelacion(PaisId, PadreId, HijoId) {
    const urlApiFecht = menuUrlApi + "configuracion/UsuarioRelacionObtener";
    const urlParametro = "?int_pPaisId=" + PaisId + "&int_PadreID=" + PadreId + "&int_HijoID=" + HijoId;
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

async function AbrirModal(id) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario);
    formModal.reset();
    elvalidar.resetForm();

    $("#mdtxtNombreCompleto").removeClass("is-valid");
    $("#mdtxtNombreCompleto").removeClass("is-invalid");

    if (id == 0) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = 0;
        $('#' + nombreModal).modal('show');
        return false;
    } else {
        const elEntidad = await getProducto(id, -1, 0);
        if (elEntidad.length > 0) {
            idEntidad = id;
            cargarTabs();
            eltitulo.innerHTML = "Actualizar " + nombreEntidad;
            document.getElementById("mdtxtNombreProducto").value = elEntidad[0].productoNombre;
            document.getElementById("mdselMarca").value = elEntidad[0].productoMarca;
            document.getElementById("mdtxtEdadMinima").value = elEntidad[0].productoEdadMinima;
            document.getElementById("mdtxtEdadMaxima").value = elEntidad[0].productoEdadMaxima;
            document.getElementById("mdtxtDescuento").value = elEntidad[0].productoImporteDiaAdicional;
            document.getElementById("mdselNrodias").value = elEntidad[0].productoNumeroDias;
            document.getElementById("mdtxtNroOrden").value = elEntidad[0].productoOrdenListado;
            document.getElementById("mdtxtATV").value = elEntidad[0].productoATVCodigo;
            document.getElementById("mdSelIdiomaBeneficio").value = menuIdioma.toString();

            if (elEntidad[0].productoActivoWeb == 1) {
                document.getElementById("mdchkWeb").checked = true;
            } else {
                document.getElementById("mdchkWeb").checked = false;
            }

            if (elEntidad[0].productoActivo == 1) {
                document.getElementById("mdchkEstado").checked = true;
            } else {
                document.getElementById("mdchkEstado").checked = false;
            }

            $('#' + nombreModal).modal('show');
        }
    }
}
