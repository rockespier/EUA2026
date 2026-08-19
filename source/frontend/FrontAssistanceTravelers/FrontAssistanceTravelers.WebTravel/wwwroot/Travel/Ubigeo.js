const urlGetEntidad = "mantenimiento/UbigeoObtener";
const urlPostEntidad = "mantenimiento/UbigeoProcesar";
const urlDeleteEntidad = "mantenimiento/UbigeoAnular";

cargarAcciones();

async function cargarAcciones() {
    await CargarTodo();
    await CargarCombos();
}

let idEntidad;
const nombreModal = "popupModalUbigeo";
const nombreFormulario = "frmUbigeo";
const nombreEntidad = "ubigeo";

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
    const elcomboTipo1 = await getValoresTipo('departamento', 1);
    let cantElementos01 = elcomboTipo1.length;
    if (cantElementos01 > 0) {
        $('#mdselDepartamento').append($('<option/>').attr("value", "").text('---Seleccione---'));
        for (const cboobj of elcomboTipo1) {
            const valorId = cboobj.valorId;
            const valorNombre = cboobj.valorNombre;
            $('#mdselDepartamento').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }

    const elcomboTipo2 = await getValoresTipo('provincia', 1);
    let cantElementos02 = elcomboTipo2.length;
    if (cantElementos02 > 0) {
        $('#mdselPovincia').append($('<option/>').attr("value", "").text('---Seleccione---'));
        for (const cboobj of elcomboTipo2) {
            const valorId = cboobj.valorId;
            const valorNombre = cboobj.valorNombre;
            $('#mdselPovincia').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }
    const elcomboTipo4 = await getPais(0, 1);
    let cantElementos04 = elcomboTipo4.length;
    if (cantElementos04 > 0) {
        $('#mdSelPais').append($('<option/>').attr("value", "").text('---Seleccione---'));
        console.log(elcomboTipo4, 'paises');
        for (const cboobj of elcomboTipo4) {
            const valorId = cboobj.paisId;
            const valorNombre = cboobj.paisNombre;
            $('#mdSelPais').append($('<option/>').attr("value", valorId).text(valorNombre));
        }       
    }
}

let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        mdtxtDistrito: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdSelPais: {
            required: true,
        },
        mdselDepartamento: {
            required: true,
        },
        mdselPovincia: {
            required: true,
        },
    },
    messages: {
        mdtxtDistrito: {
            required: "Por favor, ingresar distrito.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdSelPais: {
            required: "Por favor, seleccione país.",
        },
        mdselDepartamento: {
            required: "Por favor, seleccione departamento.",
        },
        mdselPovincia: {
            required: "Por favor, seleccione provincia.",
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

    const eltxtDescripcion = document.getElementById("mdtxtDistrito");
    const elchkEstado = document.getElementById("mdchkEstado");
    
    const valorelcboPais = await $("#mdSelPais option:selected").val();
    const valorelcboDpto = await $("#mdselDepartamento option:selected").val();
    const valorelcboProv = await $("#mdselPovincia option:selected").val();

    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }
       
    const dataEnviar = {
        ubigeoId: idEntidad.toString(),
        ubigeoPaisId: parseInt(valorelcboPais),        
        ubigeoDepartamentoId: parseInt(valorelcboDpto),        
        ubigeoProvinciaId: parseInt(valorelcboProv),        
        ubigeoNombre: htmlEncode(eltxtDescripcion.value),       
        ubigeoActivo: estadoCheck
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

    $("#mdSelPais").removeClass("is-valid");
    $("#mdSelPais").removeClass("is-invalid");

    $("#mdselDepartamento").removeClass("is-valid");
    $("#mdselDepartamento").removeClass("is-invalid");

    $("#mdselPovincia").removeClass("is-valid");
    $("#mdselPovincia").removeClass("is-invalid");

    $("#mdtxtDistrito").removeClass("is-valid");
    $("#mdtxtDistrito").removeClass("is-invalid");

    if (id == 0) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = 0;
        $('#' + nombreModal).modal('show');
        return false;
    } else {
        const elEntidad = await getUbigeo(id, -1);
        if (elEntidad.length > 0) {
            idEntidad = id;
            eltitulo.innerHTML = "Actualizar " + nombreEntidad;
            document.getElementById("mdSelPais").value = elEntidad[0].ubigeoPaisId;
            document.getElementById("mdselDepartamento").value = elEntidad[0].ubigeoDepartamentoId;
            document.getElementById("mdselPovincia").value = elEntidad[0].ubigeoProvinciaId;
            document.getElementById("mdtxtDistrito").value = elEntidad[0].ubigeoNombre;
                        
            if (elEntidad[0].ubigeoActivo == 1) {
                document.getElementById("mdchkEstado").checked = true;
            } else {
                document.getElementById("mdchkEstado").checked = false;
            }

            $('#' + nombreModal).modal('show');
        }
    }
}
async function innactivarUbigeo(Id) {
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
        const resultado = await deleteAnularUbigeo(Id);
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

async function deleteAnularUbigeo(id) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    const urlParametro = "?int_pUbigeoID=" + id;
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
    tablaGridProducto = $("#dtUbigeos").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "ubigeoNombre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.ubigeoId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarUbigeo(" + alldata.ubigeoId + ");'><i class='icon-trash'></i></a></li>"
                    if (alldata.usuarioActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData;
                }
            }, {
                "mData": "ubigeoProvinciaNombre"
            }, {
                "mData": "ubigeoDepartamentoNombre", "render": function (mData, disp, alldata) {
                    return mData;
                }
            }, {
                "mData": "ubigeoPaisNombre", "render": function (mData, disp, alldata) {
                    return mData;
                }
            }, {
                "mData": "ubigeoActivo", "render": function (mData, disp, alldata) {
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
        bInfo: false,
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
                    if (colIdx != 11) {
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
    const listadoUsuarios = await getUbigeo(0, -1);
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

async function getUbigeo(id, estado) {
    const urlApiFecht = menuUrlApi + "mantenimiento/UbigeoObtener";
    const urlParametro = "?int_pUbigeoId=" + id + "&int_pUbigeoActivo=" + estado + "&int_pUbigeoPaisId=0";
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