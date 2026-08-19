const urlGetEntidad = "configuracion/PaisObtener";
const urlPostEntidad = "configuracion/PaisProcesar";
const urlDeleteEntidad = "configuracion/PaisAnular";

CargarTodo();
let idEntidad;
const nombreModal = "popupModalPais";
const nombreFormulario = "frmModalPais";
const nombreEntidad = "pais";

let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        mdtxtNombreCompleto: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdtxtNombreCompleto: {
            required: "Por favor, ingresar nombre.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
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
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
    tablaGridProducto = $("#dtPaises").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "paisId", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.paisId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarEntidad(" + alldata.paisId + ");'><i class='icon-trash'></i></a></li>"
                    if (alldata.paisActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData;
                }
            }, {
                "mData": "paisNombre"
            }, {
                "mData": "paisCorreo", "render": function (mData, disp, alldata) {
                    return mData;
                }
            }, {
                "mData": "paisPromotorNombre"
            }, {
                "mData": "paisImpuestoVenta"
            }, {
                "mData": "paisActivo", "render": function (mData, disp, alldata) {
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
    const listadoUsuarios = await getPais(0, -1);
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

async function getPais(id, estado) {
    const urlApiFecht = menuUrlApi + "configuracion/PaisObtener";
    const urlParametro = "?int_pPaisID=" + id + "&int_PaisActivo=" + estado;
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
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario);
    formModal.reset();
    elvalidar.resetForm();

    $("#mdtxtNombreCompleto").removeClass("is-valid");
    $("#mdtxtNombreCompleto").removeClass("is-invalid");

    CargarPaisCombos(menuUserId, id);

    if (id == 0) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = 0;
        $('#' + nombreModal).modal('show');
        return false;
    } else {
        const elEntidad = await getPais(id, -1);
        if (elEntidad.length > 0) {
            idEntidad = id;                       
            eltitulo.innerHTML = "Actualizar " + nombreEntidad;
            document.getElementById("mdtxtNombreCompleto").value = elEntidad[0].paisNombre;
            document.getElementById("mdtxtCorreo").value = elEntidad[0].paisCorreo;            
            //if (elEntidad[0].paisTotalPago == 1) {
            //    document.getElementById("mdchkTotalPago").checked = true;
            //} else {
            //    document.getElementById("mdchkTotalPago").checked = false;
            //}
            document.getElementById("mdselPromotor").value = elEntidad[0].paisPromotorDefault; 
            document.getElementById("mdtxtImpuestoPais").value = elEntidad[0].ventaPaisImpuesto; 
            document.getElementById("mdtxtImpuestoVenta").value = elEntidad[0].ventaPaisImpuestoVenta; 
            document.getElementById("mdselFormatoVoucher").value = elEntidad[0].paisDocumentoFormato; 
            document.getElementById("mdtxtComentarios").value = elEntidad[0].paisDatosEua; 

            if (elEntidad[0].paisActivo == 1) {
                document.getElementById("mdchkEstado").checked = true;
            } else {
                document.getElementById("mdchkEstado").checked = false;
            }

            $('#' + nombreModal).modal('show');
        }
    }
}

async function CargarPaisCombos(UsuarioId, PaisId) {
    const elcomboTipo = await getPromotoresPais(UsuarioId, PaisId);
    if (elcomboTipo != undefined) {
        let cantElementos01 = elcomboTipo.length;
        if (cantElementos01 > 0) {
            $('#mdselPromotor').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdselPromotor').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

    const elcomboTipo2 = await getValoresTipo('PAISDOCUMENTOFORMATO', 1);
    let cantElementos02 = elcomboTipo2.length;
    if (cantElementos02 > 0) {
        $('#mdselFormatoVoucher').append($('<option/>').attr("value", "").text('---Seleccione---'));
        for (const cboobj of elcomboTipo2) {
            const valorId = cboobj.valorId;
            const valorNombre = cboobj.valorNombre;
            $('#mdselFormatoVoucher').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }

}

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

const ProcesarEntidad = async () => {
    const valorelcboPromotor = 0;
    const eltxtNombrecompleto = document.getElementById("mdtxtNombreCompleto");
    const elchkEstado = document.getElementById("mdchkEstado");
    const eltxtCorreo = document.getElementById("mdtxtCorreo");
    const elchkTotalPago = 0; //document.getElementById("mdchkTotalPago");
    const elcboPromotor = document.getElementById("mdselPromotor");
    if (elcboPromotor.selectedIndex > -1) {
        let valorelcboPromotor = parseInt(elcboPromotor.options[elcboPromotor.selectedIndex].value);
    } else {
        let valorelcboPromotor = 0;

    }    

    const eltxtImpuestoPais = document.getElementById("mdtxtImpuestoPais");
    const eltxtImpuestoVenta = document.getElementById("mdtxtImpuestoVenta");
    const elcboFormato = document.getElementById("mdselFormatoVoucher");
    const valorelcboFormato = parseInt(elcboFormato.options[elcboFormato.selectedIndex].value);
    const eltxtDatosEUA = document.getElementById("mdtxtComentarios");

    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }

    let pagoCheck = -1;
    if (elchkTotalPago.checked == true) {
        pagoCheck = 1
    }

    const dataEnviar = {
        paisId: idEntidad,
        paisCodigo: '',
        paisNombre: htmlEncode(eltxtNombrecompleto.value),        
        paisImpuesto: eltxtImpuestoPais.value,
        paisImpuestoVenta: eltxtImpuestoVenta.value,
        paisCreadoUsuarioId: parseInt(menuUserId),                                    
        paisActivo: estadoCheck,       
        paisCorreo: htmlEncode(eltxtCorreo.value),
        paisTotalPago: pagoCheck,
        paisDatosEua: eltxtDatosEUA.value,
        paisFoto: '',
        paisPromocionId: '0',        
        paisCuponDescuento: 0,
        paisCuponVigenciaId: 0,
        paisDocumentoFormato: 0,
        paisPromotorDefault: valorelcboPromotor
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
async function innactivarEntidad(Id) {
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
        const resultado = await deleteAnular(Id);
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

async function deleteAnular(id) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    const urlParametro = "?pPaisId=" + id;
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