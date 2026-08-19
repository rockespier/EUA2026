cargarCombos();
cargarDatos(0);
async function cargarDatos(id) {    
    const datosPermisos = await getPermisos(id);
    for (const cboobj of datosPermisos) {
        const state = cboobj.state;
        let previos = state.replace("opened", "\"opened\"").replace("selected", "\"selected\"")
        const datos = JSON.parse(previos);
        cboobj.state = datos;
    }
    cargarArbol(datosPermisos);
}

$('#selPerfil').on('change', function (e) {
    var optionSelected = $("option:selected", this);    
    var valueSelected = this.value;
    $("#tvPermisos").jstree("destroy");
    cargarDatos(valueSelected);
});

async function cargarSelectPerfil() {
    const vidperfil = $("#selPerfil option:selected").val();
    $("#tvPermisos").jstree("destroy");
    cargarDatos(vidperfil);
}

async function cargarCombos() {
    const elcomboPerfiles = await getPerfil();
    let cantElementos01 = elcomboPerfiles.length;
    if (cantElementos01 > 1) {
        $('#selPerfil').append($('<option/>').attr("value", "0").text('---Seleccione---'));
        for (const cboobj of elcomboPerfiles) {
            const perfilId = cboobj.perfilId;
            const perfilNombre = cboobj.perfilNombre;
            $('#selPerfil').append($('<option/>').attr("value", perfilId).text(perfilNombre));
        }
    }
}
async function getPerfil() {
    const urlApiFecht = menuUrlApi + "configuracion/PerfilObtener";
    const urlParametro = "?pPerfilId=0&pPerfilOrigen=" + menuelOrigen;
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
        const object2 = await response.json()
        if (object2.length > 0) {
            console.log(object2);
            return object2;
        }
    }
}

async function cargarArbol(data) {
    console.log(data);
    $('#tvPermisos').jstree({
        'core': {
            'data': data,
            'themes': {
                'responsive': false
            },
            expand_selected_onload: true
        },
        'types': {
            'default': {
                'icon': 'icofont icofont-folder font-theme'
            },
            'file': {
                'icon': 'icofont icofont-file-alt font-dark'
            }
        },
        'plugins': ['types', 'checkbox']
    }).bind("loaded.jstree", function (event, data) {
        $(this).jstree("open_all");
    });
    
}
async function getPermisos(id) {
    const urlApiFecht = menuUrlApi + "configuracion/MenuPermisosObtener";
    const urlParametro = "?pIdPerfil=" + id + "&pPerfilTipo=0";
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
        const object4 = await response.json()
        if (object4.length > 0) {
            console.log(object4);
            return object4;
        }
    }
}

async function guardarPermisos() {
    const vdatosProcesar = $('#tvPermisos').jstree(true).get_json('#', { flat: true })
    const vidperfil = $("#selPerfil option:selected").val();
    let ids = "";
    for (const cboobj of vdatosProcesar) {
        const id = cboobj.id;
        const states = cboobj.state;
        const parent = cboobj.parent;
        if (states.selected == true) {
            if (parent != "#") {
                ids += id + ",";
            }
        }
    }
    ids = ids.slice(0, -1);
    const dataEnviar = {
        perfilId: vidperfil,
        menuIds: ids,
    };
    const resultado = await postPermisoProcesar(dataEnviar);
    if (resultado.codigo == 200) {
        mostrarMensaje(1, resultado.descripcion)
        await cargarSelectPerfil();        
        return false;
    } else {
        mostrarMensaje(2, resultado.errorDescripcion);
        return false;
    }
}
async function postPermisoProcesar(enviarBody) {
    const urlApiFecht = menuUrlApi + "configuracion/PermisoProcesar";
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