
const urlGetEntidad = "mantenimiento/PromocionPaisObtener";
const urlPostEntidad = "mantenimiento/PromocionPaisProcesar";
const urlDeleteEntidad = "mantenimiento/PromocionPaisAnular";

ReseteoLocalStorage();
cargarAcciones();


function ReseteoLocalStorage() {    
    localStorage.removeItem('lspaispromocionSel');
}

async function cargarAcciones() {
    $("#cargar").show();
    await CargarCombos();
    setTimeout(async () => {          
        await CargarTodo();
    }, 300);
}

let idEntidad;
const nombreModal = "popupModalUsuario";
const nombreFormulario = "modalUsuario";
const nombreEntidad = "promocion";
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
    const eltxtDescuento = document.getElementById("mdtxtDescuento");
    const eltxtDiasMin = document.getElementById("mdtxtDiasmin");
    const eltxtDiasMax = document.getElementById("mdtxtDiasmax");
    const valorelcboProducto = await $("#mdselProducto option:selected").val();
    const valorelcboPasajero = await $("#mdselPasajero option:selected").val();
    
    let agenciaId = localStorage.getItem("lspaispromocionSel");
    if (agenciaId === null) {
        agenciaId = -1;
    }
    let vPaisId = menuPaisId;
    const miPais = await $("#mdSelPais option:selected").val();    
    if (miPais != undefined && miPais != '') {
        vPaisId = miPais;
    }

    const dataEnviar = {
        promocionPromocionID: idEntidad,
        paisPromocionPaisID: vPaisId, 
        agenciaID: agenciaId, 
		promocionClienteCntPagan:0,
		promocionClienteCntIngresan:0,
        promocionProductoId: valorelcboProducto,
        promocionDiasMin: eltxtDiasMin.value,
        promocionDiasMax: eltxtDiasMax.value,
		promocionNombre:'',
		paisNombre:'',
		agencia: '',
		promocionTipo:'',
		promocionProductoNombre:'',
        promocionDescuento: eltxtDescuento.value,
        promocionPasajeroId: valorelcboPasajero
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

async function CargarCombos() {
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
        console.log(menuPaisId, 'pais');
        $("#mdSelPais").val(menuPaisId);
    }

    const PaisSelId = await $("#mdSelPais option:selected").val();  

       
    const elcomboTipo2 = await getAgencia(0, -1, PaisSelId,0,'','');
    let cantElementos02 = elcomboTipo2.length;
    if (cantElementos02 > 0) {  
        var dataSource = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: elcomboTipo2
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
                localStorage.setItem("lspaispromocionSel", selection.agenciaId); // Guarda el ID
        });
    }

    const elcomboTipo3 = await getProducto(0, 1, parseInt(PaisSelId));
    let cantElementos03 = elcomboTipo3.length;
    if (cantElementos03 > 0) {
        $('#mdselProducto').append($('<option/>').attr("value", "").text('---Seleccione---'));
        console.log(elcomboTipo3, 'datos');
        for (const cboobj of elcomboTipo3) {
            const valorId = cboobj.productoId;
            const valorNombre = cboobj.productoNombre;
            $('#mdselProducto').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
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
                "mData": "paisNombre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.promocionPromocionID + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarPromocion(" + alldata.promocionPromocionID +");'><i class='icon-trash'></i></a></li>"                    
                    
                    return mData;
                }
            }, {
                "mData": "promocionProductoNombre"
            }, {
                "mData": "promocionNombre", "render": function (mData, disp, alldata) {
                    return mData;
                }
            }, {
                "mData": "agencia"
            }, {
                "mData": "promocionDiasMin"
            }, {
                "mData": "promocionDiasMax"
            }, {
                "mData": "promocionDescuento"
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
        fixedHeader: true,
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
   
    const PaisSelId = await $("#mdSelPais option:selected").val();  
    const listadoUsuarios = await getPaisPromocion(PaisSelId, 0, 0, 0);
    console.log(listadoUsuarios);
    if (listadoUsuarios !== undefined) {
        if (listadoUsuarios.length > 0) {
            tablaGridProducto.clear().draw();
            tablaGridProducto.rows.add(listadoUsuarios).draw();
        }
    } else {
        tablaGridProducto.clear().draw();
    }
    $("#cargar").hide();
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

async function getPaisPromocion(paisId, promocionId,agenciaId,productoId) {
    const urlApiFecht = menuUrlApi + "mantenimiento/PromocionPaisObtener";
    const urlParametro = "?int_pPromocionPaisId=" + paisId + "&int_pPromocionID=" + promocionId + "&int_pAgenciaID=" + agenciaId + "&int_pProductoID=" + productoId;
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

let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        mdtxtDiasmin: {
            required: true,
            minlength: 1,
            maxlength: 250,
        }
    },
    messages: {
        mdtxtDiasmin: {
            required: "Por favor, ingresar dias minimos.",
            minlength: "Debe al menos 1 caracter.",
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


async function AbrirModal(promocionId) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario);
    formModal.reset();
    elvalidar.resetForm();

    $("#mdtxtDiasmin").removeClass("is-valid");
    $("#mdtxtDiasmin").removeClass("is-invalid");

    if (promocionId == 0 ) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = 0;
        $('#' + nombreModal).modal('show');
        return false;
    } else {
        idEntidad = promocionId;
        const PaisSelId = await $("#mdSelPais option:selected").val();  
        const elEntidad = await getPaisPromocion(0, promocionId, 0, 0);
        if (elEntidad.length > 0) {                       
            eltitulo.innerHTML = "Actualizar " + nombreEntidad;            
            localStorage.setItem("lspaispromocionSel", elEntidad[0].agenciaID); // Guarda el ID
            document.getElementById("txtAgencia").value = elEntidad[0].agencia;
            document.getElementById("mdselProducto").value = elEntidad[0].promocionProductoId;
            document.getElementById("mdtxtDiasmin").value = elEntidad[0].promocionDiasMin;
            document.getElementById("mdtxtDiasmax").value = elEntidad[0].promocionDiasMax;
            document.getElementById("mdtxtDescuento").value = elEntidad[0].promocionDescuento;                 
            document.getElementById("mdselPasajero").value = elEntidad[0].promocionPasajeroId;
            $('#' + nombreModal).modal('show');
        }
    }
}

async function innactivarPromocion(promocionId) {
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
        const resultado = await deleteAnularPromocion(0, promocionId, 0, 0);
        if (resultado.codigo == 200) {
            await CargarTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}

async function deleteAnularPromocion(paisId, promocionId, agenciaId, productoId) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    const urlParametro = "?int_pPromocionPaisId=" + paisId + "&int_pPromocionID=" + promocionId + "&int_pAgenciaID=" + agenciaId + "&int_pProductoID=" + productoId;
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