const urlGetEntidad = "configuracion/AgenciaObtener";
const urlPostEntidad = "configuracion/AgenciaProcesar";
const urlDeleteEntidad = "configuracion/AgenciaAnular";
let paisFiltro = 0;
let tablaGridProducto = null; // Variable global

cargarAcciones();
async function cargarAcciones() {
    $("#cargar").show();
    await CargarCombos();
    await CargarAgenciasIniciar();    
    await CargarTodo(); // Sin timeout innecesario
}

async function CargarAgenciasIniciar() {
    $('#dtAgencias thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#dtAgencias thead');
}

let idEntidad;
const nombreModal = "popupModalUsuario";
const nombreFormulario = "modalUsuario";
const nombreEntidad = "agencia";

async function clickBuscarVentas() {
    cargarAcciones();
    $('#popupModalVentaSearch').modal('hide');
}

async function limpiarModalBuqueda() {    
    document.getElementById("mdvenSelAgenciaSearch").value = "";
    document.getElementById("mdvenselPromotorSearch").value = "";
    document.getElementById("mdLoginSearch").value = "";
    document.getElementById("mdRUCSearch").value = "";    
}

async function clickBuscarLimpiar() {
    limpiarModalBuqueda();
}

async function cargarPromotores() {
    const PaisSelId = await $("#mdSelPais option:selected").val();

    if (PaisSelId === undefined || PaisSelId === null || PaisSelId === '') {
        paisFiltro = menuPaisId;
    } else {
        paisFiltro = parseInt(PaisSelId);
    }

    $('#mdselPromotor').empty();

    console.log("paisFiltro", paisFiltro)
    const elcomboTipo5 = await getPromotoresPais(parseInt(menuUserId), paisFiltro);
    if (elcomboTipo5 != undefined) {
        let cantElementos05 = elcomboTipo5.length;
        if (cantElementos05 > 0) {
            $('#mdselPromotor').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdselPromotor').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
}

async function CargarCombos() {
    let AgenciaId = 0;   

    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    if (menuPerfilId != 1 && menuPerfilId != 7 && menuPerfilId != 20 && menuPerfilId != 8) {
        paisFiltro = menuPaisId;
    }

    const elcomboTipo4 = await getPais(paisFiltro, 1);
    let cantElementos04 = elcomboTipo4.length;
    if (cantElementos04 > 0) {
        $('#mdSelPais').append($('<option/>').attr("value", "").text('---Seleccione---'));       
        for (const cboobj of elcomboTipo4) {
            const valorId = cboobj.paisId;
            const valorNombre = cboobj.paisNombre;
            $('#mdSelPais').append($('<option/>').attr("value", valorId).text(valorNombre));
        }        
        $("#mdSelPais").val(menuPaisId);
    }

    //const PaisSelId = await $("#mdSelPais option:selected").val();  
    const PaisSelId = document.getElementById("mdSelPais").value;
    
    if (PaisSelId === undefined || PaisSelId === null || PaisSelId === '') {
        paisFiltro = menuPaisId;
    } else {
        paisFiltro = parseInt(PaisSelId);
    }
    console.log(paisFiltro, "paisFiltro");

    const elcomboTipo5 = await getPromotoresPais(parseInt(menuUserId), paisFiltro);
    $('#mdselPromotor').empty();
    $('#mdvenselPromotorSearch').empty();
    $('#mdvenselPromotorFiltro').empty();
    if (elcomboTipo5 != undefined) {
        let cantElementos05 = elcomboTipo5.length;     
        if (cantElementos05 > 0) {
            $('#mdselPromotor').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdselPromotor').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
       
        if (cantElementos05 > 0) {
            $('#mdvenselPromotorSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdvenselPromotorSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
      
        if (cantElementos05 > 0) {
            $('#mdvenselPromotorFiltro').append($('<option/>').attr("value", "").text('---Todos---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdvenselPromotorFiltro').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboDistrito = await getUbigeo(0, PaisSelId, -1);
    if (elcomboDistrito !== undefined) {
        let cantElementos04 = elcomboDistrito.length;
        if (cantElementos04 > 0) {
            $('#mdselDistDire').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboDistrito) {
                const valorId = cboobj.ubigeoId;
                const valorNombre = cboobj.ubigeoDistrito;
                $('#mdselDistDire').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

    if (AgenciaId === 0) {
        const elcomboAgencia = await getAgencia(0, 1, 0, menuUserId,'','');
        if (elcomboAgencia !== undefined) {
            let cantElementos05 = elcomboAgencia.length;
            if (cantElementos05 > 0) {
                $('#mdvenSelAgenciaSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
                for (const cboobj of elcomboAgencia) {
                    const valorId = cboobj.agenciaId;
                    const valorNombre = cboobj.agenciaNombre;
                    $('#mdvenSelAgenciaSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
                }
            }
        }
    }

    const elcomboCobrador = await getValoresTipo('cobranzaCobradorId', 1);
    if (elcomboCobrador !== undefined) {
        let cantElementos11 = elcomboCobrador.length;
        if (cantElementos11 > 0) {
            $('#mdSelEjecutivoCobrador').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboCobrador) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdSelEjecutivoCobrador').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

}

async function BuscarLista() {
    CargarTodo();
}



async function InicializarDataTable() {
    if (tablaGridProducto !== null) {
        return; // Ya está inicializado
    }

    const sUrlIdioma = "/travel/spanish.json";

    tablaGridProducto = $("#dtAgencias").DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'excelHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]
                        },
                        title: 'Agencias',
                        customize: function (xlsx) {
                            var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            sheet.querySelectorAll('row c').forEach((el) => {
                                el.setAttribute('s', '25');
                            });
                            const fila1 = sheet.querySelector('row[r="1"]');
                            if (fila1) {
                                fila1.querySelectorAll('c').forEach((el) => {
                                    el.setAttribute('s', '2');
                                });
                            }
                            const fila2 = sheet.querySelector('row[r="2"]');
                            if (fila2) {
                                fila2.querySelectorAll('c').forEach((el) => {
                                    el.setAttribute('s', '2');
                                });
                            }
                        }
                    }
                ]
            }
        },
        "data": [],
        "columns": [
            {
                "data": "agenciaNombre"
            }, {
                "data": "agenciaPromotorNombre"
            }, {
                "data": "agenciaRUC"
            }, {
                "data": "agenciaLogin"
            }, {
                "data": "agenciaComision"
            }, {
                "data": "agenciaActivo",
                "render": function (mData) {
                    if (mData == 1) {
                        return "<span class='badge rounded-pill badge-success'>Activo</span>";
                    } else if (mData == -1) {
                        return "<span class='badge rounded-pill badge-warning'>Bloqueado</span>";
                    } else {
                        return "<span class='badge rounded-pill badge-danger'>Inactivo</span>";
                    }
                }
            }, {
                "data": null,
                "className": "text-center",
                "orderable": false,
                "render": function (data, type, row) {
                    let botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + row.agenciaId + ");'><i class='icon-pencil-alt'></i></a></li>";
                    let botonEliminar = row.agenciaActivo == 0 ? "" : "<li class='delete'><a href='javascript:void(0);' onclick='innactivarAgencia(" + row.agenciaId + ");'><i class='icon-trash'></i></a></li>";
                    return "<ul class='action'>" + botonEditar + "&nbsp;" + botonEliminar + "</ul>";
                }
            }, {
                "data": "agenciaDireccion"
            }, {
                "data": "ubigeoDistrito"
            }, {
                "data": "agenciaPaisNombre"
            }, {
                "data": "agenciaEmail"
            }, {
                "data": "agenciaObservacionCobranzas"
            }, {
                "data": "agenciaTelefono"
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": true,
        "filter": true,
        "pageLength": 25,
        "info": false,
        "ordering": true,
        "processing": true,
        "responsive": true,
        "autoWidth": false,
        "retrieve": false, // Cambiado a false
        "orderCellsTop": true,
        "scrollY": "400px",
        "scrollCollapse": true,
        "select": {
            style: 'multi',
            selector: 'td:first-child',
            items: 'row'
        },
        "stateSave": true,
        initComplete: function () {
            var api = this.api();
            api.columns().eq(0).each(function (colIdx) {
                if (colIdx != 6) { // Columna de acciones
                    var cell = $('.filters th').eq($(api.column(colIdx).header()).index());
                    var title = $(cell).text();
                    $(cell).html('<input type="text" placeholder="' + title + '" />');

                    $('input', $('.filters th').eq($(api.column(colIdx).header()).index()))
                        .off('keyup change')
                        .on('change', function (e) {
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})';
                            api.column(colIdx).search(
                                this.value != '' ? regexr.replace('{search}', '(((' + this.value + ')))') : '',
                                this.value != '',
                                this.value == ''
                            ).draw();
                        })
                        .on('keyup', function (e) {
                            e.stopPropagation();
                            $(this).trigger('change');
                        });
                }
            });
        }
    });
}

async function CargarTodo() {
    // Inicializar DataTable solo la primera vez
    await InicializarDataTable();

    const PaisId = $("#mdSelPais").val() || menuPaisId;
    const elchkActivo = document.getElementById("mdchkActivos");

    let BusquedaCodAgencia = document.getElementById("mdvenSelAgenciaSearch").value || 0;
    let FiltroPromotor = document.getElementById("mdvenselPromotorFiltro").value;
    let BusquedaPromotor = document.getElementById("mdvenselPromotorSearch").value;
    let BusquedaRuc = document.getElementById("mdRUCSearch").value || "";
    let BusquedaLogin = document.getElementById("mdLoginSearch").value || "";

    if (!FiltroPromotor) {
        FiltroPromotor = menuUserId != 1 ? menuUserId : 0;
    } else {
        BusquedaPromotor = FiltroPromotor;
    }

    if (!BusquedaPromotor) {
        BusquedaPromotor = menuUserId != 1 ? menuUserId : 0;
    }

    let ActivoCheck = elchkActivo.checked ? 1 : -1;    

    try {
        const listadoAgencias = await getAgencia(
            BusquedaCodAgencia,
            ActivoCheck,
            PaisId,
            parseInt(BusquedaPromotor),
            BusquedaRuc,
            BusquedaLogin
        );

        // Solo actualizar datos, no recrear el DataTable
        if (listadoAgencias && listadoAgencias.length > 0) {
            tablaGridProducto.clear().rows.add(listadoAgencias).draw();
        } else {
            tablaGridProducto.clear().draw();
        }
    } catch (error) {
        console.error("Error al cargar agencias:", error);
        tablaGridProducto.clear().draw();
    } finally {
        $("#cargar").hide();
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

async function AbrirModalBusqueda() {
    const PaisSelId = await $("#mdSelPais option:selected").val();  
    console.log(PaisSelId, "paisFiltroOpenModal");
    if (PaisSelId === undefined || PaisSelId === null || PaisSelId === '') {
        paisFiltro = menuPaisId;
    } else {
        paisFiltro = parseInt(PaisSelId);
    }
    console.log(paisFiltro, "paisFiltroOpenModal");

    
        const elcomboTipo5 = await getPromotoresPais(parseInt(menuUserId), paisFiltro);
        let cantElementos05 = elcomboTipo5.length;
        if (cantElementos05 > 0) {
            $('#mdvenselPromotorSearch').empty();
            $('#mdvenselPromotorSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdvenselPromotorSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }

        $('#popupModalVentaSearch').modal('show');
    

    
}

let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        mdtxtNombreCompleto: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdselPromotor: "required",        
    },
    messages: {
        mdtxtNombreCompleto: {
            required: "Por favor, ingresar nombre.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdselPromotor: "Por favor, seleccione el promotor.",
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

async function clickValidar() {
    if ($("#modalUsuario").valid()) {
        const resultado = await ProcesarEntidad();
        if (resultado.codigo == 200) {
            $('#' + nombreModal).modal('hide');
            CargarTodo();
            mostrarMensaje(1, resultado.descripcion)
            return false;
        } else {
            debugger;
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}

async function AbrirModal(id) {
    //Cargar nuevamente el combo de promotores
    //await cargarPromotores();

    setTimeout(async () => {
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
            const elEntidad = await getAgencia(id, -1, 0, 0, '', '');
            if (elEntidad.length > 0) {
                debugger;
                idEntidad = id;
                document.getElementById('mdchkCambiaPwd').removeAttribute("disabled");
                document.getElementById('mdtxtPass').setAttribute("disabled", "disabled");
                document.getElementById('mdtxtPassVal').setAttribute("disabled", "disabled");
                eltitulo.innerHTML = "Actualizar " + nombreEntidad;
                document.getElementById("mdtxtNombreCompleto").value = elEntidad[0].agenciaNombre;
                if (elEntidad[0].agenciaPromotorId !== null && elEntidad[0].agenciaPromotorId !== undefined && elEntidad[0].agenciaPromotorId !== 0) {
                    document.getElementById('mdselPromotor').value = elEntidad[0].agenciaPromotorId;
                }
                // Si el valor de la contraseña es vacío o nulo, mostrar 'xxxxxxxxxx'
                let pwd = elEntidad[0].usuarioPassword;
                if (pwd === undefined || pwd === null || (typeof pwd === "string" && pwd.trim() === "")) {
                    pwd = "xxxxxxxxxx";
                }
                document.getElementById("mdtxtPass").value = pwd;
                document.getElementById("mdtxtPassVal").value = pwd;
              
                document.getElementById("mdtxtDireccion").value = elEntidad[0].agenciaDireccion;
                document.getElementById("mdselDistDire").value = elEntidad[0].agenciaUbigeoId;
                document.getElementById("mdtxtNumDoc").value = elEntidad[0].agenciaRUC;
                document.getElementById("mdtxtTelefono").value = elEntidad[0].agenciaTelefono;
                document.getElementById("mdtxtCorreo").value = elEntidad[0].agenciaEmail;
                document.getElementById("mdtxtAgv").value = elEntidad[0].agenciaIdExterno;
                document.getElementById("mdtxtComision").value = elEntidad[0].agenciaComision;
                document.getElementById("mdtxtLogin").value = elEntidad[0].agenciaLogin;

                const strfechaDesde = elEntidad[0].agenciaValidoDesde;
                const strfechaHasta = elEntidad[0].agenciaValidoHasta;
                const fechaDesdeMoment = moment(strfechaDesde, "YYYY-MM-DD");
                const dtfechaDesde = fechaDesdeMoment.toDate();
                const fechaHastaMoment = moment(strfechaHasta, "YYYY-MM-DD");
                const dtfechaHasta = fechaHastaMoment.toDate();
                const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
                const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
                const strfechaDesdeAnh = dtfechaDesde.getFullYear();
                const strfechaHastaDia = ("0" + dtfechaHasta.getDate()).slice(-2)
                const strfechaHastaMes = ("0" + (dtfechaHasta.getMonth() + 1)).slice(-2)
                const strfechaHastaAnh = dtfechaHasta.getFullYear();
                const strfechaDesdeFin = strfechaDesdeAnh + "-" + strfechaDesdeMes + "-" + strfechaDesdeDia;
                const strfechaHastaFin = strfechaHastaAnh + "-" + strfechaHastaMes + "-" + strfechaHastaDia;
                document.getElementById("mdfecDesde").value = strfechaDesdeFin;
                document.getElementById("mdfechasta").value = strfechaHastaFin;

                document.getElementById("mdtxtCredito").value = elEntidad[0].agenciaCredito;
                document.getElementById("mdtxtComentarios").value = elEntidad[0].agenciaComentarios;
                document.getElementById("mdtxtCobranza").value = elEntidad[0].agenciaObservacionCobranzas;

                if (elEntidad[0].agenciaActivo == 1) {
                    document.getElementById("mdchkEstado").checked = true;
                } else {
                    document.getElementById("mdchkEstado").checked = false;
                }

                if (elEntidad[0].agenciaVip == 1) {
                    document.getElementById("mdchkVIP").checked = true;
                } else {
                    document.getElementById("mdchkVIP").checked = false;
                }

                document.getElementById("mdSelEjecutivoCobrador").value = elEntidad[0].agenciaEjecutivoCobrador;

                $('#' + nombreModal).modal('show');
            }
        }
    }, 600);    

    
}


$('#mdSelPais').change(async function () {

    const valorPaisId = $(this).val();
    const elcomboAgencia = await getAgencia(0, 1, valorPaisId, menuUserId, '', '');

    if (elcomboAgencia !== undefined) {
        let cantElementos05 = elcomboAgencia.length;
        $('#mdvenSelAgenciaSearch').empty();
        if (cantElementos05 > 0) {           
            $('#mdvenSelAgenciaSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboAgencia) {
                const valorId = cboobj.agenciaId;
                const valorNombre = cboobj.agenciaNombre;
                $('#mdvenSelAgenciaSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

    const elcomboTipo5 = await getPromotoresPais(parseInt(menuUserId), valorPaisId);
    $('#mdselPromotor').empty();
    $('#mdvenselPromotorFiltro').empty();
    if (elcomboTipo5 != undefined) {
        let cantElementos05 = elcomboTipo5.length;

        if (cantElementos05 > 0) {

            $('#mdselPromotor').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdselPromotor').append($('<option/>').attr("value", valorId).text(valorNombre));
            }

            $('#mdvenselPromotorFiltro').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdvenselPromotorFiltro').append($('<option/>').attr("value", valorId).text(valorNombre));
            }

        }
    }
});

$("#mdchkCambiaPwd").change(function () {
    if (this.checked) {
        document.getElementById("mdtxtPass").value = "";
        document.getElementById('mdtxtPass').removeAttribute("disabled");
        document.getElementById("mdtxtPass").focus();
        document.getElementById("mdtxtPassVal").value = "";
        document.getElementById('mdtxtPassVal').removeAttribute("disabled");
    } else {
        document.getElementById("mdtxtPass").value = "xxxxxxxxxxxxx";
        document.getElementById('mdtxtPass').setAttribute("disabled", "disabled");
        document.getElementById("mdtxtPassVal").value = "xxxxxxxxxxxxx";
        document.getElementById('mdtxtPassVal').setAttribute("disabled", "disabled");
    }
});

const ProcesarEntidad = async () => {
  
    const eltxtNombrecompleto = document.getElementById("mdtxtNombreCompleto");
    const elchkEstado = document.getElementById("mdchkEstado");
    const eltxtDireccion = document.getElementById("mdtxtDireccion");
    const eltxtNumDoc = document.getElementById("mdtxtNumDoc");
    const eltxtTelefono = document.getElementById("mdtxtTelefono");
    const eltxtCorreo = document.getElementById("mdtxtCorreo");
    const eltxtAgv = document.getElementById("mdtxtAgv");
    const eltxtComision = document.getElementById("mdtxtComision");
    const eltxtDesde = document.getElementById("mdfecDesde");
    const eltxtHasta = document.getElementById("mdfechasta");
    const eltxtCredito = document.getElementById("mdtxtCredito");
    const eltxtComentarios = document.getElementById("mdtxtComentarios");
    const eltxtCobranza = document.getElementById("mdtxtCobranza");
    const eltxtPassword = document.getElementById("mdtxtPass");
    const elchkCambioPass = document.getElementById("mdchkCambiaPwd");
    const eltxtLogin = document.getElementById("mdtxtLogin");
      
    const valorelcboProm = await $("#mdselPromotor option:selected").val();
    const valorelcboPais = await $("#mdSelPais option:selected").val();
    const valorelcboDistrito = await $("#mdselDistDire option:selected").val();
    let valorAgenciaUbigeoId = 0;
    let valorCredito = 0;

    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }   

    let vPaisId = menuPaisId;
       
    if (valorelcboPais != undefined && valorelcboPais != '') {
        vPaisId = valorelcboPais;
    }

    let cambioPssCheck = 0;
    if (elchkCambioPass.checked == true) {
        cambioPssCheck = 1
    }

    if (valorelcboDistrito == "") {
        valorAgenciaUbigeoId = 0;
    } else {
        valorAgenciaUbigeoId = valorelcboDistrito;
    }

    if (eltxtCredito.value == "") {
        valorCredito = 0;
    } else {
        valorCredito = eltxtCredito.value;
    }

    if (eltxtAgv.value == "") {
        eltxtAgv.value = 0;
    }
   
    const dataEnviar = {
        agenciaId: idEntidad,
        agenciaIdExterno: eltxtAgv.value,
        agenciaNombre: htmlEncode(eltxtNombrecompleto.value),
        agenciaDireccion: eltxtDireccion.value,
        agenciaRUC: eltxtNumDoc.value,
        agenciaLogin: eltxtLogin.value,
        agenciaPassword: eltxtPassword.value,
        agenciaEmail: eltxtCorreo.value,
        agenciaPerfilId: 2,
        agenciaPromotorId: parseInt(valorelcboProm),
        agenciaValidoDesde: eltxtDesde.value,
        agenciaValidoHasta: eltxtHasta.value,
        agenciaComentarios: eltxtComentarios.value,
        agenciaCreadoUsuarioId: menuUserId,
        agenciaActivo: estadoCheck,
        agenciaCredito: valorCredito,
        agenciaComision: parseInt(eltxtComision.value),
        agenciaPaisId: vPaisId,
        agenciaTelefono: eltxtTelefono.value,
        agenciaXcoord: 0,
        agenciaYcoord: 0,
        agenciaUbigeoId: valorAgenciaUbigeoId,
        agenciaObservacionCobranzas: eltxtCobranza.value,
        agencia_ActualizarContrasena: cambioPssCheck
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

async function innactivarAgencia(Id) {
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
        const resultado = await deleteAnularAgencia(Id);
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

async function deleteAnularAgencia(id) {
    const urlApiFecht = menuUrlApi + "mantenimiento/AgenciaAnular";
    const urlParametro = "?int_pAgenciaId=" + id;
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



