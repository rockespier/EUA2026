const urlGetEntidad = "mantenimiento/SolicitudTipoObtener";
const urlPostEntidad = "mantenimiento/SolicitudTipoProcesar";
const urlDeleteEntidad = "mantenimiento/SolicitudTipoAnular";

cargarAcciones();

async function cargarAcciones() {
    await CargarTodo();
    await CargarCombos();
}

let idEntidad;
const nombreModal = "popupSolicitudTipo";
const nombreFormulario = "frmSolicitudTipo";
const nombreEntidad = "tipo de solicitud";
async function clickValidar() {
    if ($("#" + nombreFormulario).valid()) {
        const resultado = await ProcesarEntidad();
        if (resultado.codigo == 200) {
            $('#' + nombreModal).modal('hide');
            CargarTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}

async function CargarCombos() {
    const elcomboTipo1 = await getValoresTipo('solicitudtipoAccionId', 1);
    let cantElementos01 = elcomboTipo1.length;
    if (cantElementos01 > 0) {
        $('#mdselAccion').append($('<option/>').attr("value", "").text('---Seleccione---'));
        for (const cboobj of elcomboTipo1) {
            const valorId = cboobj.valorId;
            const valorNombre = cboobj.valorNombre;
            $('#mdselAccion').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }       
}

let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        mdtxtNombreCompleto: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdselAccion: {
            required: true,            
        },
    },
    messages: {
        mdtxtNombreCompleto: {
            required: "Por favor, ingresar descripción.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdselAccion: {
            required: "Por favor, seleccione acción.",          
        },
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


const ProcesarEntidad = async () => {

    const eltxtDescripcion = document.getElementById("mdtxtNombreCompleto");
    const elchkEstado = document.getElementById("mdchkEstado");    
    const elchkCorreo = document.getElementById("mdchkCorreo");

    const valorelcboAccion = await $("#mdselAccion option:selected").val();
        
    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }

    let webCheck = -1;
    if (elchkCorreo.checked == true) {
        webCheck = 1
    }

   

    const dataEnviar = {
        solicitudtipoAccionId: valorelcboAccion,
        solicitudtipoId: idEntidad,        
        solicitudtipoAccionNombre: htmlEncode(eltxtDescripcion.value),        
        solicitudtipoCreadoUsuarioId: menuUserId,
        solicitudtipoActivo: estadoCheck,        
        solicitudtipoEnviarCorreo: webCheck
    };
    console.log(dataEnviar);
    const resultado = await postProcesar(dataEnviar);
    return resultado;
}

async function postProcesar(enviarBody) {
    const urlApiFecht = menuUrlApi + urlPostEntidad;
    console.log(urlApiFecht);
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
async function AbrirModal(id) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario);
    formModal.reset();
    elvalidar.resetForm();

    $("#mdtxtNombreCompleto").removeClass("is-valid");
    $("#mdtxtNombreCompleto").removeClass("is-invalid");

    $("#mdselAccion").removeClass("is-valid");
    $("#mdselAccion").removeClass("is-invalid");

    if (id == 0) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = 0;
        $('#' + nombreModal).modal('show');
        return false;
    } else {
        const elEntidad = await getSolicitudTipo(id, -1, 0);
        if (elEntidad.length > 0) {
            idEntidad = id;           
            eltitulo.innerHTML = "Actualizar " + nombreEntidad;
            document.getElementById("mdtxtNombreCompleto").value = elEntidad[0].solicitudtipoNombre;
            document.getElementById("mdselAccion").value = elEntidad[0].solicitudtipoAccionId;
            
            if (elEntidad[0].solicitudtipoEnviarCorreo == 1) {
                document.getElementById("mdchkCorreo").checked = true;
            } else {
                document.getElementById("mdchkCorreo").checked = false;
            }

            if (elEntidad[0].solicitudtipoActivo == 1) {
                document.getElementById("mdchkEstado").checked = true;
            } else {
                document.getElementById("mdchkEstado").checked = false;
            }

            $('#' + nombreModal).modal('show');
        }
    }
}
async function innactivarSolicitudTipo(Id) {
    const alerta = await swal({
        title: "¿Está seguro de inactivar?",
        text: "Si hace click en confirmar, el registro se ocultara en otras pantallas del sistema.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await deleteAnularSolicitudTipo(Id);
        if (resultado.codigo == 200) {
            CargarTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}

async function deleteAnularSolicitudTipo(id) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    const urlParametro = "?int_pSolicitudTipoID=" + id;
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

async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
    tablaGridProducto = $("#dtTipoSolicitud").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "solicitudtipoId"
            }, {
                "mData": "solicitudtipoAccionNombre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.solicitudtipoId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarSolicitudTipo(" + alldata.solicitudtipoId + ");'><i class='icon-trash'></i></a></li>"
                    if (alldata.solicitudtipoActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData;
                }
            }, {
                "mData": "solicitudtipoNombre"
            }, {
                "mData": "solicitudtipoEnviarCorreo", "render": function (mData, disp, alldata) {
                    let resultado = "";
                    if (mData == 1) {
                        resultado = "<span class='badge rounded-pill badge-success'>SI</span>";
                    } else {                        
                        resultado = "<span class='badge rounded-pill badge-danger'>NO</span>";                        
                    }
                    return resultado;
                }
            }, {
                "mData": "solicitudtipoActivo", "render": function (mData, disp, alldata) {
                    let resultado = "";
                    if (mData == 1) {
                        resultado = "<span class='badge rounded-pill badge-success'>Activo</span>";
                    } else {
                        if (mData == -1) {
                            resultado = "<span class='badge rounded-pill badge-warning'>Bloqueado</span>";
                        } else {
                            resultado = "<span class='badge rounded-pill badge-danger'>Inactivo</span>";
                        }
                    }
                    return resultado;
                }
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
    const listadoUsuarios = await getSolicitudTipo(0, -1,0);
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

async function getSolicitudTipo(id, estado, perfilId) {
    const urlApiFecht = menuUrlApi + "mantenimiento/SolicitudTipoObtener";
    const urlParametro = "?int_pSolicitudTipoID=" + id + "&int_pSolicitudTipoActivo=" + estado + "&int_pSolicitudPerfilId=" + perfilId;
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
