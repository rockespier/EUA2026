let id;
const urlGetEntidad = "mantenimiento/AgenciaProductoObtener";
const urlPostEntidad = "mantenimiento/AgenciaProductoProcesar";
const urlDeleteEntidad = "mantenimiento/AgenciaProductoAnular";

cargarAcciones();

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
const nombreEntidad = "Descuentos";
async function clickValidar() {
    if ($("#" + nombreFormulario).valid()) {       
        const resultado = await ProcesarEntidad();
        if (resultado.codigo == 200) {
            $('#' + nombreModal).modal('hide');
            $('#txtAgencia').val("")
            $('#txtAgencia').typeahead('val', '');
            $('#txtAgencia').blur();
            localStorage.removeItem('lsagenciaproductoSel');
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
    const eltxtNombre = document.getElementById("txtagenciaProductoDescuentoNombre");   
    const ladatFechaIniV = document.getElementById("mdvenFecIncioVig");
    const ladatFechaFinV = document.getElementById("mdvenFecFinalVig");
    let fechaFormateaIniV;
    let codProducto = 0;
    if (ladatFechaIniV.value == "") {
        const fecha = new Date(0);
        fechaFormateaIniV = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaIniV.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaIniV = formatearFechaString(dtfechaIniV);
    }
    let fechaFormateaFinV;
    if (ladatFechaFinV.value == "") {
        const fecha = new Date(0);
        fechaFormateaFinV = formatearFechaString(fecha);
    } else {
        const fechaFinVMoment = moment(ladatFechaFinV.value, "YYYY-MM-DD");
        const dtfechaFinV = fechaFinVMoment.toDate();
        fechaFormateaFinV = formatearFechaString(dtfechaFinV);
    }
       
    const valorelcboProducto = await $("#mdselProducto option:selected").val();
    if (valorelcboProducto == undefined || valorelcboProducto == '') {
        codProducto = 0
    } else {
        codProducto = valorelcboProducto
    }

    var agenciaId = localStorage.getItem("lsagenciaproductoSel");
    //debugger;
    let vPaisId = menuPaisId;
    const miPais = await $("#mdSelPais option:selected").val();
    if (miPais != undefined && miPais != '') {
        vPaisId = miPais;
    }

    let BusquedaCodAgencia = 0

    if (agenciaId === null || agenciaId === undefined || agenciaId === '') {
        BusquedaCodAgencia = 0;
    } else {
        BusquedaCodAgencia = agenciaId;
    }

    const dataEnviar = {
        agenciaProductoAgenciaId: BusquedaCodAgencia,
        agenciaProductoProductoId: codProducto,
        agenciaProductoDescuentoTipo: 1,
        agenciaProductoDescuentoImporte: eltxtDescuento.value,       
        agenciaProductoDescuentoVigenciaIni: fechaFormateaIniV,
        agenciaProductoDescuentoVigenciafin: fechaFormateaFinV,
        agenciaProductoAgenciaNombre: '',
        agenciaProductoProductoNombre: '',
        agenciaProductoDescuentoTipoNombre: '',
        agenciaProductoDescuentoNombre: eltxtNombre.value,
        agenciaProductoId: id
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
    //debugger;
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
            localStorage.setItem("lsagenciaproductoSel", selection.agenciaId); // Guarda el ID
            
        });
    }

    const elcomboTipo3 = await getProducto(0, 1, parseInt(PaisSelId));
    let cantElementos03 = elcomboTipo3.length;
    if (cantElementos03 > 0) {
        $('#mdselProducto').append($('<option/>').attr("value", "-1").text('---Seleccione---'));
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
                "mData": "agenciaProductoProductoNombre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.agenciaProductoId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarPromocion(" + alldata.agenciaProductoId + ");'><i class='icon-trash'></i></a></li>"

                    return mData;
                }
            }, {
                "mData": "agenciaProductoAgenciaNombre"
            }, {
                "mData": "agenciaProductoDescuentoVigenciaIni", "render": function (mData, disp, alldata) {
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
                "mData": "agenciaProductoDescuentoVigenciafin", "render": function (mData, disp, alldata) {
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
                "mData": "agenciaProductoDescuentoImporte"
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

    const PaisSelId = await $("#mdSelPais option:selected").val();
    const listadoUsuarios = await getAgenciaProducto(PaisSelId, 0, 0,0);
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
async function getAgenciaProducto(paisId, agenciaId, productoId,id) {
    const urlApiFecht = menuUrlApi + urlGetEntidad;
    const urlParametro = "?int_pAgenciaProductoAgenciaId=" + agenciaId + "&int_pAgenciaProductoProductoId=" + productoId + "&int_pAgenciaProductoPaisId=" + paisId + "&int_pAgenciaProductoId=" + id;
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
let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        mdtxtDescuento: {
            required: true,
            min: 1,
            max: 100,
        },
        txtAgencia: {
            required: true
        },
        mdvenFecIncioVig: {
            required: true
        },
        mdvenFecFinalVig: {
            required: true
        },
    },
    messages: {
        txtAgencia: "Seleccione una agencia.",
        mdtxtDescuento: {
            required: "La tarifa debe ser mayor a 0.",
            min: "Debe mayor que cero.",
            max: "Debe ser menor igual que 100.",
        },
        mdvenFecIncioVig: {
            required: "Debe ingresar la fecha de inicio."
        },
        mdvenFecIncioVig: {
            required: "Debe ingresar la fecha de fin."
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
async function AbrirModal(agenciaproductoId) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario);
    formModal.reset();
    elvalidar.resetForm();

    $("#txtAgencia").removeClass("is-valid");
    $("#mdtxtDescuento").removeClass("is-invalid");

    if (agenciaproductoId == 0) {
        id = 0;
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;        
        $('#' + nombreModal).modal('show');
        return false;
    } else {        
        const PaisSelId = await $("#mdSelPais option:selected").val();
        const elEntidad = await getAgenciaProducto(PaisSelId, 0, 0, agenciaproductoId);
        id = agenciaproductoId;
        document.getElementById("mdHidId").value = id;
        if (elEntidad.length > 0) {          
            localStorage.setItem("lsagenciaproductoSel", elEntidad[0].agenciaProductoAgenciaId); // Guarda el ID
            eltitulo.innerHTML = "Actualizar " + nombreEntidad;
            document.getElementById("txtAgencia").value = elEntidad[0].agenciaProductoAgenciaNombre;           
            document.getElementById("mdselProducto").value = elEntidad[0].agenciaProductoProductoId;
            
            if (elEntidad[0].agenciaProductoDescuentoVigenciaIni !== "0001-01-01T00:00:00" && elEntidad[0].agenciaProductoDescuentoVigenciaIni !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(elEntidad[0].agenciaProductoDescuentoVigenciaIni, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdvenFecIncioVig").value = formatearFechaString(dtfecha);               
            }
            if (elEntidad[0].agenciaProductoDescuentoVigenciafin !== "0001-01-01T00:00:00" && elEntidad[0].agenciaProductoDescuentoVigenciafin !== "1970-01-01T00:00:00") {
                const fechaMoment = moment(elEntidad[0].agenciaProductoDescuentoVigenciafin, "YYYY-MM-DD");
                const dtfecha = fechaMoment.toDate();
                document.getElementById("mdvenFecFinalVig").value = formatearFechaString(dtfecha);                
            }
            document.getElementById("mdtxtDescuento").value = elEntidad[0].agenciaProductoDescuentoImporte;
            document.getElementById("txtagenciaProductoDescuentoNombre").value = elEntidad[0].agenciaProductoDescuentoNombre;

            $('#' + nombreModal).modal('show');
        }
    }
}
async function innactivarPromocion(agenciaproductoId) {
    const alerta = await swal({
        title: "¿Está seguro de eliminar?",
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
        const resultado = await deleteAnularPromocion(agenciaproductoId);
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
async function deleteAnularPromocion(agenciaproductoId) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    const urlParametro = "?int_pAgenciaProductoId=" + agenciaproductoId;
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