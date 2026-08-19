const urlGetEntidad = "mantenimiento/AgenciaFacturaObtener";
const urlPostEntidad = "mantenimiento/AgenciaFacturaProcesar";
const urlDeleteEntidad = "mantenimiento/AgenciaFacturaAnular";

IniciarFechasBsuqueda();
cargarAcciones();

async function cargarAcciones() {
    await CargarCombos();
    setTimeout(async () => {
        await CargarTodo();
    }, 600);
}


$('#mdvenBtnBuscarDoc').on('click', async function (e) {
    await buscarPorDocumento();
});
$('#mdvenTxtNumDocumento').bind("enterKey", async function (e) {
    await buscarPorDocumento();
});
$('#mdvenTxtNumDocumento').keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

async function limpiarModalPasajero() {
    ReseteoLocalStorage();
    document.getElementById("txtAgencia").value = "";
    document.getElementById("mdselMoneda").value = "";
    document.getElementById("mdtxtTotal").value = "";
    document.getElementById("mdtxtObservaciones").value = "";
  
    $("#mdselMoneda").removeClass("is-valid");
    $("#mdselMoneda").removeClass("is-invalid");
    $("#mdtxtTotal").removeClass("is-valid");
    $("#mdtxtTotal").removeClass("is-invalid");
    $("#mdtxtObservaciones").removeClass("is-valid");
    $("#mdtxtObservaciones").removeClass("is-invalid");
    
}

async function buscarPorDocumento() {
    //buscar por copdigo de liquidacion
    const eldocumento = document.getElementById("mdCodLiquidacion").value;
   
    if (eldocumento === "") {
        mostrarMensaje(5, "Ingresar codigo de liquidación", "mdCodLiquidacion");
        return false;
    }

    const elpasajero = await getComision(parseInt(eldocumento));
    if (elpasajero != undefined) {
        if (elpasajero != null) {
            if (elpasajero.length > 0) {
                limpiarModalPasajero();
                //document.getElementById("txtAgencia").value = elpasajero[0].agenciaFacturaAgenciaId;                                               
                $('#txtAgencia').typeahead('val', elpasajero[0].agenciaFacturaNombre);
                localStorage.setItem("lsfacturaagenciaSel", elpasajero[0].agenciaFacturaAgenciaId);
                $('#txtAgencia').blur();
                document.getElementById("mdselMoneda").value = elpasajero[0].agenciaFacturaMonedaId;
                document.getElementById("mdtxtTotal").value = elpasajero[0].agenciaFacturaTotal;
                
                return false;

            }
            else {
                mostrarMensaje(4, "No existe liquidación, por favor revisar.");
                return false;
            }
        } else {
            mostrarMensaje(4, "No existe liquidación, por favor revisar.");
            return false;
        }
    } else {
        document.getElementById("mdCodLiquidacion").value = "";        
        mostrarMensaje(5, "No existe liquidación, por favor revisar.", "mdCodLiquidacion");
        return false;
    }
}

async function IniciarFechasBsuqueda() {
    const fechaHoy = new Date();
    const dtfechaHoy = new Date(fechaHoy.setDate(fechaHoy.getDate() + 1));
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;

    const fechaMes = new Date();
    const fecha1mes = new Date(fechaMes.setDate(fechaMes.getDate() - 1));
    const strfecha1mesDia = ("0" + fecha1mes.getDate()).slice(-2)
    const strfecha1mesMes = ("0" + (fecha1mes.getMonth() + 1)).slice(-2)
    const strfecha1mesAnh = fecha1mes.getFullYear();
    const strfecha1mesFin = strfecha1mesAnh + "-" + strfecha1mesMes + "-" + strfecha1mesDia;

    document.getElementById("mdvenFecIncioSearch").value = strfecha1mesFin;
    document.getElementById("mdvenFecFinalSearch").value = strfechaHoyFin;
}

let idEntidad;
const nombreModal = "popupModalUsuario";
const nombreFormulario = "modalUsuario";
const nombreEntidad = "factura de agencia";

function ReseteoLocalStorage() {
    localStorage.removeItem('lsfacturaagenciaSel');    
}

async function clickBuscarVentas() {
    cargarAcciones();
    $('#popupModalVentaSearch').modal('hide');
}

async function limpiarModalBuqueda() {
    IniciarFechasBsuqueda();

    document.getElementById("txtAgenciaSearch").value = "";
    document.getElementById("mdselTipoDocumentoSearch").value = "";
    document.getElementById("mdSerieSearch").value = "";
    document.getElementById("mdNumeroSearch").value = "";
    document.getElementById("mdvenFecIncioSearch").value = "";
    document.getElementById("mdvenFecFinalSearch").value = "";
}

async function clickBuscarLimpiar() {
    limpiarModalBuqueda();
}


async function CargarCombos() {

    const elcomboTipo4 = await getPais(0, 1);
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

    const PaisSelId = await $("#mdSelPais option:selected").val();  

    const elcomboTipoDoc = await getValoresTipo('DocumentoComision', 1);
    if (elcomboTipoDoc !== undefined) {
        let cantElementos10 = elcomboTipoDoc.length;
        if (cantElementos10 > 0) {
            $('#mdselTipoDocumentoSearch').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipoDoc) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdselTipoDocumentoSearch').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    } 

    if (elcomboTipoDoc !== undefined) {
        let cantElementos11 = elcomboTipoDoc.length;
        if (cantElementos11 > 0) {
            $('#mdselTipoDocumento').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboTipoDoc) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdselTipoDocumento').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    } 

    const elcomboAgencia = await getAgencia(0, 1, PaisSelId, 0, '', '');
    if (elcomboAgencia !== undefined) {
        let cantElementos05 = elcomboAgencia.length;
        if (cantElementos05 > 0) {
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
                localStorage.setItem("lsfacturaagenciaSel", selection.agenciaId); // Guarda el ID
            });
        }
    }
    if (elcomboAgencia !== undefined) {
        let cantElementos06 = elcomboAgencia.length;
        if (cantElementos06 > 0) {
            var dataSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: elcomboAgencia
            });

            $('#txtAgenciaSearch').typeahead(
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

                $('#txtAgenciaSearch').on('typeahead:select', function (e, selection) {
                $('#txtAgenciaSearch').val(selection.agenciaId); // Muestra el ID en el input
                localStorage.setItem("lsagenciaIdSearh", selection.agenciaId); // Guarda el ID
            });
        }
    }
    const elcomboMoneda = await getValoresTipo('MonedaComision', 1);
    if (elcomboMoneda !== undefined) {
        let cantElementos12 = elcomboMoneda.length;
        if (cantElementos12 > 0) {
            $('#mdselMoneda').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboMoneda) {
                const valorId = cboobj.valorId;
                const valorNombre = cboobj.valorNombre;
                $('#mdselMoneda').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
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
    tablaGridProducto = $("#dtAgencias").DataTable({
        "data": [],
        "aoColumns": [
            {
                "mData": "agenciaFacturaNombre", "render": function (mData, disp, alldata) {
                    botonEditar = "<li class='edit'><a href='javascript:void(0);' onclick=AbrirModal(" + alldata.agenciaFacturaId +");><i class='icon-pencil-alt'></i></a></li>"
                    botonEliminar = "<li class='delete'><a href='javascript:void(0);' onclick='innactivarAgencia(" + alldata.agenciaFacturaId + ");'><i class='icon-trash'></i></a></li>"
                    if (alldata.usuarioActivo == 0) {
                        botonEliminar = "";
                    }
                    return mData;
                }
            }, {
                "mData": "agenciaFacturaFechaEmision", "render": function (mData, disp, alldata) {
                    const fechaMoment = moment(mData, "YYYY-MM-DD");
                    const dtfecha = fechaMoment.toDate();

                    const strfechaDia = ("0" + dtfecha.getDate()).slice(-2)
                    const strfechaMes = ("0" + (dtfecha.getMonth() + 1)).slice(-2)
                    const strfechaAnh = dtfecha.getFullYear();

                    const strfechaFin = strfechaDia + "/" + strfechaMes + "/" + strfechaAnh;

                    return strfechaFin
                }
            }, {
                "mData": "agenciaFacturaTipoDocumentoNombre", "render": function (mData, disp, alldata) {
                    return alldata.agenciaFacturaTipoDocumentoNombre + ' ' + alldata.agenciaFacturaSerie + ' ' + alldata.agenciaFacturaNumero;
                }
            }, {
                "mData": "agenciaFacturaMonedaNombre", "render": function (mData, disp, alldata) {
                    return mData;
                }
            }, {
                "mData": "agenciaFacturaTotal", "render": function (mData, disp, alldata) {
                    return $.fn.dataTable.render.number(',', '.', 0, 'USD ').display(mData);
                }
            }, {
                "mData": "agenciaFacturaEstado", "render": function (mData, disp, alldata) {
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
        pageLength: 25,
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
    //const PaisId = await $("#mdSelPais option:selected").val();
    const elchkActivo = document.getElementById("mdchkActivos");

    let BusquedaCodAgencia = localStorage.getItem("lsagenciaIdSearh");
    let BusquedaTipoDocumento = document.getElementById("mdselTipoDocumentoSearch").value;
    let BusquedaSerie = document.getElementById("mdSerieSearch").value;
    let BusquedaNumero = document.getElementById("mdNumeroSearch").value;

    if (BusquedaCodAgencia === "" || BusquedaCodAgencia == null) {
        BusquedaCodAgencia = 0;
    }

    if (BusquedaTipoDocumento === "") {
        BusquedaTipoDocumento = 0;
    }
    if (BusquedaSerie === "") {
        BusquedaSerie = "0";
    }
    if (BusquedaNumero === "") {
        BusquedaNumero = 0;
    }
    

    let ActivoCheck = -1;
    if (elchkActivo.checked == true) {
        ActivoCheck = 1
    }

    const BusquedaFechaIni = document.getElementById("mdvenFecIncioSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalSearch").value;
    const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
    const dtfechaIni = fechaIniMoment.toDate();
    const dtfechaVigINI = formatearFechaString(dtfechaIni);
    const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
    const dtfechaFin = fechaFinMoment.toDate();
    const dtfechaVigFIN = formatearFechaString(dtfechaFin);
    //debugger;
    $("#cargar").show();
    const listadoAgencias = await getFacturasAgencia(0,BusquedaCodAgencia, ActivoCheck, BusquedaTipoDocumento, BusquedaSerie, BusquedaNumero, dtfechaVigINI, dtfechaVigFIN);
    if (listadoAgencias !== undefined) {
        if (listadoAgencias.length > 0) {
            tablaGridProducto.clear().draw();
            tablaGridProducto.rows.add(listadoAgencias).draw();
        }
    } else {
        const listadoVacio = [];
        tablaGridProducto.clear().draw();
        tablaGridProducto.rows.add(listadoVacio).draw();
    }
    $("#cargar").hide();
}

async function getFacturasAgencia(int_pAgenciaFacturaId,int_pAgenciaFacturaAgenciaId, int_pSituacionId, int_pAgenciaFacturaTipoDocumento, str_pAgenciaFacturaSerie, int_pAgenciaFacturaNumero, dtfechaVigINI, dtfechaVigFIN) {
    const urlApiFecht = menuUrlApi + urlGetEntidad;
    const urlParametro = "?int_pAgenciaFacturaId=" + int_pAgenciaFacturaId +"&int_pAgenciaFacturaAgenciaId=" + int_pAgenciaFacturaAgenciaId + "&int_pAgenciaFacturaTipoDocumento=" + int_pAgenciaFacturaTipoDocumento + "&str_pAgenciaFacturaSerie=" + str_pAgenciaFacturaSerie + "&int_pAgenciaFacturaNumero=" + int_pAgenciaFacturaNumero + "&int_pAgenciaFacturaEstado=" + int_pSituacionId + "&dte_pAgenciaFacturaInicio=" + dtfechaVigINI + "&dte_pAgenciaFacturaFin=" + dtfechaVigFIN;
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
    $('#popupModalVentaSearch').modal('show');
}

let elvalidar = $("#" + nombreFormulario).validate({
    rules: {
        txtAgencia: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdselTipoDocumento: "required",
        mdtxtSerie: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdtxtNumero: {
            required: true,
            minlength: 3,
            maxlength: 250,
        },
        mdfecEmision: "required",
        mdselMoneda: "required",
        mdtxtTotal: "required",
    },
    messages: {
        txtAgencia: {
            required: "Por favor, ingresar agencia.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdselTipoDocumento: "Por favor, seleccione el tipo de documento.",
        mdtxtSerie: {
            required: "Por favor, ingresar serie.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdtxtNumero: {
            required: "Por favor, ingresar serie.",
            minlength: "Debe al menos con 3 caracteres.",
            maxlength: "No debe pasar de los 250 caracteres.",
        },
        mdfecEmision: "Por favor, ingresar fecha de emision.",
        mdselMoneda: "Por favor, seleccione la moneda.",
        mdtxtTotal: "Por favor, ingresar total.",
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
            mostrarMensaje(2, resultado.errorDescripcion);
            return false;
        }
    }
}

async function AbrirModal(id) {
    const eltitulo = document.getElementById("tituloModal");
    const formModal = document.getElementById(nombreFormulario);
    formModal.reset();
    elvalidar.resetForm();
    //debugger;
    const BusquedaFechaIni = document.getElementById("mdvenFecIncioSearch").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFinalSearch").value;
    const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
    const dtfechaIni = fechaIniMoment.toDate();
    const dtfechaVigINI = formatearFechaString(dtfechaIni);

    const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
    const dtfechaFin = fechaFinMoment.toDate();
    const dtfechaVigFIN = formatearFechaString(dtfechaFin);

    $("#txtAgencia").removeClass("is-valid");
    $("#txtAgencia").removeClass("is-invalid");

    $("#mdfecEmision").removeClass("is-valid");
    $("#mdfecEmision").removeClass("is-invalid");

    $("#mdselTipoDocumento").removeClass("is-valid");
    $("#mdselTipoDocumento").removeClass("is-invalid");

    $("#mdtxtSerie").removeClass("is-valid");
    $("#mdtxtSerie").removeClass("is-invalid");

    $("#mdtxtNumero").removeClass("is-valid");
    $("#mdtxtNumero").removeClass("is-invalid");

    $("#mdtxtTotal").removeClass("is-valid");
    $("#mdtxtTotal").removeClass("is-invalid");

    $("#mdselMoneda").removeClass("is-valid");
    $("#mdselMoneda").removeClass("is-invalid");

    $("#mdtxtObservaciones").removeClass("is-valid");
    $("#mdtxtObservaciones").removeClass("is-invalid");

    if (id == 0) {
        eltitulo.innerHTML = "Nuevo " + nombreEntidad;
        idEntidad = 0;
        $('#' + nombreModal).modal('show');
        return false;
    } else {
        const elEntidad = await getFacturasAgencia(id,0,1,0,'0',0, dtfechaVigINI, dtfechaVigFIN);
        //debugger;
        if (elEntidad.length > 0) {
            idEntidad = id;
            localStorage.setItem("lsfacturaagenciaSel", elEntidad[0].agenciaFacturaAgenciaId); // Guarda el ID
            document.getElementById("txtAgencia").value = elEntidad[0].agenciaFacturaNombre;
            document.getElementById("mdselTipoDocumento").value = elEntidad[0].agenciaFacturaTipoDocumento;
            document.getElementById("mdtxtSerie").value = elEntidad[0].agenciaFacturaSerie;
            document.getElementById("mdtxtNumero").value = elEntidad[0].agenciaFacturaNumero;
            document.getElementById("mdtxtTotal").value = elEntidad[0].agenciaFacturaTotal;
            document.getElementById("mdselMoneda").value = elEntidad[0].agenciaFacturaMonedaId;
            document.getElementById("mdtxtObservaciones").value = elEntidad[0].agenciaFacturaObservacion;

            eltitulo.innerHTML = "Actualizar " + nombreEntidad;            

            const strfechaDesde = elEntidad[0].agenciaFacturaFechaEmision;
           
            const fechaDesdeMoment = moment(strfechaDesde, "YYYY-MM-DD");
            const dtfechaDesde = fechaDesdeMoment.toDate();          
           
            const strfechaDesdeDia = ("0" + dtfechaDesde.getDate()).slice(-2)
            const strfechaDesdeMes = ("0" + (dtfechaDesde.getMonth() + 1)).slice(-2)
            const strfechaDesdeAnh = dtfechaDesde.getFullYear();
           
            const strfechaDesdeFin = strfechaDesdeAnh + "-" + strfechaDesdeMes + "-" + strfechaDesdeDia;
            
            document.getElementById("mdfecEmision").value = strfechaDesdeFin;

           
            if (elEntidad[0].agenciaFacturaEstado == 1) {
                document.getElementById("mdchkEstado").checked = true;
            } else {
                document.getElementById("mdchkEstado").checked = false;
            }

            $('#' + nombreModal).modal('show');
        }
    }
}

const ProcesarEntidad = async () => {

    const eltxtSerie = document.getElementById("mdtxtSerie");
    const elchkEstado = document.getElementById("mdchkEstado");
    const eltxtNumero = document.getElementById("mdtxtNumero");
   
    const ladatFechaIniV = document.getElementById("mdfecEmision");

    let fechaFormateaIniV;
    if (ladatFechaIniV.value == "") {
        const fecha = new Date(0);
        fechaFormateaIniV = formatearFechaString(fecha);
    } else {
        const fechaIniVMoment = moment(ladatFechaIniV.value, "YYYY-MM-DD");
        const dtfechaIniV = fechaIniVMoment.toDate();
        fechaFormateaIniV = formatearFechaString(dtfechaIniV);
    }

    const eltxtTotal = document.getElementById("mdtxtTotal");
    const eltxtObservaciones = document.getElementById("mdtxtObservaciones");
  
    const valorelcboTipoDocumento = await $("#mdselTipoDocumento option:selected").val();
    const valorelcboMoneda = await $("#mdselMoneda option:selected").val();
  
    let estadoCheck = -1;
    if (elchkEstado.checked == true) {
        estadoCheck = 1
    }      

    var idAgencia = localStorage.getItem("lsfacturaagenciaSel");
    const dataEnviar = {
        agenciafacturaId: idEntidad,
        agenciafacturaAgenciaId: idAgencia,
        agenciafacturaTipoDocumento: parseInt(valorelcboTipoDocumento),
        agenciafacturaSerie: htmlEncode(eltxtSerie.value),
        agenciafacturaNumero: parseInt(eltxtNumero.value),
        agenciafacturaFechaEmision: fechaFormateaIniV,
        agenciafacturaMonedaId: parseInt(valorelcboMoneda),
        agenciafacturaTotal: eltxtTotal.value,
        agenciafacturaObservacion: eltxtObservaciones.value,
        agenciafacturaCobranzaId: 0,
        agenciafacturaEstado: parseInt(estadoCheck)        
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

async function deleteAnularAgencia(id, int_pAgenciaFacturaTipoDocumento, str_pAgenciaFacturaSerie, int_pAgenciaFacturaNumero) {
    const urlApiFecht = menuUrlApi + urlDeleteEntidad;
    const urlParametro = "?int_pAgenciaFacturaAgenciaId=" + id + "&int_pAgenciaFacturaTipoDocumento=" + int_pAgenciaFacturaTipoDocumento + "&str_pAgenciaFacturaSerie=" + str_pAgenciaFacturaSerie + "&int_pAgenciaFacturaNumero=" + int_pAgenciaFacturaNumero ;
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