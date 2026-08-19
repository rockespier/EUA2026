
const urlGetEntidad = "mantenimiento/ProductoObtener";
const urlPostEntidad = "mantenimiento/ProductoProcesar";
const urlDeleteEntidad = "mantenimiento/ProductoAnular";
const urlCopiarEntidad = "mantenimiento/ProductoCopiar";
// Agregar constantes para el modal de copia
const nombreModalCopiar = "popupModalCopiarProducto";
const nombreFormularioCopiar = "frmCopiarProducto";

const menuIdioma = "1";
let idEntidad;
const nombreModal = "popupModalCliente";
const nombreFormulario = "modalCliente";
const nombreEntidad = "producto";

cargarAcciones();


async function cargarAcciones() {
    await CargarProductoCombos();
    await CargarProdIniciar();
    await CargarTodo();
    $('body').on('click', '#btnCopiarProducto', function (e) {
        e.preventDefault();
        abrirModalCopiarProducto();
    });
}

// Nueva función para abrir el modal de copia
async function abrirModalCopiarProducto() {
    // Limpiar el combo de países destino
    $('#mdSelPaisDestino').empty();
    $('#mdSelPaisDestino').append($('<option/>').attr("value", "").text('---Seleccione---'));

    // Cargar los países en el combo
    const elcomboTipo4 = await getPais(0, 1);
    let cantElementos04 = elcomboTipo4.length;
    if (cantElementos04 > 0) {
        console.log(elcomboTipo4, 'paises para copiar');
        for (const cboobj of elcomboTipo4) {
            const valorId = cboobj.paisId;
            const valorNombre = cboobj.paisNombre;
            $('#mdSelPaisDestino').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }

    // Resetear validación si existe
    if ($.validator) {
        $('#' + nombreFormularioCopiar).validate().resetForm();
    }

    // Mostrar el modal
    $('#' + nombreModalCopiar).modal('show');
}

// Nueva función para confirmar la copia
async function confirmarCopiaProducto() {
    const paisDestinoId = $("#mdSelPaisDestino option:selected").val();

    // Validar que se haya seleccionado un país
    if (!paisDestinoId || paisDestinoId === "") {
        mostrarMensaje(2, "Por favor, seleccione un país destino.");
        return false;
    }

    const resultado = await ProcesarCopia();
    if (resultado.codigo == 200) {
        $('#' + nombreModalCopiar).modal('hide');
        CargarTodo();
        mostrarMensaje(1, resultado.descripcion);
        return false;
    } else {
        mostrarMensaje(2, resultado.errorDescripcion);
        return false;
    }
}

// Modificar la función obtenerPayloadProducto
function obtenerPayloadProducto() {
    return {
        productoId: idEntidad,
        productoPaisId: $("#mdSelPaisDestino option:selected").val(),
        productoCreadoUsuarioId: menuUserId
    };
}

// La función copiarProducto ya no se usa directamente, pero la mantenemos por compatibilidad
async function copiarProducto() {
    if ($("#" + nombreFormularioCopiar).valid()) {
        const resultado = await ProcesarCopia();
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

let elvalidarCopiar = $("#" + nombreFormularioCopiar).validate({
    rules: {
        mdSelPaisDestino: {
            required: true
        }
    },
    messages: {
        mdSelPaisDestino: {
            required: "Por favor, seleccione un país destino."
        }
    },
    errorElement: "em",
    errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).addClass("is-valid").removeClass("is-invalid");
    }
});

const ProcesarCopia = async () => {
    var dataEnviar = obtenerPayloadProducto();
    console.log(dataEnviar);
    const resultado = await postCopiar(dataEnviar);
    return resultado;
}


async function postCopiar(enviarBody) {
    const urlApiFecht = menuUrlApi + urlCopiarEntidad;
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

async function CargarProdIniciar() {
    $('#dtProductos thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#dtProductos thead');
}

const ProcesarEntidad = async () => {
    /*const valorelcboMarca = 0;*/
    let valorelcboTipo = 0;

    const eltxtNombrecompleto = document.getElementById("mdtxtNombreProducto");
    const elchkEstado = document.getElementById("mdchkEstado");
    const eltxtEdadMinima = document.getElementById("mdtxtEdadMinima");
    const eltxtEdadMaxima = document.getElementById("mdtxtEdadMaxima");
    const eltxtAdicional = document.getElementById("mdtxtDescuento");
    const eltxtOrden = document.getElementById("mdtxtNroOrden");
    const eltxtATV = document.getElementById("mdtxtATV");
    const elchkWeb = document.getElementById("mdchkWeb");

    const elcboTipo = document.getElementById("mdselNrodias");
    valorelcboTipo = elcboTipo.value;
  
    const valorelcboMarca = await $("#mdSelPais option:selected").val();

    //const elcboMarca = document.getElementById("mdselMarca");
    //if (elcboMarca.selectedIndex > -1) {
    //    let valorelcboMarca = parseInt(elcboMarca.options[elcboMarca.selectedIndex].value);
    //} else {
    //    let valorelcboMarca = 0;
    //}

    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }

    let webCheck = -1;
    if (elchkWeb.checked == true) {
        webCheck = 1
    }

    let vPaisId = menuPaisId;
    const miPais = await $("#mdSelPais option:selected").val();
    console.log($("#mdSelPais option:selected").val(), 'combo');
    if (miPais != undefined && miPais != '') {
        vPaisId = miPais;
    }

    const dataEnviar = {
        productoId: idEntidad,
        productoReferenciaId: "",
        productoNombre: htmlEncode(eltxtNombrecompleto.value),
        productoServicio: "",
        productoURL: "",
        productoImporteTarifaFija: 0,
        productoImporteDiaAdicional: eltxtAdicional.value,
        productoEdadMinima: eltxtEdadMinima.value,
        productoEdadMaxima: eltxtEdadMaxima.value,
        productoNumeroDias: valorelcboTipo,
        productoCreadoUsuarioId: menuUserId,
        productoActivo: estadoCheck,
        productoOrdenListado: eltxtOrden.value,
        productoPaisId: vPaisId,
        productoActivoWeb: webCheck,
        productoGrupalActivo: 0,
        productoGrupalPorcentaje: 0,
        productoPromocionActivo: 0,
        productoImporteCero: 0,
        productoATVCodigo: eltxtATV.value,
        productoMarca: valorelcboMarca
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
async function CargarProductoCombos() {
    const elcomboTipo1 = await getValoresTipo('MarcaProducto', 1);
    let cantElementos01 = elcomboTipo1.length;
    if (cantElementos01 > 0) {
        $('#mdselMarca').append($('<option/>').attr("value", "").text('---Seleccione---'));
        for (const cboobj of elcomboTipo1) {
            const valorId = cboobj.valorId;
            const valorNombre = cboobj.valorNombre;
            $('#mdselMarca').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }

    const elcomboTipo2 = await getValoresTipo('TipoProducto', 1);
    let cantElementos02 = elcomboTipo2.length;
    if (cantElementos02 > 0) {
        $('#mdselNrodias').append($('<option/>').attr("value", "").text('---Seleccione---'));
        for (const cboobj of elcomboTipo2) {
            const valorId = cboobj.valorId;
            const valorNombre = cboobj.valorNombre;
            $('#mdselNrodias').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
    }

    const elcomboTipo3 = await getValoresTipo('beneficioIdioma', 1);
    let cantElementos03 = elcomboTipo3.length;
    if (cantElementos03 > 0) {
        $('#mdSelIdiomaBeneficio').append($('<option/>').attr("value", "").text('---Seleccione---'));
        console.log(elcomboTipo3,'datos');
        for (const cboobj of elcomboTipo3) {
            const valorId = cboobj.valorId;
            const valorNombre = cboobj.valorNombre;
            $('#mdSelIdiomaBeneficio').append($('<option/>').attr("value", valorId).text(valorNombre));
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
        console.log(menuPaisId,'pais');
        $("#mdSelPais").val(menuPaisId);
    }
}
async function innactivarProducto(Id) {
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
        const resultado = await deleteAnularProducto(Id);
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
async function deleteAnularProducto(id) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    const urlParametro = "?pProductoID=" + id;
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
async function BuscarLista() {
    CargarTodo();
}
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;

    tablaGridProducto = $("#dtProductos").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "productoNombre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.productoId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarProducto(" + alldata.productoId + ");'><i class='icon-trash'></i></a></li>"                    
                    if (alldata.productoActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData;
                }
            }, {
                "mData": "productoEdadMinima"
            }, {
                "mData": "productoEdadMaxima", "render": function (mData, disp, alldata) {
                    return mData;
                }
            }, {
                "mData": "productoNumeroDias"
            }, {
                "mData": "productoActivoWeb", "render": function (mData, disp, alldata) {
                    let resultado = "";
                    if (mData == 1) {
                        resultado = "<span class='badge rounded-pill badge-success'>SI</span>";
                    } else {
                        resultado = "<span class='badge rounded-pill badge-danger'>NO</span>";
                    }
                    return resultado;
                }
            }, {
                "mData": "productoActivo", "render": function (mData, disp, alldata) {
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
        scrollY: "400px",
        scrollCollapse: true,  
        ordering: true,
        processing: true,
        responsive: true,
        "autoWidth": false,
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        retrieve: true,
        orderCellsTop: true,
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
    $("#cargar").show();
    let vPaisId = 0;
    const miPais = await $("#mdSelPais option:selected").val();
    if (miPais != undefined) {
        vPaisId = miPais;
    }
    const elchkActivo = document.getElementById("mdchkActivos");
    let ActivoCheck = -1;
    if (elchkActivo.checked == true) {
        ActivoCheck = 1
    }
    const listadoUsuarios = await getProducto(0, ActivoCheck, parseInt(vPaisId));
    if (listadoUsuarios != undefined) {
        if (listadoUsuarios.length > 0) {
            tablaGridProducto.clear().draw();
            tablaGridProducto.rows.add(listadoUsuarios).draw();
        }
    } else {
        tablaGridProducto.clear().draw();
    }
    $("#cargar").hide();
}

$.validator.addMethod("rangoEdadMin", function (value, element) {
    const edad = parseInt(value, 10);
    return !isNaN(edad) && edad >= 0 && edad <= 99;
}, "Edad mínima debe estar entre 0 y 99.");

$.validator.addMethod("rangoEdadMax", function (value, element) {
    const edadMin = parseInt($("#mdtxtEdadMinima").val(), 10);
    const edadMax = parseInt(value, 10);
    return !isNaN(edadMax) && edadMax >= 0 && edadMax <= 99 && edadMax >= edadMin && (edadMax - edadMin) <= 99;
}, "Edad máxima debe estar entre 0 y 99, mayor o igual que la mínima y diferencia máxima de 99.");

$.validator.addMethod("validDescuento", function (value, element) {
    const edadMax = parseInt($("#mdtxtEdadMaxima").val(), 10);
    const descuento = parseInt(value, 10);

    if (isNaN(descuento)) return false;
    if (descuento < 0 || descuento > 100) return false; // fuera de rango permitido
    if (descuento === 0) return true; // permitido
    if (descuento > 0 && descuento <= 100) {
        return !isNaN(edadMax) && descuento > edadMax;
    }
    return false;
}, "Descuento debe ser 0, o si está entre 1 y 100 debe ser mayor que la edad máxima (sin exceder 100).");
function getDate(element) {
    let date;
    try {
        date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
        date = null;
    }
    return date;
}
let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        mdtxtNombreProducto: {
            required: true,
            minlength: 1,
            maxlength: 250,
        },
        mdtxtEdadMinima: {
            required: true,
            rangoEdadMin: true
        },
        mdtxtEdadMaxima: {
            required: true,
            rangoEdadMax: true
        },
        mdtxtDescuento: {
            required: true,
            validDescuento: true
        }
    },
    messages: {
        mdtxtNombreProducto: {
            required: "Por favor, ingresar nombre.",
            minlength: "Debe al menos con 1 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdtxtEdadMinima: {
            required: "Este campo es obligatorio."
        },
        mdtxtEdadMaxima: {
            required: "Este campo es obligatorio."
        },
        mdtxtDescuento: {
            required: "Este campo es obligatorio."
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
async function cargarTabs() {
    setTimeout(async () => {
        await CargarTarifasTodo();
        await CargarBeneficiosTodo();
    }, 300);
    
}
async function AbrirModal(id) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario);
    formModal.reset();
    elvalidar.resetForm();
    console.log(id, "idProducto");
    $("#mdtxtNombreCompleto").removeClass("is-valid");
    $("#mdtxtNombreCompleto").removeClass("is-invalid");

    if (id == 0) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = 0;
        cargarTabs();  
        $('#' + nombreModal).modal('show');
        return false;
    } else {
        const elEntidad = await getProducto(id, -1, 0);
        if (elEntidad.length > 0) {
            cargarTabs();  
            idEntidad = id;
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
//Inicio Tarifas
async function AbrirModalTarifa(id) {
    const eltitulo = document.getElementById("tituloModalTarifa");
    const formModal = document.getElementById("modalTarifa")
    formModal.reset();
    elvalidarTarifa.resetForm();

    $("#mdtextDiasMinimo").removeClass("is-valid");
    $("#mdtextDiasMinimo").removeClass("is-invalid");


    if (id == 0) {
        idTarifa = 0;
        eltitulo.innerHTML = "Nueva Tarifa";
        $('#popupModalProductoTarifa').modal('show');
    } else {
        const elVehiculo = await getTarifaProducto(idEntidad, id);
        if (elVehiculo.length > 0) {
            idTarifa = id;
            eltitulo.innerHTML = "Editar Tarifa";
            document.getElementById('mdtextDiasMinimo').value = elVehiculo[0].tarifaNumeroDiasMinimo
            document.getElementById('mdtextDiasMaximo').value = elVehiculo[0].tarifaNumeroDiasMaximo
            document.getElementById('mdtextImporte').value = elVehiculo[0].tarifaImporte
            document.getElementById('mdtextIncentivo').value = elVehiculo[0].tarifaIncentivo
            document.getElementById('mdtextPublicidad').value = elVehiculo[0].tarifaPublicidad

            $('#popupModalProductoTarifa').modal('show');
        }
    }
}
let elvalidarTarifaIncentivo = $("#frmTarifaIncentivo").validate({
    rules: {
        mdtextDiasMinimoIncentivo: {
            required: true,
            minlength: 1,
            maxlength: 250,
        }
    },
    messages: {
        mdtextDiasMinimoIncentivo: {
            required: "Por favor, ingresar días minimo.",
            minlength: "Debe al menos con 1 caracteres.",
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
//inicio Incentivos
async function AbrirModalTarifaIncentivo(id) {
    const eltitulo = document.getElementById("tituloModalTarifaIncentivo");
    const formModal = document.getElementById("frmTarifaIncentivo")
    formModal.reset();
    elvalidarTarifaIncentivo.resetForm();

    $("#mdtextDiasMinimoIncentivo").removeClass("is-valid");
    $("#mdtextDiasMinimoIncentivo").removeClass("is-invalid");       
    
    eltitulo.innerHTML = "Actualizar Masivamente Incentivo y Publicidad";
    $('#popupModalProductoTarifaIncentivo').modal('show');
        
}
async function clickValidarTarifaIncentivo() {
    if ($("#frmTarifaIncentivo").valid()) {
        const resultado = await ProcesarEntidadTarifaIncentivo();
        if (resultado.codigo == 200) {
            $('#popupModalProductoTarifaIncentivo').modal('hide');
            CargarTarifasTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
const ProcesarEntidadTarifaIncentivo = async () => {

    const eltxtDiasMinimo = document.getElementById("mdtextDiasMinimoIncentivo");
    const eltxtDiasMaximo = document.getElementById("mdtextDiasMaximoIncentivo");    
    const eltxtIncentivo = document.getElementById("mdtextIncentivoIncentivo");
    const eltxtPublicidad = document.getElementById("mdtextPublicidadIncentivo");

    const dataEnviar = {
        tarifaNumeroDiasMinimo: htmlEncode(eltxtDiasMinimo.value),
        tarifaNumeroDiasMaximo: htmlEncode(eltxtDiasMaximo.value),
        tarifaPublicidad: htmlEncode(eltxtPublicidad.value),
        tarifaId: 0,
        tarifaProductoId: 0,
        tarifaImporte: 0,
        tarifaCreadoUsuarioId: menuUserId,
        tarifaIncentivo: eltxtIncentivo.value
    };
    console.log(dataEnviar);
    const resultado = await postProcesarTarifaIncentivo(dataEnviar);
    return resultado;
}
async function postProcesarTarifaIncentivo(enviarBody) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoTarifaIncentivoProcesar";
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
//fin incentivos
async function innactivarTarifa(Id) {
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
        const resultado = await deleteAnularTarifa(Id);
        if (resultado.codigo == 200) {
            CargarTarifasTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function deleteAnularTarifa(id) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoTarifaAnular";
    const urlParametro = "?pTarifaID=" + id;
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
async function CargarTarifasTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
    let nomeprodotto = document.getElementById("mdtxtNombreProducto").value;

    // Destruir la tabla existente si ya existe
    if ($.fn.DataTable.isDataTable('#dtTarifas')) {
        $('#dtTarifas').DataTable().destroy();
    }

    tablaGrid = $("#dtTarifas").DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'excelHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        },
                        title: 'Tarifas de ' + nomeprodotto,
                        customize: function (xlsx) {
                            var sheet = xlsx.xl.worksheets['sheet1.xml'];

                            // Selector para agregar borde a todas las filas
                            sheet.querySelectorAll('row c').forEach((el) => {
                                el.setAttribute('s', '25');
                            });
                            // Agregar negrita a la fila 2 (índice 1 porque es base 0)
                            const fila1 = sheet.querySelector('row[r="1"]');
                            if (fila1) {
                                fila1.querySelectorAll('c').forEach((el) => {
                                    el.setAttribute('s', '2'); // 2 suele ser el estilo de negrita en Excel generado por DataTables                                    
                                });
                            }
                            // Agregar negrita a la fila 2 (índice 1 porque es base 0)
                            const fila2 = sheet.querySelector('row[r="2"]');
                            if (fila2) {
                                fila2.querySelectorAll('c').forEach((el) => {
                                    el.setAttribute('s', '2'); // 2 suele ser el estilo de negrita en Excel generado por DataTables                                    
                                });
                            }
                        }
                    }
                ]
            }
        },
        "data": [],
        "aoColumns": [
            {
                "mData": "tarifaNumeroDiasMinimo", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModalTarifa(" + alldata.tarifaId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarTarifa(" + alldata.tarifaId + ");'><i class='icon-trash'></i></a></li>"

                    return mData
                }
            }, {
                "mData": "tarifaNumeroDiasMaximo"
            }, {
                "mData": "tarifaImporte"
            }, {
                "mData": "tarifaIncentivo"
            }, {
                "mData": "tarifaPublicidad"
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
        ordering: false,
        processing: true,
        responsive: true,
        "autoWidth": false
    });

    const listadoVehiculos = await getTarifaProducto(idEntidad, 0);
    if (listadoVehiculos !== undefined) {
        if (listadoVehiculos.length > 0) {
            tablaGrid.clear().draw();
            tablaGrid.rows.add(listadoVehiculos).draw();
        }
    } else {
        const listadoVacio = [];
        tablaGrid.clear().draw();
        tablaGrid.rows.add(listadoVacio).draw();
    }

}
async function getTarifaProducto(idProducto, IdTarifa) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoTarifasObtener";
    const urlParametro = "?int_pProductoID=" + idProducto + "&int_pTarifaID=" + IdTarifa;
    console.log(urlApiFecht + urlParametro);
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
let elvalidarTarifa = $("#" + nombreFormulario).validate({
    rules: {
        mdtextDiasMinimo: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdtextDiasMinimo: {
            required: "Por favor, ingresar días minimo.",
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
async function clickValidarTarifa() {
    if ($("#modalTarifa").valid()) {
        const resultado = await ProcesarEntidadTarifa();
        if (resultado.codigo == 200) {
            $('#popupModalProductoTarifa').modal('hide');
            CargarTarifasTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
const ProcesarEntidadTarifa = async () => {

    const eltxtDiasMinimo = document.getElementById("mdtextDiasMinimo");
    const eltxtDiasMaximo = document.getElementById("mdtextDiasMaximo");
    const eltxtImporte = document.getElementById("mdtextImporte");
    const eltxtIncentivo = document.getElementById("mdtextIncentivo");
    const eltxtPublicidad = document.getElementById("mdtextPublicidad");
    
    const dataEnviar = {
        tarifaNumeroDiasMinimo: htmlEncode(eltxtDiasMinimo.value),
        tarifaNumeroDiasMaximo: htmlEncode(eltxtDiasMaximo.value),
        tarifaPublicidad: htmlEncode(eltxtPublicidad.value),
        tarifaId: idTarifa,
        tarifaProductoId: idEntidad,
        tarifaImporte: eltxtImporte.value,
        tarifaCreadoUsuarioId: menuUserId,
        tarifaIncentivo: eltxtIncentivo.value
    };
    console.log(dataEnviar);
    const resultado = await postProcesarTarifa(dataEnviar);
    return resultado;
}
async function postProcesarTarifa(enviarBody) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoTarifaProcesar";
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
//Fin Tarifas
//Inicio Beneficios
async function AbrirModalBeneficio(id) {
    const eltitulo = document.getElementById("tituloModalBeneficio");
    const formModal = document.getElementById("modalBeneficio")
    formModal.reset();
    elvalidarBeneficio.resetForm();

    $("#mdtextDescripcion").removeClass("is-valid");
    $("#mdtextDescripcion").removeClass("is-invalid");


    if (id == 0) {
        idBeneficio = 0;
        eltitulo.innerHTML = "Nuevo Beneficio";
        $('#popupModalProductoBeneficio').modal('show');
    } else {
        let vIdiomaId = 1;
        const miIdioma = await $("#mdSelIdiomaBeneficio option:selected").val();
        console.log($("#mdSelIdiomaBeneficio option:selected").val(), 'combo');
        if (miIdioma != undefined && miIdioma != '') {
            vIdiomaId = miIdioma;
        }
        const elVehiculo = await getBeneficioProducto(idEntidad, id, vIdiomaId);
        if (elVehiculo.length > 0) {
            idBeneficio = id;
            eltitulo.innerHTML = "Editar Beneficio";
            document.getElementById('mdtextDescripcion').value = elVehiculo[0].beneficioNombre
            document.getElementById('mdtextCobertura').value = elVehiculo[0].beneficioImporte
            document.getElementById('mdtextOrden').value = elVehiculo[0].beneficioOrden

            $('#popupModalProductoBeneficio').modal('show');
        }
    }
}
async function innactivarBeneficio(Id) {
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
        const resultado = await deleteAnularBeneficio(Id);
        if (resultado.codigo == 200) {
            CargarBeneficiosTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function deleteAnularBeneficio(id) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoBeneficioAnular";
    const urlParametro = "?pBeneficioID=" + id;
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
async function BuscarListaBeneficios(){
    CargarBeneficiosTodo()
}
async function CargarBeneficiosTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
    let nomeprodotto = document.getElementById("mdtxtNombreProducto").value;

    // Destruir la tabla existente si ya existe
    if ($.fn.DataTable.isDataTable('#dtBeneficios')) {
        $('#dtBeneficios').DataTable().destroy();
    }

    tablaGrid = $("#dtBeneficios").DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'excelHtml5',
                        exportOptions: {
                            columns: [0, 1]
                        },
                        title: 'Beneficios de ' + nomeprodotto,
                        customize: function (xlsx) {
                            var sheet = xlsx.xl.worksheets['sheet1.xml'];

                            // Selector para agregar borde a todas las filas
                            sheet.querySelectorAll('row c').forEach((el) => {
                                el.setAttribute('s', '25');
                            });
                            // Agregar negrita a la fila 2 (índice 1 porque es base 0)
                            const fila1 = sheet.querySelector('row[r="1"]');
                            if (fila1) {
                                fila1.querySelectorAll('c').forEach((el) => {
                                    el.setAttribute('s', '2'); // 2 suele ser el estilo de negrita en Excel generado por DataTables                                    
                                });
                            }
                            // Agregar negrita a la fila 2 (índice 1 porque es base 0)
                            const fila2 = sheet.querySelector('row[r="2"]');
                            if (fila2) {
                                fila2.querySelectorAll('c').forEach((el) => {
                                    el.setAttribute('s', '2'); // 2 suele ser el estilo de negrita en Excel generado por DataTables                                    
                                });
                            }
                        }
                    },
                    {
                        extend: 'pdfHtml5',
                        exportOptions: {
                            columns: [0, 1]
                        },
                        title: 'Beneficios de ' + nomeprodotto,
                        orientation: 'portrait',
                        pageSize: 'A4',
                        customize: function (doc) {
                            doc.styles.title = {
                                fontSize: 16,
                                bold: true,
                                alignment: 'center',
                                margin: [0, 0, 0, 10]
                            };
                            doc.styles.tableHeader = {
                                bold: true,
                                fontSize: 11,
                                fillColor: '#2d4154',
                                color: 'white',
                                alignment: 'center'
                            };
                            doc.content[1].table.widths = ['70%', '30%'];
                        }
                    }
                ]
            }
        },
        "data": [],
        "aoColumns": [
            {
                "mData": "beneficioNombre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModalBeneficio(" + alldata.beneficioId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarBeneficio(" + alldata.beneficioId + ");'><i class='icon-trash'></i></a></li>"

                    return mData
                }
            }, {
                "mData": "beneficioImporte"
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
        "autoWidth": false
    });
    let vIdiomaId = 1;
    const miIdioma = await $("#mdSelIdiomaBeneficio option:selected").val();
    console.log($("#mdSelIdiomaBeneficio option:selected").val(), 'combo');
    if (miIdioma != undefined && miIdioma != '') {
        vIdiomaId = miIdioma;
    }
    const listadoVehiculos = await getBeneficioProducto(idEntidad, 0, parseInt(vIdiomaId));
    if (listadoVehiculos !== undefined) {
        if (listadoVehiculos.length > 0) {
            tablaGrid.clear().draw();
            tablaGrid.rows.add(listadoVehiculos).draw();
        }
    } else {
        const listadoVacio = [];
        tablaGrid.clear().draw();
        tablaGrid.rows.add(listadoVacio).draw();
    }

}
async function getBeneficioProducto(idProducto, IdBeneficio, IdIdioma) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoBeneficiosObtener";
    const urlParametro = "?int_pProductoID=" + idProducto + "&int_pBeneficioID=" + IdBeneficio + "&int_pBeneficioIdioma=" + IdIdioma;
    console.log(urlApiFecht + urlParametro);
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
let elvalidarBeneficio = $("#modalBeneficio").validate({
    rules: {
        mdtextDescripcion: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdtextCobertura: {
            required: true,
            minlength: 3,
            maxlength: 250,
        }
    },
    messages: {
        mdtextDescripcion: {
            required: "Por favor, ingresar descripción.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdtextCobertura: {
            required: "Por favor, ingresar cobertura.",
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
async function clickValidarBeneficio() {
    if ($("#modalBeneficio").valid()) {
        const resultado = await ProcesarEntidadBeneficio();
        if (resultado.codigo == 200) {
            $('#popupModalProductoBeneficio').modal('hide');
            BuscarListaBeneficios();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
const ProcesarEntidadBeneficio = async () => {
    
    const eltxtDescripcion = document.getElementById("mdtextDescripcion");    
    const eltxtCobertura = document.getElementById("mdtextCobertura");
    const eltxtOrden = document.getElementById("mdtextOrden");
    let vIdiomaId = 1;
    const miIdioma = await $("#mdSelIdiomaBeneficio option:selected").val();
    console.log($("#mdSelIdiomaBeneficio option:selected").val(), 'combo');
    if (miIdioma != undefined && miIdioma != '') {
        vIdiomaId = miIdioma;
    }
    const dataEnviar = {
        beneficioNombre: htmlEncode(eltxtDescripcion.value),
        beneficioImporte: htmlEncode(eltxtCobertura.value),
        beneficioOrden: htmlEncode(eltxtOrden.value),
        beneficioId: idBeneficio,
        beneficioProductoId: idEntidad,
        beneficioCreadoUsuarioId: menuUserId,
        beneficioIdiomaId: vIdiomaId
    };
    console.log(dataEnviar);
    const resultado = await postProcesarBeneficios(dataEnviar);
    return resultado;
}
async function postProcesarBeneficios(enviarBody) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoBeneficioProcesar";
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
//Fin Beneficios