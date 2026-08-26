function mostrarMensaje(tipo, mensaje, element) {
    if (tipo == 1) {
        swal({
            position: "top-right",
            icon: "success",
            title: "Mensaje del sistema",
            text: mensaje,
            buttons: false,
            timer: 2000
        });
    } else if (tipo == 2) {
        swal({
            title: "Se produjo un incidente",
            text: mensaje,
            icon: "error"
        });
    } else if (tipo == 3) {
        swal({
            title: "Por favor, validar datos",
            text: mensaje,
            icon: "warning"
        });
    } else if (tipo == 4) {
        swal({
            title: "Por favor, validar datos",
            text: mensaje,
            icon: "warning",
            buttons: false,
            timer: 2000
        });
    } else if (tipo == 5) {
        swal({
            title: "Por favor, validar datos",
            text: mensaje,
            icon: "warning"
        }).then((result) => {
            if (result === true || result === null) {
                elementoFocus(element);
            }
        });
    }
    return false;
}
function elementoFocus(element) {
    $("#" + element + "").focus().select();
}
async function getValoresTipo(campo, estado, id='0') {
    const urlApiFecht = menuUrlApi + "mantenimiento/ValorObtener";
    const urlParametro = "?pValorNombreCampo=" + campo + "&pValorActivo=" + estado + "&pValorId=" + id;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectvalores = await response.json()
        if (objectvalores.length > 0) {
            //console.log(objectvalores);
            return objectvalores;
        }
    }
}
async function getValoresAsesor(id,empresa) {
    const urlApiFecht = menuUrlApi + "mantenimiento/AsesorObtener";
    const urlParametro = "?idperfil=" + id + "&idempresa=" + empresa;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectvalores = await response.json()
        if (objectvalores.length > 0) {
            //console.log(objectvalores);
            return objectvalores;
        }
    }
}
async function getDireciones(tipo, depa, prov, dist, ubigeo) {
    const urlApiFecht = menuUrlApi + "generales/DireccionObtener";
    const urlParametro = "?pTipoID=" + tipo + "&pDepa=" + depa + "&pProv=" + prov + "&pDist=" + dist + "&pUbigeo=" + ubigeo;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectvalores = await response.json()
        if (objectvalores.length > 0) {
           // console.log(objectvalores);
            return objectvalores;
        }
    }
}
function generarCodigoTemporal() {
    let min = 100000000, max = 999999999
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}
async function generarCodigoCorrelativo(columna) {
    const urlApiFecht = menuUrlApi + "generales/CorrelativoObtener";
    const urlParametro = "?pColumna=" + columna;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const object11 = await response.json()
        return object11;
    }
}
async function getMarca(id, estado) {
    const urlApiFecht = menuUrlApi + "mantenimientos/MarcaObtener";
    const urlParametro = "?pMarcaID=" + id + "&pMarcaActivo=" + estado;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectomarca = await response.json()
        if (objectomarca.length > 0) {
            //console.log(objectomarca);
            return objectomarca;
        }
    }
}
async function getModelo(id, marca, estado) {
    const urlApiFecht = menuUrlApi + "mantenimientos/ModeloObtener";
    const urlParametro = "?pModeloID=" + id + "&pModeloMarcaId=" + marca; + "&pModeloActivo=" + estado;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectmodelo = await response.json()
        if (objectmodelo.length > 0) {
            //console.log(objectmodelo);
            return objectmodelo;
        }
    }
}
async function getCliente(id, estado, numdoc, razonsocial) {
    const urlApiFecht = menuUrlApi + "mantenimientos/ClienteObtener";
    const urlParametro = "?pClienteID=" + id + "&pClienteActivo=" + estado + "&pClienteDocumentoNumero=" + numdoc + "&pCLIENTE_razonSocial=" + razonsocial;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            //console.log(object3);
            return object3;
        }
    }
}
async function getVehiculo(id, clienteId, placa, estado) {
    const urlApiFecht = menuUrlApi + "mantenimientos/ClienteVehiculoObtener";
    const urlParametro = "?pClienteVehiculoId=" + id + "&pClienteVehiculoClienteId=" + clienteId + "&pClienteVehiculoPlazaNumero=" + placa + "&pClienteVehiculoActivo=" + estado;
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
        //console.log(responseError);
        return []
    } else if (response.status === 200) {
        const object3 = await response.json()
        return object3;
    }
}
async function getValidaPlaca(id, placa) {
    const urlApiFecht = menuUrlApi + "mantenimientos/PlacaValidar";
    const urlParametro = "?pClienteID=" + id + "&pClientePlaca=" + placa;
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
        //console.log(responseError);
        const responseError2 = {
            codigo: 400,
            descripcion: 'Vacio',
        };
        return responseError2
    } else if (response.status === 200) {
        const object3 = await response.json()
        return object3;
    }
}
async function getActividadTareas(id, idot) {
    const urlApiFecht = menuUrlApi + "ordenTrabajo/OrdenTrabajoTareaObtener";
    const urlParametro = "?pOrdenTrabajoIDtarea=" + id + "&pOrdenTrabajoId=" + idot;
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
        //console.log(responseError);
        const responseError2 = {
            codigo: 400,
            descripcion: 'Vacio',
        };
        return responseError2
    } else if (response.status === 200) {
        const object3 = await response.json()
        return object3;
    }
}

async function getValidarAcceso(correo, pass) {
    const urlApiFecht = menuUrlApi + "accesos/Login";
    const urlParametro = "?pUsuario=" + correo + "&pClave=" + pass;
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
        //console.log(responseError);
        return responseError;
    } else if (response.status === 200) {
        const objectvalores = await response.json()
        return objectvalores;
    }
}
const ProcesarPass = async () => {
    const PassOld = document.getElementById("hhmdtxtPassActual");
    const ValiNew = document.getElementById("hdmdtxtPassRep");
    const resultadoPrevio = await getValidarAcceso(menuUserAcc, PassOld.value);
    if (resultadoPrevio.usuarioId > 0) {
        const resultadoFinal = await putCambiarPassword(menuelOrigen, resultadoPrevio.usuarioId, ValiNew.value);
        if (resultadoFinal.codigo == 200) {
            $('#ModalCambiarContrasena').modal('hide');
            mostrarMensaje(1, resultadoFinal.descripcion)
            return false;
        } else {
            mostrarMensaje(3, resultadoFinal.errorDescripcion);
            return false;
        }
    } else {
        mostrarMensaje(2, resultadoPrevio.errorDescripcion);
        return false;
    }
}
async function putCambiarPassword(origen, idusuario, password) {
    const urlApiFecht = menuUrlApi + "configuracion/UsuarioCambiarPassword";
    const urlParametro = "?pUsuarioOrigen=" + origen +"&pIdUsuario=" + idusuario + "&pNuevoPassword=" + password;
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        },
    })
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        return responseError;
    } else if (response.status === 200) {
        const object = await response.json()
        return object;
    }
}


async function getValidarUsuarioMenu(UsuarioId,MenuId) {
    const urlApiFecht = menuUrlApi + "generales/UsuarioValidarMenuObtener";
    const urlParametro = "?pIdUsuario=" + UsuarioId + "&pMenuId=" + MenuId;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectvalores = await response.json()
        return objectvalores
    }
}
async function getMoneda(id) {
    const urlApiFecht = menuUrlApi + "generales/MonedaObtener";
    const urlParametro = "?pMonedaID=" + id;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectomarca = await response.json()
        if (objectomarca.length > 0) {
           // console.log(objectomarca);
            return objectomarca;
        }
    }
}


function htmlEncode(input) {
    if (input == '' || input == undefined) {
        return '';
    }
    else {    
    return input        
        .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}
///NUEVO CODIGO
async function getPerfil(id, origen) {
    const urlApiFecht = menuUrlApi + "configuracion/PerfilObtener";
    const urlParametro = "?pIdPerfil=" + id + "&pPerfilOrigen=" + origen;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectomarca = await response.json()
        if (objectomarca.length > 0) {
            //console.log(objectomarca);
            return objectomarca;
        }
    }
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectomarca = await response.json()
        if (objectomarca.length > 0) {
            //console.log(objectomarca);
            return objectomarca;
        }
    }
}


async function getPromotoresPais(UsuarioId, PaisId) {
    const urlApiFecht = menuUrlApi + "generales/PromotorPaisObtener";
    const urlParametro = "?pIdUsuario=" + UsuarioId + "&pIdPais=" + PaisId;
    //console.log(urlApiFecht + urlParametro);
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectomarca = await response.json()
        if (objectomarca.length > 0) {
            //console.log(objectomarca);
            return objectomarca;
        }
    }
}

async function getPasajero(tipo, numero) {
    const urlApiFecht = menuUrlApi + "generales/PasajeroObtener";
    const urlParametro = "?pPasajero_DocumentoTipo=" + tipo + "&pPasajero_DocumentoNumero=" + numero;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectopasajero = await response.json()
        if (objectopasajero.length > 0) {
            //console.log(objectopasajero);
            return objectopasajero;
        }
    }
}
async function getAgenciaUsuario(agencia, supervisor, incluir) {
    const urlApiFecht = menuUrlApi + "generales/AgenciaUsuarioObtener";
    const urlParametro = "?pAgenciaID=" + agencia + "&pAgenciaUsuarioId=0&pAgenciaUsuarioSupervisorId=" + supervisor + "&pAgenciaUsuarioPerfilId=0&pAgenciaUsuarioActivo=-1&pAgenciaUsuarioIncluirAgencia=" + incluir;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectopasajero = await response.json()
        if (objectopasajero.length > 0) {
            //console.log(objectopasajero);
            return objectopasajero;
        }
    }
}
async function getVentaImpresion(venta) {
    const urlApiFecht = menuUrlApi + "generales/VentaPrecioImpresion";
    const urlParametro = "?pVentaID=" + venta;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectopasajero = await response.json()
        if (objectopasajero.length > 0) {
            //console.log(objectopasajero);
            return objectopasajero;
        }
    }
}
async function getJerarquiaPromotor(usuario) {
    const urlApiFecht = menuUrlApi + "venta/JerarquiaPromotorObtener";
    const urlParametro = "?pUusarioID=" + usuario;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectopasajero = await response.json()
        if (objectopasajero.length > 0) {
           // console.log(objectopasajero);
            return objectopasajero;
        }
    }
}
async function getUbigeo(ubigeo, pais, estado) {
    const urlApiFecht = menuUrlApi + "generales/UbigeiObtener";
    const urlParametro = "?pUbigeoId=" + ubigeo + "&pUbigeoPaisId=" + pais + "&pUbigeoActivo=" + estado;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectopasajero = await response.json()
        if (objectopasajero.length > 0) {
            //console.log(objectopasajero);
            return objectopasajero;
        }
    }
}
function formatearFechaString(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

async function getAgencia(id, estado, paisId,promotor,ruc,login) {
    const urlApiFecht = menuUrlApi + "configuracion/AgenciaObtener";
    const urlParametro = "?int_pAgenciaID=" + id + "&int_pAgenciaActivo=" + estado + "&int_pAgenciaPerfilId=0&int_pAgenciaPromotorId=" + promotor + "&int_pAgenciaPaisId=" + paisId + "&str_AgenciaLogin=" + login + "&str_AgenciaRuc=" + ruc;
    //console.log(urlApiFecht + urlParametro);
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
            console.log(object3);
            return object3;
        }
    }
}

async function getProducto(id, estado, paisId, agenciaId) {
    // Validazione e default per agenciaId
    const agenciaIdValue = agenciaId !== undefined && agenciaId !== null && agenciaId !== '' ? agenciaId : 0;

    const urlApiFecht = menuUrlApi + "mantenimiento/ProductosObtener";
    const urlParametro = `?int_pProductoID=${id}&int_pProductoActivo=${estado}&int_pProductoPaisId=${paisId}&int_pProductoGrupalActivo=0&int_pProductoPromocionActivo=0&int_pProductoAgenciaID=${agenciaIdValue}`;
    const controller = new AbortController();
    const timeoutMs = 10000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(urlApiFecht + urlParametro, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${menuToken}`,
            },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            const errorBody = await response.text().catch(() => response.statusText);
            console.error('API error', response.status, errorBody);
            throw { status: response.status, body: errorBody };
        }

        const data = await response.json();
        return Array.isArray(data) ? data : data ? [data] : [];
    } catch (err) {
        if (err.name === 'AbortError') {
            console.error('Request timeout');
            throw new Error('timeout');
        }
        console.error('Fetch error', err);
        throw err;
    }
}

async function getPromocion(paisId, promocionId, agenciaId, estado) {
    const urlApiFecht = menuUrlApi + "mantenimiento/PromocionObtener";
    const urlParametro = "?int_pPromocionPaisId=" + paisId + "&int_pActivoID=" + estado + "&int_pPromocionID=" + promocionId + "&int_pAgenciaID=" + agenciaId;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const object3 = await response.json()
        if (object3.length > 0) {
           // console.log(object3);
            return object3;
        }
    }
}

async function getComision(numero) {
    const urlApiFecht = menuUrlApi + "mantenimiento/AgenciaComisionObtener";
    const urlParametro = "?int_pCodLiquidacion=" + numero;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectopasajero = await response.json()
        if (objectopasajero.length > 0) {
            //console.log(objectopasajero);
            return objectopasajero;
        }
    }
}

async function getOrigenDestino(origen) {
    const urlApiFecht = menuUrlApi + "configuracion/PaisOrigenDestinoObtener";
    const urlParametro = "?int_pOrigenID=" + origen;
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
        //console.log(responseError);
    } else if (response.status === 200) {
        const objectopasajero = await response.json()
        if (objectopasajero.length > 0) {
            //console.log(objectopasajero);
            return objectopasajero;
        }
    }
}

$(document).ready(function () {
    var $target = $('.active');
    if ($target.length > 0) {
        // Obtenemos la instancia de SimpleBar del contenedor principal
        var simpleBarInstance = SimpleBar.instances.get(document.querySelector('.sidebar-links'));

        // Si no existe aún la instancia, salimos
        if (!simpleBarInstance) return;

        // Obtenemos el elemento que tiene el scroll real
        var scrollElement = simpleBarInstance.getScrollElement();

        // Creamos variables jQuery para facilidad
        var $scrollElement = $(scrollElement);
        var $container = $(simpleBarInstance.el);

        // Calculamos el offset necesario para centrar el .active
        var offsetTop = $target.offset().top - $container.offset().top
            + $scrollElement.scrollTop()
            - ($scrollElement.height() / 2)
            + ($target.outerHeight() / 2);

        // Evitamos valores negativos
        if (offsetTop < 0) offsetTop = 0;

        // Hacemos la animación
        $($scrollElement).animate({
            scrollTop: offsetTop
        }, 800);
    }
});

$(document).on('click', '.btn-copiar-fecha', async function () {
    const $boton = $(this);
    const $icono = $boton.find('i');
    const targetId = $boton.data('copy-target');
    const valor = $('#' + targetId).val();
    if (!valor) {
        return;
    }
    try {
        await navigator.clipboard.writeText(valor);
    } catch (e) {
        const $temporal = $('<input>').val(valor).appendTo('body').select();
        document.execCommand('copy');
        $temporal.remove();
    }
    $icono.removeClass('fa-copy').addClass('fa-check');
    setTimeout(function () {
        $icono.removeClass('fa-check').addClass('fa-copy');
    }, 1500);
});

// Exporta el contenido visible/filtrado de una tabla DataTables a Excel o PDF.
// La última columna de cada uno de los reportes de Ventas es siempre el importe/cantidad,
// por lo que se formatea numéricamente sin necesidad de conocer el layout exacto de cada reporte.
function exportarReporteTabla(tableId, tipo, filenamePrefix, anio) {
    const table = $('#' + tableId).DataTable();
    if (!table || !table.rows({ search: 'applied' }).count()) {
        swal("Aviso", "No hay datos para exportar", "warning");
        return;
    }
    const filename = anio ? filenamePrefix + '_' + anio : filenamePrefix;
    const extend = tipo === 'pdf' ? 'pdfHtml5' : 'excelHtml5';
    const colImporte = table.columns().count() - 1;
    const buttonConfig = {
        extend: extend,
        title: filename,
        filename: filename,
        exportOptions: {
            columns: ':visible',
            footer: false,
            modifier: {
                page: 'all',
                search: 'applied'
            },
            format: {
                body: function (data, row, column) {
                    if (column === colImporte) {
                        const cleanValue = String(data).replace(/[^0-9.-]/g, '');
                        const numValue = parseFloat(cleanValue);
                        return !isNaN(numValue) ? numValue : 0;
                    }
                    return data;
                },
                header: function (data) {
                    return data || '';
                }
            }
        }
    };
    if (extend === 'pdfHtml5') {
        buttonConfig.orientation = 'landscape';
        buttonConfig.pageSize = 'A4';
    } else {
        buttonConfig.customize = function (xlsx) {
            const sheet = xlsx.xl.worksheets['sheet1.xml'];
            const colLetra = String.fromCharCode(65 + colImporte);
            $('row c[r^="' + colLetra + '"]', sheet).each(function (index) {
                if (index > 0) {
                    $(this).attr('s', '2');
                    const value = $(this).find('v').text();
                    if (value && !isNaN(value)) {
                        $(this).attr('t', 'n');
                    }
                }
            });
        };
    }
    const buttons = new $.fn.dataTable.Buttons(table, { buttons: [buttonConfig] });
    const container = buttons.container().appendTo('body');
    setTimeout(function () {
        const selectorBoton = extend === 'pdfHtml5' ? '.buttons-pdf' : '.buttons-excel';
        const boton = container.find(selectorBoton);
        if (boton.length > 0) {
            boton[0].click();
        } else {
            console.error('No se encontró el botón de exportación (' + extend + ')');
        }
        setTimeout(function () {
            if (buttons && typeof buttons.destroy === 'function') {
                try {
                    buttons.destroy();
                    container.remove();
                } catch (error) {
                    console.warn('Error al limpiar botones de exportación:', error);
                }
            }
        }, 500);
    }, 50);
}

// Exporta ambos cuadros (período actual y período anterior) en una sola acción.
function exportarReporteAmbosCuadros(tableId1, tableId2, tipo, filenamePrefix, anio1, anio2) {
    exportarReporteTabla(tableId1, tipo, filenamePrefix, anio1);
    setTimeout(function () {
        exportarReporteTabla(tableId2, tipo, filenamePrefix, anio2);
    }, 700);
}