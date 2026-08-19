
IniciarFechasBsuqueda();
cargarCombosBusqueda();
iniciarDataTable();
async function iniciarDataTable() {
    await CargarTodo();
    // await ActualizarChecks();
    await IniciarTablaClick();
}
async function procesarAtenderMasivo() {
    var checkSolicitud = [];
    const tablaGrid = $('#dtSolicitud').DataTable();
    let contador = 0;
    tablaGrid.rows().every(function () {
        var cell = this.node();
        var objeto = $(cell).find('input[type="checkbox"]')
        if (objeto.length > 0) {
            if (objeto[0].checked) {
                var row = cell.closest('tr');
                var idSolicitud = row.cells[2].innerText;
                var estado = row.cells[7].innerText;
                if (estado === 'POR ATENDER') {
                    checkSolicitud.push(idSolicitud);
                }
            }
        }
        contador += 1;
    });
    if (checkSolicitud.length == 0) {
        mostrarMensaje(2, "Por favor, seleccionar al menos una solicitud.");
    } else {
        const listaIdsMasivo = checkSolicitud.join(', ');
        const alerta = await swal({
            title: "¿Está seguro de atender las solicitudes seleccionadas?",
            text: "Una vez confirmado no se podra revertir el cambio.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: {
                ok: "confirmar",
                cancel: "cancelar",
            }
        });
        if (alerta == "ok") {
            const elLink = document.getElementById('lnkAtender');
            elLink.style.color = 'gray';  
            elLink.style.pointerEvents = 'none';
            const resultado = await postAtenderSolicitud(listaIdsMasivo, menuUserId);
            if (resultado.errorCodigo == 200) {
                CargarTodo()
                mostrarMensaje(1, resultado.errorDescripcion)
                elLink.style.color = '';
                elLink.style.pointerEvents = '';
                return false;
            } else {
                mostrarMensaje(2, resultado.errorDescripcion);
                elLink.style.color = ''; 
                elLink.style.pointerEvents = '';
                return false;
            }
        }
    }
}
async function procesarRechazarMasivo() {
    var checkSolicitud = [];
    const tablaGrid = $('#dtSolicitud').DataTable();
    let contador = 0;
    tablaGrid.rows().every(function () {
        var cell = this.node();
        var objeto = $(cell).find('input[type="checkbox"]')
        if (objeto.length > 0) {
            if (objeto[0].checked) {
                var row = cell.closest('tr');
                var idSolicitud = row.cells[2].innerText;
                var estado = row.cells[7].innerText;
                if (estado === 'POR ATENDER') {
                    checkSolicitud.push(idSolicitud);
                }
            }
        }
        contador += 1;
    });
    if (checkSolicitud.length == 0) {
        mostrarMensaje(2, "Por favor, seleccionar al menos una solicitud.");
    } else {
        const listaIdsMasivo = checkSolicitud.join(', ');
        const alerta = await swal({
            title: "¿Está seguro de rechazar las solicitudes seleccionadas?",
            text: "Una vez confirmado no se podra revertir el cambio.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: {
                ok: "confirmar",
                cancel: "cancelar",
            }
        });
        if (alerta == "ok") {
            const elLink = document.getElementById('lnkRechazar');
            elLink.style.color = 'gray';
            elLink.style.pointerEvents = 'none';
            const resultado = await deleteRechazarSolicitud(listaIdsMasivo, menuUserId);
            if (resultado.errorCodigo == 200) {
                CargarTodo()
                mostrarMensaje(1, resultado.errorDescripcion)
                elLink.style.color = '';
                elLink.style.pointerEvents = '';
                return false;
            } else {
                mostrarMensaje(2, resultado.errorDescripcion);
                elLink.style.color = '';
                elLink.style.pointerEvents = '';
                return false;
            }
        }
    }
}
async function IniciarTablaClick() {
    const tablaGrid = $('#dtSolicitud').DataTable();
    $('#dtSolicitud tbody').on('click', 'tr td', function () {
        const datavalor = tablaGrid.row(this).data();
        if (datavalor !== undefined) {
            const idRec = tablaGrid.row(this).data().solicitudId;
            const cellIndex = tablaGrid.column(this).index();
            const columna = tablaGrid.column(cellIndex).header().textContent
            if (columna !== "Acciones" && columna !== "") {
                AbrirModalConsulta(idRec)
            }
        }
    })
}
function join(date, options, separator) {
    function format(option) {
        let formatter = new Intl.DateTimeFormat('en', option);
        return formatter.format(date);
    }
    return options.map(format).join(separator);
}
async function AbrirModalConsulta(id) {
    document.getElementById('mdHidIdSolicTarjeta').value = id;
    const eltitulo = document.getElementById("tituloModalSolicitudRead");
    eltitulo.innerHTML = "Solicitud Nº " + id;
    const eltituloSec = document.getElementById("mdAtsolVerTitSecundario");
    const elnumeroSolicitud = document.getElementById("mdAtsolVerNumeroVenta");
    elnumeroSolicitud.innerHTML = id;
    let optionsVacia = [{ day: 'numeric' }, { month: 'numeric' }, { year: 'numeric' }];
    const dtfechaIniVacia = join(new Date(1900, 0, 1), optionsVacia, '/');
    const dtfechaFinVacia = join(new Date(1900, 0, 1), optionsVacia, '/');
    const listadoSolicitud = await getSolicitudes(menuelOrigen, 0, dtfechaIniVacia, dtfechaFinVacia, id, 0, 0, "", 0, 0);
    const eltipoSolicitud = document.getElementById("mdAtsolVerTipoSolicitud");
    const elusuarioSolicitud = document.getElementById("mdAtsolVerUsuario");
    const elestadoSolicitud = document.getElementById("mdAtsolVerEstado");
    eltipoSolicitud.innerHTML = listadoSolicitud[0].solicitudTipoNombre.toUpperCase();
    elusuarioSolicitud.innerHTML = listadoSolicitud[0].solicitudCreadoUsuarioNombre.toUpperCase();
    elestadoSolicitud.innerHTML = listadoSolicitud[0].solicitudEstadoNombre;
    const idTipoSolicitud = listadoSolicitud[0].solicitudTipoId.toString().toUpperCase();
    if (listadoSolicitud[0].solicitudEstadoId !== "P") {
        const eltituloresulesta = document.getElementById("mddivSoliTitulooResul");
        eltituloresulesta.innerHTML = "<b>" + (listadoSolicitud[0].solicitudEstadoId == "A" ? "ATENDIDO POR" : "ANULADO POR") + "</b> :"
        const elusuarioresulesta = document.getElementById("mddivSoliUsuarioResul");
        elusuarioresulesta.innerHTML = listadoSolicitud[0].solicitudAtendidoUsuarioNombre.toUpperCase();
        $('#mddivSoliEstadoResul').show();
        $('#btnSolicitarCambio').hide();
        $('#btnSolicitarRechazo').hide();
    } else {
        $('#mddivSoliEstadoResul').hide();
        $('#btnSolicitarCambio').show();
        $('#btnSolicitarRechazo').show();
    }
    document.getElementById('btnSolicitarCambio').removeAttribute("disabled");
    document.getElementById('btnSolicitarRechazo').removeAttribute("disabled");
    switch (idTipoSolicitud) {
        case '1':
            // Anular
            eltituloSec.innerHTML = "DATOS DE ANULACION";
            $('#mdAtsolVerDivAnular').show();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
            const elanulaobserv = document.getElementById("mdAtsolVerAnulaObserva");
            elanulaobserv.innerHTML = listadoSolicitud[0].solicitudMotivo
            const elanulamotivo = document.getElementById("mdAtsolVerAnulaMotivo");
            elanulamotivo.innerHTML = listadoSolicitud[0].solicitudMotivoAnulacionDescripcion;
            if (listadoSolicitud[0].solicitudAdjunto !== "") {
                $('#mdAtsolVerAnulaAdjunto').empty();
                const eldjuntodescargar = document.getElementById("mdAtsolVerAnulaAdjunto");
                const aDescarga = document.createElement("a");
                const rutaUrl = menuelapiUrlImagenes + "evidencias_eua/" + listadoSolicitud[0].solicitudAdjunto
                aDescarga.setAttribute("href", rutaUrl);
                aDescarga.setAttribute("target", "_blank");
                aDescarga.innerHTML = `Clic para ver adjunto`
                eldjuntodescargar.appendChild(aDescarga)
                $('#mdAtsolVerAnulaDivAdjunto').show();
            } else {
                $('#mdAtsolVerAnulaDivAdjunto').hide();
            }
            break;
        case '2':
            // Vigencia
            eltituloSec.innerHTML = "DATOS DE MODIFICACION DE VIGENCIA";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').show();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
            const lavigFechaIni = document.getElementById("mdAtsolVerVigenciaIni");
            const lavigFechaFin = document.getElementById("mdAtsolVerVigenciaFin");
            const fechaMomentIni = moment(listadoSolicitud[0].solicitudVigenciaFechaInicial, "YYYY-MM-DD");
            const dtfechaIni = fechaMomentIni.toDate();
            const fechaMomentFin = moment(listadoSolicitud[0].solicitudVigenciaFechaFinal, "YYYY-MM-DD");
            const dtfechaFin = fechaMomentFin.toDate();
            lavigFechaIni.innerHTML = formatearFechaString(dtfechaIni);
            lavigFechaFin.innerHTML = formatearFechaString(dtfechaFin);
            break;
        case '3':
            // Reactivacion
            eltituloSec.innerHTML = "DATOS DE REACTIVACION";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').show();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
            const elreacobserv = document.getElementById("mdAtsolVerReactObserva");
            elreacobserv.innerHTML = listadoSolicitud[0].solicitudMotivo;
            const elreacmotivo = document.getElementById("mdAtsolVerReactMotivo");
            elreacmotivo.innerHTML = listadoSolicitud[0].solicitudMotivoAnulacionDescripcion;;
            break;
        case '4':
            // Traslado
            eltituloSec.innerHTML = "DATOS DE TRANSLADO";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').show();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
            const eltrasAgencia = document.getElementById("mdAtsolVerTrasAgencia");
            eltrasAgencia.innerHTML = listadoSolicitud[0].solicitudAgenciaNombre.toUpperCase();
            const eltrasUsuario = document.getElementById("mdAtsolVerTrasUsuario");
            eltrasUsuario.innerHTML = listadoSolicitud[0].solicitudAgenciaUsuarioNombre.toUpperCase();
            break;
        case '5':
            // Cliente
            eltituloSec.innerHTML = "DATOS DE MODIFICACION DE CLIENTE";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').show();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
            const elclienNombres = document.getElementById("mdAtsolVerClienNombApell");
            elclienNombres.innerHTML = (listadoSolicitud[0].solicitudClienteNombres + " " + listadoSolicitud[0].solicitudClienteApellidos).toUpperCase();
            const elclienDireccion = document.getElementById("mdAtsolVerClienDirec");
            elclienDireccion.innerHTML = (listadoSolicitud[0].solicitudClienteDireccion + " - " + listadoSolicitud[0].solicitudClienteDistrito).toUpperCase();
            const elclienTipoDoc = document.getElementById("mdAtsolVerClienTipoDoc");
            elclienTipoDoc.innerHTML = "<b>" + listadoSolicitud[0].solicitudClienteDocumentoTipoNombre.toUpperCase() + "</b> :";
            const elclienNumDoc = document.getElementById("mdAtsolVerClienDoc");
            elclienNumDoc.innerHTML = listadoSolicitud[0].solicitudClienteDocumentoNumero;
            const elclienCiudad = document.getElementById("mdAtsolVerClienCiudad");
            elclienCiudad.innerHTML = listadoSolicitud[0].solicitudClienteCiudad;
            const elclienMovil = document.getElementById("mdAtsolVerClienMovil");
            elclienMovil.innerHTML = listadoSolicitud[0].solicitudClienteTelefono;
            const elclienFecNac = document.getElementById("mdAtsolVerClienFecNac");
            const fechaMomentFecNac = moment(listadoSolicitud[0].solicitudClienteFechaNacimiento, "YYYY-MM-DD");
            const dtfechaFecNac = fechaMomentFecNac.toDate();
            elclienFecNac.innerHTML = formatearFechaString(dtfechaFecNac);
            const elclienEdad = document.getElementById("mdAtsolVerClienEdad");
            elclienEdad.innerHTML = listadoSolicitud[0].solicitudClienteEdad;
            const elclienPais = document.getElementById("mdAtsolVerClienPais");
            elclienPais.innerHTML = listadoSolicitud[0].solicitudClientePais.toUpperCase();
            break;
        case '6':
            // Emergencia
            eltituloSec.innerHTML = "DATOS DE MODIFICACION DE CONTACTO";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').show();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
            const elemerNombres = document.getElementById("mdAtsolVerEmerNombApell");
            elemerNombres.innerHTML = listadoSolicitud[0].solicitudContactoNombre.toUpperCase();
            const elemerDireccion = document.getElementById("mdAtsolVerEmerDirec");
            elemerDireccion.innerHTML = listadoSolicitud[0].solicitudContactoDireccion.toUpperCase();
            const elemerDistrito = document.getElementById("mdAtsolVerEmerDistr");
            elemerDistrito.innerHTML = listadoSolicitud[0].solicitudContactoDistrito.toUpperCase();
            const elemerPais = document.getElementById("mdAtsolVerEmerPais");
            elemerPais.innerHTML = listadoSolicitud[0].solicitudContactoPais.toUpperCase();
            const elemerTelefono = document.getElementById("mdAtsolVerEmerMovil");
            elemerTelefono.innerHTML = listadoSolicitud[0].solicitudContactoTelefono;
            const elemerCorreo = document.getElementById("mdAtsolVerEmerCorreo");
            elemerCorreo.innerHTML = listadoSolicitud[0].solicitudContactoEmail;
            break;
        case '7':
            // Importe
            eltituloSec.innerHTML = "DATOS DE MODIFICACION DE IMPORTE";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').show();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
            const elimpProducto = document.getElementById("mdAtsolVerImpoProd");
            elimpProducto.innerHTML = listadoSolicitud[0].solicitudProductoNombre;
            const elimpCosto = document.getElementById("mdAtsolVerImpoCosto");
            elimpCosto.innerHTML = listadoSolicitud[0].solicitudVentaImporte;
            break;
        case '8':
            // Tarjetas Free
            eltituloSec.innerHTML = "DATOS DE MODIFICACION DE TARJETAS FREE";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').show();
            $('#mdAtsolVerDivProducto').hide();
            const eltarProducto = document.getElementById("mdAtsolVerTarjeProd");
            eltarProducto.innerHTML = listadoSolicitud[0].solicitudProductoNombre;
            const eltarCosto = document.getElementById("mdAtsolVerTarjeCosto");
            eltarCosto.innerHTML = listadoSolicitud[0].solicitudVentaImporte;
            break;
        case '10':
            // Producto
            eltituloSec.innerHTML = "DATOS DE MODIFICACION DE PRODUCTO";
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').show();
            const lavigFechaIniPro = document.getElementById("mdAtsolVerProdFecIni");
            const lavigFechaFinPro = document.getElementById("mdAtsolVerProdFecFin");
            const fechaMomentIniPro = moment(listadoSolicitud[0].solicitudVigenciaFechaInicial, "YYYY-MM-DD");
            const dtfechaIniPro = fechaMomentIniPro.toDate();
            const fechaMomentFinPro = moment(listadoSolicitud[0].solicitudVigenciaFechaFinal, "YYYY-MM-DD");
            const dtfechaFinPro = fechaMomentFinPro.toDate();
            lavigFechaIniPro.innerHTML = formatearFechaString(dtfechaIniPro);
            lavigFechaFinPro.innerHTML = formatearFechaString(dtfechaFinPro);
            const elimpCostoPro = document.getElementById("mdAtsolVerProdCosto");
            elimpCostoPro.innerHTML = listadoSolicitud[0].solicitudVentaImporte;
            const elProductoCambio = document.getElementById("mdAtsolVerProdNombre");
            elProductoCambio.innerHTML = listadoSolicitud[0].solicitudProductoNombreCambio;
            break;
        default:
            // Limpia todo
            $('#mdAtsolVerDivAnular').hide();
            $('#mdAtsolVerDivVigencia').hide();
            $('#mdAtsolVerDivReact').hide();
            $('#mdAtsolVerDivTras').hide();
            $('#mdAtsolVerDivCliente').hide();
            $('#mdAtsolVerDivEmerge').hide();
            $('#mdAtsolVerDivImporte').hide();
            $('#mdAtsolVerDivTarjeta').hide();
            $('#mdAtsolVerDivProducto').hide();
    }
    $('#popupModalSolicitudRead').modal('show');
}
async function clickAtender() {
    const alerta = await swal({
        title: "¿Está seguro de atender la solicitud?",
        text: "Una vez confirmado no se podra revertir el cambio.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        document.getElementById('btnSolicitarCambio').setAttribute("disabled", "disabled");
        const resultado = await postAtenderSolicitud(document.getElementById('mdHidIdSolicTarjeta').value, menuUserId);
        if (resultado.errorCodigo == 200) {
            CargarTodo()
            $('#popupModalSolicitudRead').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            document.getElementById('btnSolicitarCambio').removeAttribute("disabled");
            return false;
        }
    }
}
async function clickRechazar() {
    const alerta = await swal({
        title: "¿Está seguro de rechazar la solicitud?",
        text: "Una vez confirmado no se podra revertir el cambio.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: {
            ok: "confirmar",
            cancel: "cancelar",
        }
    });
    if (alerta == "ok") {
        document.getElementById('btnSolicitarRechazo').setAttribute("disabled", "disabled");
        const resultado = await deleteRechazarSolicitud(document.getElementById('mdHidIdSolicTarjeta').value, menuUserId);
        if (resultado.errorCodigo == 200) {
            CargarTodo()
            $('#popupModalSolicitudRead').modal('hide');
            mostrarMensaje(1, resultado.errorDescripcion)
            return false;
        } else {
            mostrarMensaje(2, resultado.errorDescripcion);
            document.getElementById('btnSolicitarRechazo').removeAttribute("disabled");
            return false;
        }
    }
}
async function postAtenderSolicitud(pIds, pUsuario) {
    const urlApiFecht = menuUrlApi + "Solicitud/SolicitudAtender";
    const urlParametro = "?pSolicitudIds=" + pIds + "&pSolicitudUsuarioId=" + pUsuario;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'POST',
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
async function deleteRechazarSolicitud(pIds, pUsuario) {
    const urlApiFecht = menuUrlApi + "Solicitud/SolicitudRechazar";
    const urlParametro = "?pSolicitudIds=" + pIds + "&pSolicitudUsuarioId=" + pUsuario;
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
var groupColumn = 1;
async function CargarTodo() {
    const sUrlIdioma = "/travel/spanish.json"
    let botonVisualizar;
    let tablaGrid = $("#dtSolicitud").DataTable({
        "columnDefs": [
            { className: "seleccionar text-nowrap", targets: "_all" },
            {
                orderable: false,
                render: DataTable.render.select(),
                targets: 0
            }
        ],
        "order": [["6", "asc"]],
        "data": [],
        "aoColumns": [
            {
                "sDefaultContent": '',
            },
            {
                "mData": "solicitudAgenciaNombre", "bVisible": false
            }, {
                "mData": "solicitudCreadoFecha", "render": function (mData, disp, alldata) {
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
                "mData": "solicitudId", "render": function (mData, disp, alldata) {
                    botonVisualizar = "<li class='info'><a href='javascript:void(0);' onclick='AbrirModalConsulta(" + alldata.solicitudId + ");'><i class='icon-eye'></i></a></li>"
                    return mData
                }
            }, {
                "mData": "solicitudCreadoUsuarioNombre"
            }, {
                "mData": "solicitudVentaId"
            }, {
                "mData": "solicitudTipoNombre"
            }, {
                "mData": "solicitudMotivo"
            }, {
                "mData": "solicitudEstadoNombre"
            }, {
                "mData": "solicitudAtendidoFecha", "render": function (mData, disp, alldata) {
                    const strfechaDesde = mData;
                    const fechaDesdeMoment = moment(strfechaDesde, "YYYY-MM-DD");
                    const dtfechaDesde = fechaDesdeMoment.toDate();
                    const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
                    const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
                    const strfechaDesdeAnh = dtfechaDesde.getFullYear();
                    let strfechaDesdeFin = strfechaDesdeDia + "/" + strfechaDesdeMes + "/" + strfechaDesdeAnh;
                    if (strfechaDesdeFin == '01/01/1') {
                        strfechaDesdeFin = "";
                    }
                    return strfechaDesdeFin
                }
            }, {
                "mData": "solicitudAtendidoUsuarioNombre"
            }, {
                "mData": null, "defaultContent": [0], "className": "text-center",
                "render": function (mData) {
                    return "<ul class='action'>" + botonVisualizar + "</ul>";
                }
            }
        ],
        "language": {
            "url": sUrlIdioma
        },
        "deferRender": false,
        rowCallback: function (row, data) {
        },
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(groupColumn, { page: 'current' })
                .data()
                .each(function (group, i) {
                    if (last !== group) {
                        $(rows)
                            .eq(i)
                            .before(
                                '<tr class="group"><td colspan="14">' +
                                group +
                                '</td></tr>'
                            );

                        last = group;
                    }
                });
        },
        filter: true,
        pageLength: 50,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        bInfo: false,
        info: false,
        ordering: true,
        processing: true,
        responsive: true,
        "autoWidth": false,
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        retrieve: true,
        orderCellsTop: true,
        scrollY: "500px",
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


    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }

    const BusquedaNumTarjeta = document.getElementById("mdvenNumTarjetaSearch").value;
    const BusquedaNumSolicitud = document.getElementById("mdvenCodSolicitudSearch").value;
    const BusquedaTipo = document.getElementById("mdvenSelTipoSearch").value;
    const BusquedaCodEstado = document.getElementById("mdvenSelEstadoSearch").value;
    const BusquedaCodAgencia = document.getElementById("txtAgencia").value;
    const BusquedaCodAgenciaUsuario = document.getElementById("mdvenSelUsuarioSearch").value;

    let CodigoBusqueda = 0;
    if (BusquedaNumTarjeta !== "") {
        CodigoBusqueda = parseInt(BusquedaNumTarjeta);
    } else {
        CodigoBusqueda = 0;
    }

    let SolicitudBusqueda = 0;
    if (BusquedaNumSolicitud !== "") {
        SolicitudBusqueda = parseInt(BusquedaNumSolicitud);
    } else {
        SolicitudBusqueda = 0;
    }

    let AgenciaUsuarioBusqueda = 0;
    if (BusquedaCodAgenciaUsuario !== "") {
        AgenciaUsuarioBusqueda = parseInt(BusquedaCodAgenciaUsuario);
    } else {
        AgenciaUsuarioBusqueda = 0;
    }

    let TipoBusqueda = 0;
    if (BusquedaTipo !== "") {
        TipoBusqueda = parseInt(BusquedaTipo);
    } else {
        TipoBusqueda = 0;
    }
    let AgenciaBusqueda = 0;
    if (BusquedaCodAgencia === "" || BusquedaCodAgencia == null) {
        AgenciaBusqueda = 0;
    } else {
        AgenciaBusqueda = parseInt(localStorage.getItem("lssolicitudSel"));
    }   

    const BusquedaFechaIni = document.getElementById("mdvenFecIncioVigSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalVigSearch").value;
    const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
    const dtfechaIni = fechaIniMoment.toDate();
    const dtfechaVigINI = formatearFechaString(dtfechaIni);
    const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
    const dtfechaFin = fechaFinMoment.toDate();
    const dtfechaVigFIN = formatearFechaString(dtfechaFin);
    const listadoVentas = await getSolicitudes(menuelOrigen, menuUserId, dtfechaVigINI, dtfechaVigFIN, SolicitudBusqueda, CodigoBusqueda, TipoBusqueda, BusquedaCodEstado, AgenciaBusqueda, AgenciaUsuarioBusqueda);
    if (listadoVentas !== undefined) {
        if (listadoVentas.length > 0) {
            tablaGrid.clear().draw();
            tablaGrid.rows.add(listadoVentas).draw();
            tablaGrid.rows().every(function () {
                var cell = this.node();
                var objeto = $(cell).find('input[type="checkbox"]')
                if (objeto.length > 0) {
                    var row = cell.closest('tr');
                    var estado = row.cells[7].innerText;
                    if (estado !== 'POR ATENDER') {
                        objeto.prop('disabled', true);
                        objeto.removeClass('dt-select-checkbox'); 
                    }
                }
            });
        }
    } else {
        const listadoVacio = [];
        tablaGrid.clear().draw();
        tablaGrid.rows.add(listadoVacio).draw();
    }
}
async function getSolicitudes(pOrigen, pUsuarioId, pfechaIni, pfechaFin, pSolicitudId, pVentaId, pTipoId, pEstado, pAgenciaId, pAgenciaUsuarioId) {
    const urlApiFecht = menuUrlApi + "Venta/SolicitudObtener";
    const urlParametro = "?str_pOrigen=" + pOrigen + "&int_pSolicitudUsuarioId=" + pUsuarioId +"&dte_pSolicitudIngresoInicio=" + pfechaIni + "&dte_pSolicitudIngresoFin=" + pfechaFin + "&int_pSolicitudId=" + pSolicitudId + "&int_pSolicitudVentaId=" + pVentaId + "&int_pSolicitudTipoId=" + pTipoId + "&str_pSolicitudEstadoId=" + pEstado + "&int_pSolicitudAgenciaId=" + pAgenciaId + "&int_pSolicitudAgenciaUsuarioId=" + pAgenciaUsuarioId;
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
async function AbrirModalBusqueda() {
    $('#popupModalSolicitudSearch').modal('show');
}
async function cargarCombosBusqueda() {
    const elcomboSolicitud = await getSolicitudTipo(0, 1, menuPerfilId);
    if (elcomboSolicitud !== undefined) {
        let cantElementos01 = elcomboSolicitud.length;
        if (cantElementos01 > 0) {
            $('#mdvenSelTipoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboSolicitud) {
                const valorId = cboobj.solicitudtipoId;
                const valorNombre = cboobj.solicitudtipoNombre;
                $('#mdvenSelTipoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboEstado = await getValoresTipo('solicitudEstadoId', 1);
    if (elcomboEstado !== undefined) {
        let cantElementos02 = elcomboEstado.length;
        if (cantElementos02 > 0) {
            $('#mdvenSelEstadoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboEstado) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdvenSelEstadoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
    const elcomboAgencia = await getAgencia(0, 1, 0, 0,'','');
    if (elcomboAgencia !== undefined) {
        let cantElementos03 = elcomboAgencia.length;
        if (cantElementos03 > 0) {
            var dataSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: elcomboAgencia
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
                localStorage.setItem("lssolicitudSel", selection.agenciaId); // Guarda el ID
            });
        }
    }
}
$('#mdvenSelAgenciaSearch').change(async function () {
    const AgenciaId = $(this).val();
    const elcomboAgenciaUsuarios = await getAgenciaUsuario(AgenciaId, 0, 1);
    if (elcomboAgenciaUsuarios !== undefined) {
        let cantElementos04 = elcomboAgenciaUsuarios.length;
        if (cantElementos04 > 0) {
            $('#mdvenSelUsuarioSearch').empty();
            $('#mdvenSelUsuarioSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboAgenciaUsuarios) {
                const valorId = cboobj.agenciausuarioId;
                const valorNombre = cboobj.agenciausuarioNombre;
                $('#mdvenSelUsuarioSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        } else {
            $('#mdvenSelUsuarioSearch').empty();
        }
    } else {
        $('#mdvenSelUsuarioSearch').empty();
    }
});
async function getSolicitudTipo(id, estado, perfil) {
    const urlApiFecht = menuUrlApi + "mantenimiento/SolicitudTipoObtener";
    const urlParametro = "?int_pSolicitudTipoID=" + id + "&int_pSolicitudTipoActivo=" + estado + "&int_pSolicitudPerfilId=" + perfil;
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
async function getAgencia(id, estado, paisId, promotor, ruc, login) {
    const urlApiFecht = menuUrlApi + "configuracion/AgenciaObtener";
    const urlParametro = "?int_pAgenciaID=" + id + "&int_pAgenciaActivo=" + estado + "&int_pAgenciaPerfilId=0&int_pAgenciaPromotorId=" + promotor + "&int_pAgenciaPaisId=" + paisId;
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
async function limpiarModalBuqueda() {
    IniciarFechasBsuqueda();
    document.getElementById("mdvenNumTarjetaSearch").value = "";
    document.getElementById("mdvenCodSolicitudSearch").value = "";
    document.getElementById("mdvenSelTipoSearch").value = "";
    document.getElementById("mdvenSelEstadoSearch").value = "";
    document.getElementById("txtAgencia").value = "";
    document.getElementById("mdvenSelUsuarioSearch").value = "";
    localStorage.removeItem('lssolicitudSelVenta');
    $('#mdvenSelUsuarioSearch').empty();
}
async function clickBuscarLimpiar() {
    limpiarModalBuqueda();
}
async function clickBuscarVentas() {
    CargarTodo()
    $('#popupModalSolicitudSearch').modal('hide');
    IniciarTablaClick();
}
async function IniciarFechasBsuqueda() {
    const fechaHoy = new Date();
    const dtfechaHoy = new Date(fechaHoy.setDate(fechaHoy.getDate()));
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;

    const fechaMes = new Date();
    const fecha1mes = new Date(fechaMes.setDate(fechaMes.getDate()));
    const strfecha1mesDia = ("0" + fecha1mes.getDate()).slice(-2)
    const strfecha1mesMes = ("0" + (fecha1mes.getMonth() + 1)).slice(-2)
    const strfecha1mesAnh = fecha1mes.getFullYear();
    const strfecha1mesFin = strfecha1mesAnh + "-" + strfecha1mesMes + "-" + strfecha1mesDia;

    document.getElementById("mdvenFecIncioVigSearch").value = strfecha1mesFin;
    document.getElementById("mdvenFecFinalVigSearch").value = strfechaHoyFin;
}