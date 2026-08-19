let idUsuario;

cargarAcciones();
async function cargarAcciones() {
    await cargarCombos();
    setTimeout(async () => {
        await CargarUsuariosIniciar();
        await CargarTodo();
    }, 600);
}

async function CargarUsuariosIniciar() {
    $('#dtUsuarios thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#dtUsuarios thead');
}

async function IniciarFecha() {
    const fechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    const fecha3meses = new Date(fechaHoy.setMonth(fechaHoy.getMonth() + 2));
    const strfecha3mesesDia = ("0" + fecha3meses.getDate()).slice(-2)
    const strfecha3mesesMes = ("0" + (fecha3meses.getMonth() + 1)).slice(-2)
    const strfecha3mesesAnh = fecha3meses.getFullYear();
    const strfecha3mesesFin = strfecha3mesesAnh + "-" + strfecha3mesesMes + "-" + strfecha3mesesDia;
    document.getElementById("mdfecDesde").value = strfechaHoyFin;
    document.getElementById("mdfechasta").value = strfecha3mesesFin;
    document.getElementById("mdfechasta").min = strfechaHoyFin;
}
$('#mdfecDesde').change(function () {
    var strfechaSelecFin = $(this).val();
    document.getElementById("mdfechasta").min = strfechaSelecFin;
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
let elvalidar = $("#modalUsuario").validate({
    rules: {
        mdtxtNombreCompleto: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdxtLoginAcceso: {
            required: true,
            minlength: 3,
            maxlength: 10,
        },
        mdtxtCorreo: {
            required: true,
            email: true
        },
        mdtxtPass: {
            required: true,
            minlength: 10,
            maxlength: 50,
            pattern: "((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W]).{10,50})"
        },
        mdtxtPassVal: {
            required: true,
            minlength: 10,
            maxlength: 50,
            equalTo: "#mdtxtPass"
        },
        mdselTipoDoc: "required",
        mdtxtNumDoc: {
            required: true,
            minlength: 6,
            maxlength: 20,
        },
        //mdselBanco: "required",
        //mdtxtCCTA: {
        //    required: true,
        //    minlength: 5,
        //    maxlength: 30,
        //},
        mdselPerfil: "required",
        mdselpais: "required",
        mdfecDesde: {
            required: true,
        },
        mdfechasta: {
            required: true,
        }
    },
    messages: {
        mdtxtNombreCompleto: {
            required: "Por favor, ingresar nombre completo.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdxtLoginAcceso: {
            required: "Por favor, ingresar usuario.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 10 caracteres.",
        },
        mdtxtCorreo: {
            required: "Por favor, ingresar correo.",
            email: "Formato incorrecto.",
        },
        mdtxtPass: {
            required: "Por favor, ingrese contraseña.",
            minlength: "Debe al menos con 10 caracteres.",
            maxlength: "No debe pasar de los 50 caracteres.",
            pattern: "Necesita una Mayúscula, Minúscula, Digito y/o Símbolo."
        },
        mdtxtPassVal: {
            required: "Por favor, repetir contraseña nueva.",
            minlength: "Debe al menos con 10 caracteres.",
            maxlength: "No debe pasar de los 50 caracteres.",
            equalTo: "la contraseña debe ser igual."
        },
        mdselPerfil: "Por favor, seleccione Perfil.",
        mdselpais: "Por favor, seleccione Pais.",
        mdselTipoDoc: "Por favor, seleccione Tipo Documento.",
        mdtxtNumDoc: {
            required: "Por favor, ingresar numero de documento.",
            minlength: "Debe al menos con 6 caracteres.",
            maxlength: "No debe pasar de los 20 caracteres.",
        },
        //mdselBanco: "Por favor, seleccione el banco.",
        //mdtxtCCTA: {
        //    required: "Por favor, ingresar numero de cuenta bancaria.",
        //    minlength: "Debe al menos con 5 caracteres.",
        //    maxlength: "No debe pasar de los 30 caracteres.",
        //},
        mdfecDesde: {
            required: "Por favor, seleccione fecha desde.",
        },
        mdfechasta: {
            required: "Por favor, seleccione fecha hasta.",
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

async function AbrirModal(id) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById("modalUsuario")
    formModal.reset();
    elvalidar.resetForm();

    $("#mdtxtNombreCompleto").removeClass("is-valid");
    $("#mdtxtNombreCompleto").removeClass("is-invalid");

    $("#mdtxtCorreo").removeClass("is-valid");
    $("#mdtxtCorreo").removeClass("is-invalid");

    $("#mdxtLoginAcceso").removeClass("is-valid");
    $("#mdxtLoginAcceso").removeClass("is-invalid");

    $("#mdtxtPass").removeClass("is-valid");
    $("#mdtxtPass").removeClass("is-invalid");

    $("#mdtxtPassVal").removeClass("is-valid");
    $("#mdtxtPassVal").removeClass("is-invalid");

    $("#mdselTipoDoc").removeClass("is-valid");
    $("#mdselTipoDoc").removeClass("is-invalid");

    $("#mdtxtNumDoc").removeClass("is-valid");
    $("#mdtxtNumDoc").removeClass("is-invalid");

    $("#mdselPerfil").removeClass("is-valid");
    $("#mdselPerfil").removeClass("is-invalid");

    $("#mdselpais").removeClass("is-valid");
    $("#mdselpais").removeClass("is-invalid");

    $("#mdfecDesde").removeClass("is-valid");
    $("#mdfecDesde").removeClass("is-invalid");

    $("#mdfechasta").removeClass("is-valid");
    $("#mdfechasta").removeClass("is-invalid");

    $("#mdfecUltimo").removeClass("is-valid");
    $("#mdfecUltimo").removeClass("is-invalid");

    $("#mdtxtComentarios").removeClass("is-valid");
    $("#mdtxtComentarios").removeClass("is-invalid");

    $("#mdselBanco").removeClass("is-valid");
    $("#mdselBanco").removeClass("is-invalid");
    $("#mdtxtCCTA").removeClass("is-valid");
    $("#mdtxtCCTA").removeClass("is-invalid");

    $('#divCambiarPass').hide();
    $('#divfechaultima').hide();

    $("#mdselpais").val(menuPaisId);
    IniciarFecha();

    if (id == 0) {
        document.getElementById('mdchkCambiaPwd').setAttribute("disabled", "disabled");
        document.getElementById('mdtxtPass').removeAttribute("disabled");
        document.getElementById('mdtxtPassVal').removeAttribute("disabled");

        eltitulo.innerHTML = "Nuevo usuario";
        idUsuario = 0;
        $('#popupModalUsuario').modal('show');
        return false;
    } else {
        let AgenciaId = 0;
        if (menuelOrigen !== 'U') {
            AgenciaId = menuelAgenciaUsuarioId;
        }
        const elUsuario = await getUsuario(id, AgenciaId, -1, menuelOrigen);
        if (elUsuario.length > 0) {
            idUsuario = id;
            document.getElementById('mdchkCambiaPwd').removeAttribute("disabled");
            document.getElementById('mdtxtPass').setAttribute("disabled", "disabled");
            document.getElementById('mdtxtPassVal').setAttribute("disabled", "disabled");
            eltitulo.innerHTML = "Actualizar usuario";
            document.getElementById("mdtxtNombreCompleto").value = elUsuario[0].usuarioNombre;
            document.getElementById("mdxtLoginAcceso").value = elUsuario[0].usuarioLogin;
            document.getElementById("mdtxtCorreo").value = elUsuario[0].usuarioEmail;
            // Si el valor de la contraseña es vacío o nulo, mostrar 'xxxxxxxxxx'
            let pwd = elUsuario[0].usuarioPassword;
            if (pwd === undefined || pwd === null || (typeof pwd === "string" && pwd.trim() === "")) {
                pwd = "xxxxxxxxxx";
            }
            document.getElementById("mdtxtPass").value = pwd;
            document.getElementById("mdtxtPassVal").value = pwd;

            document.getElementById("mdtxtComentarios").value = elUsuario[0].usuarioComentarios;
            if (elUsuario[0].usuarioActivo == 1) {
                document.getElementById("mdchkEstado").checked = true;
            } else {
                document.getElementById("mdchkEstado").checked = false;
            }
            if (elUsuario[0].usuarioPaisId !== null && elUsuario[0].usuarioPaisId !== undefined && elUsuario[0].usuarioPaisId !== 0) {
                document.getElementById('mdselpais').value = elUsuario[0].usuarioPaisId;
            } 
            document.getElementById('mdselPerfil').value = elUsuario[0].usuarioPerfilId;
            const strfechaDesde = elUsuario[0].usuarioValidoDesde;
            const strfechaHasta = elUsuario[0].usuarioValidoHasta;
            const strfechaUltimo = elUsuario[0].usuarioUltimoAcceso;
            const fechaDesdeMoment = moment(strfechaDesde, "YYYY-MM-DD");
            const dtfechaDesde = fechaDesdeMoment.toDate();
            const fechaHastaMoment = moment(strfechaHasta, "YYYY-MM-DD");
            const dtfechaHasta = fechaHastaMoment.toDate();
            const fechaUltimoMoment = moment(strfechaUltimo, "YYYY-MM-DD");
            const dtfechaUltimo = fechaUltimoMoment.toDate();
            const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
            const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
            const strfechaDesdeAnh = dtfechaDesde.getFullYear();
            const strfechaHastaDia = ("0" + dtfechaHasta.getDate()).slice(-2)
            const strfechaHastaMes = ("0" + (dtfechaHasta.getMonth() + 1)).slice(-2)
            const strfechaHastaAnh = dtfechaHasta.getFullYear();
            const strfechaUltimoDia = ("0" + dtfechaUltimo.getDate()).slice(-2)
            const strfechaUltimoMes = ("0" + (dtfechaUltimo.getMonth() + 1)).slice(-2)
            const strfechaUltimoAnh = dtfechaUltimo.getFullYear();
            const strfechaDesdeFin = strfechaDesdeAnh + "-" + strfechaDesdeMes + "-" + strfechaDesdeDia;
            const strfechaHastaFin = strfechaHastaAnh + "-" + strfechaHastaMes + "-" + strfechaHastaDia;
            const strfechaUltimoFin = strfechaUltimoAnh + "-" + strfechaUltimoMes + "-" + strfechaUltimoDia;
            document.getElementById("mdfecDesde").value = strfechaDesdeFin;
            document.getElementById("mdfechasta").value = strfechaHastaFin;
            document.getElementById("mdfecUltimo").value = strfechaUltimoFin;
            if (elUsuario[0].usuarioNumeroDocumento !== undefined && elUsuario[0].usuarioNumeroDocumento !== null) {
                document.getElementById("mdtxtNumDoc").value = elUsuario[0].usuarioNumeroDocumento.trim();
            }
            if (elUsuario[0].usuarioTipoDocumento !== undefined && elUsuario[0].usuarioTipoDocumento !== null) {
                document.getElementById("mdselTipoDoc").value = elUsuario[0].usuarioTipoDocumento;
            }
            if (elUsuario[0].usuarioBanco !== undefined && elUsuario[0].usuarioBanco !== null) {
                document.getElementById("mdselBanco").value = elUsuario[0].usuarioBanco;
            }
            if (elUsuario[0].usuarioNumeroCuenta !== undefined && elUsuario[0].usuarioNumeroCuenta !== null) {
                document.getElementById("mdtxtCCTA").value = elUsuario[0].usuarioNumeroCuenta.trim();
            }
            $('#divCambiarPass').show();
            if (elUsuario[0].usuarioUltimoAcceso !== '0001-01-01T00:00:00') {
                $('#divfechaultima').show();
            }
            $('#popupModalUsuario').modal('show');
        }
    }
}
async function clickValidar() {
    if ($("#modalUsuario").valid()) {
        const resultado = await ProcesarUsuario();
        if (resultado.errorCodigo == 200) {
            $('#popupModalUsuario').modal('hide');
            CargarTodo();
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function innactivarUsuario(usuarioId) {
    const alerta = await swal({
        title: "¿Está seguro de inactivar el usuario?",
        text: "Se puede revertir este proceso al entrar al mantenimiento por usuario.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        const resultado = await deleteUsuarioAnular(usuarioId, menuelOrigen);
        if (resultado.errorCodigo == 200) {
            CargarTodo();
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonEditar;
    let botonEliminar;
    tablaGridProducto = $("#dtUsuarios").DataTable({
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" },
            {
                orderable: false,
                render: DataTable.render.select(),
                targets: 0
            }
        ],
        "data": [],
        "aoColumns": [
            {
                "mData": "usuarioLogin", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick='AbrirModal(" + alldata.usuarioId + ");'><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarUsuario(" + alldata.usuarioId + ");'><i class='icon-trash'></i></a></li>"
                    if (alldata.usuarioActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData
                }
            }, {
                "mData": "usuarioNombre"
            }, {
                "mData": "usuarioPaisNombre"
            }, {
                "mData": "usuarioPerfilNombre", "render": function (mData, disp, alldata) {
                    return "<span class='badge rounded-pill badge-light-secondary'>" + mData + "</span>"
                }
            }, {
                "mData": "usuarioEmail"
            }, {
                "mData": "usuarioValidoDesde", "render": function (mData, disp, alldata) {

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
                "mData": "usuarioActivo", "render": function (mData, disp, alldata) {
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
                    if (colIdx != 7) {
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

    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const elchkActivo = document.getElementById("mdchkActivos");
    let ActivoCheck = -1;
    if (elchkActivo.checked == true) {
        ActivoCheck = 1
    }
    const listadoUsuarios = await getUsuario(0, AgenciaId, ActivoCheck, menuelOrigen);
    if (listadoUsuarios.length > 0) {
        tablaGridProducto.clear().draw();
        tablaGridProducto.rows.add(listadoUsuarios).draw();
    }
}
$('#mdchkActivos').change(function () {
        CargarTodo();
});
function getDate(element) {
    let date;
    try {
        date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
        date = null;
    }
    return date;
}
const ProcesarUsuario = async () => {
    const eltxtUsuario = document.getElementById("mdxtLoginAcceso");
    const eltxtPassword = document.getElementById("mdtxtPass");
    const eltxtNombrecompleto = document.getElementById("mdtxtNombreCompleto");
    const eltxtCorreo = document.getElementById("mdtxtCorreo");
    const elcboPerfil = document.getElementById("mdselPerfil");
    const valorelcboPerfil = parseInt(elcboPerfil.options[elcboPerfil.selectedIndex].value);
    let fechaFormateaDesde;
    const ladatDesde = document.getElementById("mdfecDesde");
    if (ladatDesde.value == "") {
        const fecha = new Date(0);
        fechaFormateaDesde = formatearFechaString(fecha);
    } else {
        const fechaDesdeMoment = moment(ladatDesde.value, "YYYY-MM-DD");
        const dtfechaDesde = fechaDesdeMoment.toDate();
        fechaFormateaDesde = formatearFechaString(dtfechaDesde);
    }
    let fechaFormateaHasta;
    const ladatHasta = document.getElementById("mdfechasta");
    if (ladatHasta.value == "") {
        const fecha = new Date(0);
        fechaFormateaHasta = formatearFechaString(fecha);
    } else {
        const fechaHastaMoment = moment(ladatHasta.value, "YYYY-MM-DD");
        const dtfechaHasta = fechaHastaMoment.toDate();
        fechaFormateaHasta = formatearFechaString(dtfechaHasta);
    }
    const eltxtComentario = document.getElementById("mdtxtComentarios");
    const elchkEstado = document.getElementById("mdchkEstado");
    const elcboPais = document.getElementById("mdselpais");
    const valorcboPais = parseInt(elcboPais.options[elcboPais.selectedIndex].value);

    const elchkCambioPass = document.getElementById("mdchkCambiaPwd");
    const eltextNumeroDoc = document.getElementById("mdtxtNumDoc")
    const elcboTipoDoc = document.getElementById("mdselTipoDoc");
    const valorcboTipoDoc = elcboTipoDoc.options[elcboTipoDoc.selectedIndex].value;

    const eltextNumeroCCTA = document.getElementById("mdtxtCCTA")
    const elcboBanco = document.getElementById("mdselBanco");    
    let valorcboBanco = elcboBanco.options[elcboBanco.selectedIndex].value;
    if (valorcboBanco === '') {
        valorcboBanco = 0;
    }
    
    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }
    let cambioPssCheck = 0;
    if (elchkCambioPass.checked == true) {
        cambioPssCheck = 1
    }
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    
    const dataEnviar = {
        usuarioId: idUsuario,
        usuarioAgenciaId: AgenciaId,
        usuarioNombre: eltxtNombrecompleto.value,
        usuarioEmail: eltxtCorreo.value,
        usuarioLogin: eltxtUsuario.value,
        usuarioPassword: eltxtPassword.value,
        usuarioDocumentoTipoId: parseInt(valorcboTipoDoc),
        usuarioDocumentoNumero: eltextNumeroDoc.value,
        usuarioPerfilId: valorelcboPerfil,
        usuarioPaisId: valorcboPais,
        usuarioValidoDesde: fechaFormateaDesde,
        usuarioValidoHasta: fechaFormateaHasta,
        usuarioActivo: estadoCheck,
        usuarioComentarios: eltxtComentario.value,
        usuarioActualizarContrasena: cambioPssCheck,
        usuarioBanco: parseInt(valorcboBanco),
        usuarioNumeroCuenta: eltextNumeroCCTA.value,
        usuarioCreadoUsuarioId: parseInt(menuUserId),
        usuarioOrigen: menuelOrigen
    };
    const resultado = await postUsuarioProcesar(dataEnviar);
    return resultado;
}
async function cargarCombos() {
    const elcomboPerfiles = await getPerfil(0, menuelOrigen);
    const elcomboPaises = await getPais(0, -1);
    const elcomboTipo = await getValoresTipo('agenciausuarioTipoDocumento', 1);
    const elcomboBanco = await getValoresTipo('entidadesBancarias', 1);
    if (elcomboPerfiles !== undefined) {
        let cantElementos01 = elcomboPerfiles.length;
        if (cantElementos01 > 0) {
            $('#mdselPerfil').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboPerfiles) {
                const perfilId = cboobj.perfilId;
                const perfilNombre = cboobj.perfilNombre;
                $('#mdselPerfil').append($('<option/>').attr("value", perfilId).text(perfilNombre));
            }
        }
    }
    if (elcomboPaises !== undefined) {
        let cantElementos02 = elcomboPaises.length;
        if (cantElementos02 > 0) {
            $('#mdselpais').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboPaises) {
                const paisId = cboobj.paisId;
                const paisNombre = cboobj.paisNombre;
                $('#mdselpais').append($('<option/>').attr("value", paisId).text(paisNombre));
            }
        }
    }
    if (elcomboTipo !== undefined) {
        let cantElementos03 = elcomboTipo.length;
        if (cantElementos03 > 0) {
            $('#mdselTipoDoc').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipo) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdselTipoDoc').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    if (elcomboBanco !== undefined) {
        let cantElementos04 = elcomboBanco.length;
        if (cantElementos04 > 0) {
            $('#mdselBanco').append($('<option/>').attr("value", "0").text('---Seleccione---'));
            for (const cboobj of elcomboBanco) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdselBanco').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
 
   
}

async function getUsuario(id, agencia, estado, origen) {
    const urlApiFecht = menuUrlApi + "configuracion/UsuarioAdminObtener";
    const urlParametro = "?pIdUsuario=" + id + "&pAgenciaId=" + agencia + "&pIdPerfil=0&pEstado=" + estado + "&pOrigen=" + origen;
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

async function postUsuarioProcesar(enviarBody) {
    const urlApiFecht = menuUrlApi + "configuracion/UsuarioAdminProcesar";
    console.log(enviarBody);
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


async function deleteUsuarioAnular(id,origen) {
    const urlApiFecht = menuUrlApi + "configuracion/UsuarioAdminAnular";
    const urlParametro = "?pIdUsuario=" + id + "&pOrigen=" + origen;
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

