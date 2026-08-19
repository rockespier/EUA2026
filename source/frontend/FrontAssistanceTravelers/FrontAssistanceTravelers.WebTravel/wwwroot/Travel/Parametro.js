const urlGetEntidad = "mantenimiento/ValorObtener";
const urlPostEntidad = "mantenimiento/ValorProcesar";
const urlDeleteEntidad = "mantenimiento/ValorAnular";

const urlGetEntidadPrincipal = "mantenimiento/TipoObtener";

let idEntidad;
const nombreModal = "ModalParametro";
const nombreFormulario = "frmParametro";
const nombreEntidad = "parametro";

const nombreModal2 = "ModalParametroDetalle";
const nombreFormulario2 = "frmParametroDetalle";

CargarTodo();
//cargarCombos();

let elvalidar = $("#" + nombreFormulario2).validate({
    rules: {
        mdtxtNombreCompleto: {
            required: true,
            minlength: 2,
            maxlength: 250,
        },       
        mdtxtCodigo: {
            required: true,
            minlength: 1,
            maxlength: 3,
        }
    },
    messages: {
        mdtxtNombreCompleto: {
            required: "Por favor, ingresar nombre.",
            minlength: "Debe al menos contar con 2 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdtxtCodigo: {
            required: "Por favor, ingresar codigo.",
            minlength: "Debe al menos contar con 1 caracter.",
            maxlength: "No debe pasar de los 3 caracteres.",
        }
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

//poblar el listado principal
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;

    let campoNombre = "valorNombre";
    //let campoEstado = "modeloActivo";

    tablaGrid = $("#dtParametros").DataTable({
        "data": [],             
        "aoColumns": [
            {
                "mData": "valorCampoTabla", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick=AbrirModal('" + alldata.valorCampoTabla + "');><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = ""
                    if (alldata.valorActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData
                }
            }, {
                "mData": "valorNombre", "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return mData;
                }
            }, {
                "mData": "valorUsuarioNombre", "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return mData;
                }
            }, {
                "mData": "valorFechaRegsitro", "render": function (mData, disp, alldata) {
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
                "mData": "valorActivo", "render": function (mData, disp, alldata) {
                    let resultado = "";
                    if (mData == 1) {
                        resultado = "<span class='badge rounded-pill badge-success'>Activo</span>";
                    } else {
                        resultado = "<span class='badge rounded-pill badge-danger'>Inactivo</span>";
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
    const listado = await getEntidad(0, -1);
    if (listado.length > 0) {
        tablaGrid.clear().draw();
        tablaGrid.rows.add(listado).draw();
    }
}
async function getEntidad(id, estado) {
    const urlApiFecht = menuUrlApi + urlGetEntidadPrincipal;
    const urlParametro = "";
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


//abrir Popup
async function AbrirModal(id) {
        document.getElementById('mdtxtNombreCampo').value = id;
        CargarTodo2(id);
        $('#' + nombreModal).modal('show');
    
}

//abrir Popup2
async function AbrirModal2(id) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario2);
    formModal.reset();
    elvalidar.resetForm();

    $("#mdtxtNombreCompleto").removeClass("is-valid");
    $("#mdtxtNombreCompleto").removeClass("is-invalid");
    $("#mdtxtCodigo").removeClass("is-valid");
    $("#mdtxtCodigo").removeClass("is-invalid");

    let nombreCampo = document.getElementById('mdtxtNombreCampo').value;
    console.log(nombreCampo);

    if (nombreCampo == 'VEHICULODISTRIBUIDOR') {
        Aux1.innerHTML = "Correo";
        Aux2.innerHTML = "Código SAP";
        Aux3.innerHTML = "Tipo de Atención";
    }

    if (id == 0) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = "0";
        $('#' + nombreModal2).modal('show');
        return false;
    } else {
        const elEntidad = await getEntidad2(nombreCampo,id);
        if (elEntidad.length > 0) {
            idEntidad = id;

            eltitulo.innerHTML = "Actualizar " + nombreEntidad;
            document.getElementById("mdtxtNombreCompleto").value = elEntidad[0].valorNombre;
            document.getElementById("mdtxtCodigo").value = elEntidad[0].valorId;
            document.getElementById('mdtxtNombreCampo').value = elEntidad[0].valorCampoTabla;
            document.getElementById('mdtxtValorAuxiliar').value = elEntidad[0].valorAux;
            document.getElementById('mdtxtValorAuxiliar2').value = elEntidad[0].valorAux2;
            document.getElementById('mdtxtValorAuxiliar3').value = elEntidad[0].valorAux3;

            if (elEntidad[0].valorActivo == 1) {
                document.getElementById("mdchkEstado").checked = true;
            } else {
                document.getElementById("mdchkEstado").checked = false;
            }

            $('#' + nombreModal2).modal('show');
        }
    }
}

//poblar el listado secundario
async function CargarTodo2(valorCampoTabla) {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
      
    tablaGrid = $("#dtParametroDetalle").DataTable({
        "data": [],
        "autoWidth": false,
        "columnDefs": [
            { "width": "10px", "targets": 0 }
        ],
        "aoColumns": [
            {
                "mData": "valorId", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick=AbrirModal2('" + alldata.valorId + "','" + alldata.valorCampoTabla +"');><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick=innactivarEntidad('" + alldata.valorId + "','" + alldata.valorCampoTabla +"');><i class='icon-trash'></i></a></li>"
                    if (alldata.valorActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData
                }
            }, {
                "mData": "valorNombre", "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return mData;
                }
            }, {
                "mData": "valorActivo", "render": function (mData, disp, alldata) {
                    let resultado = "";
                    if (mData == 1) {
                        resultado = "<span class='badge rounded-pill badge-success'>Activo</span>";
                    } else {
                        resultado = "<span class='badge rounded-pill badge-danger'>Inactivo</span>";
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
    const listado = await getEntidad2(valorCampoTabla, 0);
    if (listado.length > 0) {
        tablaGrid.clear().draw();
        tablaGrid.rows.add(listado).draw();
    }
}
async function getEntidad2(nombreCampo, valorId) {
    const urlApiFecht = menuUrlApi + urlGetEntidad;
    const urlParametro = "?pValorNombreCampo=" + nombreCampo + "&pValorActivo=-1&pValorId=" + valorId;
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

async function clickValidar() {
    if ($("#" + nombreFormulario2).valid()) {
        const resultado = await ProcesarEntidad();
        const nombreCampo = document.getElementById("mdtxtNombreCampo");
        if (resultado.codigo == 200) {
            $('#' + nombreModal2).modal('hide');            
            CargarTodo2(nombreCampo.value);
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}

const ProcesarEntidad = async () => {
    const eltxtCodigo = document.getElementById("mdtxtCodigo");
    const eltxtNombrecompleto = document.getElementById("mdtxtNombreCompleto");
    const elchkEstado = document.getElementById("mdchkEstado");
    const nombreCampo = document.getElementById("mdtxtNombreCampo");
    const valorAux = document.getElementById("mdtxtValorAuxiliar");
    const valorAux2 = document.getElementById("mdtxtValorAuxiliar2");
    const valorAux3 = document.getElementById("mdtxtValorAuxiliar3");

    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }

    const dataEnviar = {
        "valorId": eltxtCodigo.value,
        "valorNombre": eltxtNombrecompleto.value,
        "valorCampoTabla": nombreCampo.value,
        "valorAux": valorAux.value,
        "valorAux2": valorAux2.value,
        "valorAux3": valorAux3.value,
        "valorUsuarioId": menuUserId
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

async function innactivarEntidad(Id,CampoValor) {
    const alerta = await swal({
        title: "¿Está seguro de inactivar?",
        text: "Si hace click en confirmar, el registro no se podrá recuperar.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await deleteAnular(Id, CampoValor);
        if (resultado.codigo == 200) {
            CargarTodo2(CampoValor);
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}

async function deleteAnular(id, CampoValor) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    
    const urlParametro = "?pValorID=" + id + "&pValorCampo=" + CampoValor;
    console.log(urlParametro);
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

