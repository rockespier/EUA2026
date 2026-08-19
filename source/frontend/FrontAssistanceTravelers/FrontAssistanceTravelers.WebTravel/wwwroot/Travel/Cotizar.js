hideLoader();
CargarComponentes();
cargarCombosOrigenDestino();

function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}

async function CargarTodo() {
    console.log("venta registrada desde Cotizacion");
    window.location.href = "/Proceso/ListaVentas";
}

async function cargarCombosOrigenDestino() {
    const elcomboOrigen = await getOrigenDestino(1);
    if (elcomboOrigen !== undefined) {
        let cantElementos01 = elcomboOrigen.length;
        if (cantElementos01 > 0) {
            $('#mdselOrigen').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboOrigen) {
                const valorId = cboobj.paisId;
                const valorNombre = cboobj.paisNombre;
                $('#mdselOrigen').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }    
    const elcomboDestino = await getOrigenDestino(2);
    if (elcomboDestino !== undefined) {
        let cantElementos01 = elcomboDestino.length;
        if (cantElementos01 > 0) {
            $('#mdselDestino').append($('<option/>').attr("value", "").text('---Seleccione---'));
            for (const cboobj of elcomboDestino) {
                const valorId = cboobj.paisId;
                const valorNombre = cboobj.paisNombre;
                $('#mdselDestino').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }

    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    $('#divVenSelAgenciasCompra').hide();
    if (AgenciaId === 0) {
        $('#divVenSelAgenciasCompra').show();
        let PaisId = "0";
        if (menuUserId !== "1") {
            PaisId = menuPaisId.toString();
        }
        const elcomboAgencia = await getAgencia(0, -1, PaisId, menuUserId, '', '');
        let cantElementos00 = elcomboAgencia.length;
        if (cantElementos00 > 0) {
            var dataSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: elcomboAgencia
            });
            $('#mdvenSelAgenciasCompra').typeahead(
                {
                    hint: true,
                    highlight: true,
                    minLength: 1 // Start searching after 1 character
                },
                {
                    name: 'agenciaId',
                    display: 'agenciaNombre', // Show the 'label' value                   
                    source: dataSource
                },
            );

            $('#mdvenSelAgenciasCompra').on('typeahead:select', async function (e, selection) {
                $('#mdvenSelAgenciasCompra').val(selection.agenciaId); // Muestra el ID en el input
                localStorage.setItem("lsagenciaIdSelVentaCompra", selection.agenciaId); // Guarda el ID
            });
        }
    }
}

async function CargarComponentes() {
    $('#descargacotizacion').hide();
    var nowDate = new Date();
    var fecha = new Date();
    fecha.setFullYear(fecha.getFullYear() + 2);
    fecha.setDate(fecha.getDate() - 1);

    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
    var maxDay = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0, 0);
   
    const end = moment(today, "DD-MM-YYYY").add(0, 'days');
    $('input[name="rangoFechasLista"]').daterangepicker({
        opens: 'left',
        timePicker: false,
        startDate: today,
        endDate: end,
        minDate: today,
        maxSpan: {
                    days: 364
                  },
        locale: {
            "format": 'DD/MM/YYYY',
            "separator": " - ",
            "applyLabel": "Aceptar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agusto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            "firstDay": 1
        }
    }, function (start, end, label) {
        if ($("#tipoplan").length > 0 && $("#tipoplan").val() != "2") {
            const diff = moment(end).diff(moment(start), 'days') + 1;
            $("#numerodias").html(diff);
        } 
    });
}


$("#tipoplan").on("change", function () {
    var selectedValue = $(this).val(); // Obtener el valor del select
    var datePicker = $('.rangoFechasLista').data('daterangepicker');

    // Si el usuario selecciona el plan 2, la fecha inicial la elegire despues
    if (selectedValue == "2") { // Si es plan 2
        if (datePicker.startDate) { // Si ya hay una fecha inicial seleccionada
            var startDate = datePicker.startDate;
            var endDate = moment(startDate).add(364, 'days'); // Sumar 365 di­as

            // Asignar la fecha final automaticamente
            datePicker.setEndDate(endDate);
            $('.rangoFechasLista').val(startDate.format('DD/MM/YYYY') + ' - ' + endDate.format('DD/MM/YYYY'));


            // Actualizar el numero de di­as
            $("#numerodias").html(365);
        }
    }
});


// Evento cuando el usuario selecciona la fecha en el Date Range Picker
$('.rangoFechasLista').on('apply.daterangepicker', function (ev, picker) {
    var selectedValue = $("#tipoplan").val(); // Obtener el plan seleccionado

    if (selectedValue == "2") {
        var startDate = picker.startDate; // Fecha inicial seleccionada
        var endDate = moment(startDate).add(364, 'days'); // Sumar 365 di­as

        // Establecer la fecha final automÃ¡ticamente
        picker.setEndDate(endDate);
        $(this).val(startDate.format('DD/MM/YYYY') + ' - ' + endDate.format('DD/MM/YYYY'));

        // Actualizar el numero de di­as
        $("#numerodias").html(365); // 365 di­as + el inicial
    }
});

$('.rangoFechasLista').on('showCalendar.daterangepicker', function (ev, picker) {
    var selectedValue = $("#tipoplan").val(); // Obtener el plan seleccionado

    // Si el plan es 2, forzar la fecha final en el mismo momento
    if (selectedValue == "2") {
        // Esperar un pequeno retraso para asegurarse de que la fecha inicial se selecciona
        setTimeout(function () {
            var startDate = picker.startDate; // Fecha inicial
            var endDate = moment(startDate).add(364, 'days'); // Sumar 365 dÃ­as

            // Establecer la fecha final automÃ¡ticamente
            picker.setEndDate(endDate);
            $('.rangoFechasLista').val(startDate.format('DD/MM/YYYY') + ' - ' + endDate.format('DD/MM/YYYY'));
            // Actualizar el numero de di­as
            $("#numerodias").html(365); // 365 di­as + el dia inicial
        }, 50); // Pequeno retraso para asegurarse de que la fecha inicial se haya seleccionado
    }
});


$("body").on("click", ".edad-mas", function () {
    var value = $("#edades option:selected").val();
    if (parseInt(value) < 10) {
        $("#edades").val(parseInt(value) + 1);
        $("#edades").trigger("change");
    }
});

$("body").on("click", ".edad-menos", function () {
    var value = $("#edades option:selected").val();
    if (parseInt(value) > 1) {
        $("#edades").val(parseInt(value) - 1);
        $("#edades").trigger("change");
    }
});



$("#edades").on("change", function () {
    var val = $(this).children("option:selected").val();
    $(".edades").hide();
    for (let i = 1; i <= parseInt(val); i++) {
        $("#edad" + i).show();
    }
    for (let j = 10; j > parseInt(val); j--) {
        $("#edad" + j + " input").val('');
        //console.log("#edad"+j);
    }
});
$("#edades").trigger("change");


$(".btn-calculadora").on("click", function () {
    $("#calculadoraModal").modal('show');
})

$('#ageCalculator').on('submit', function (e) {
    e.preventDefault();
    var dob = new Date($('#dob').val());
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    $('#result').html('Edad: ' + age + ' anos');
});

$(".fa-calendar").on("click", function () {
    $('input[name="rangoFechasLista"]').focus();
});

async function MostrarBeneficios(productoId,productoNombre) {
    let HtmlProducto = "";
    let HtmlResultados = "";

    document.getElementById("titulo_plan").innerHTML = productoNombre.toUpperCase();

    const beneficio = await getBeneficios(productoId,0,1);
    if (beneficio !== undefined) {
        if (beneficio.length > 0) {
            for (var i = 0; i < beneficio.length; i++) {
                const beneficioNombre = beneficio[i].beneficioNombre;
                const beneficioImporte = beneficio[i].beneficioImporte;
                
                HtmlProducto = `<tr> <td>${beneficioNombre}</td> <td>${beneficioImporte}</td> </tr>`;

                HtmlResultados = HtmlResultados + HtmlProducto;
            }

            document.getElementById("contenido-plan").innerHTML = `<tbody>` + HtmlResultados + `</tbody>`;
        }
    }
}

async function AbrirBusqueda() {   
    const elOrigen = document.getElementById("mdselOrigen");
    const elDestino = document.getElementById("mdselDestino");
    const elDias = document.getElementById("numerodias");
    const elCantidad = document.getElementById("edades");
    const elModalidad = document.getElementById("tipoplan");
    const agenciaIdCompra = localStorage.getItem("lsagenciaIdSelVentaCompra");
    const agenciaNombreCompra = $('#mdvenSelAgenciasCompra').val();

    const elEdades = document.querySelectorAll('input[name="edad[]"]');
    const valores = [];
    elEdades.forEach(input => {
        valores.push(input.value);
    });
    
    const mayor = valores.reduce(myFunc);
    
    let HtmlProducto = "";
    let HtmlResultados = "";
    let arrProductoids = "";
    let arrProductoNombres = "";
    let arrPrecios = "";
    const cotizacion = await getCotizacion(elOrigen.value, elDestino.value, elDias.innerText, elCantidad.value, elModalidad.value, mayor);
    if (cotizacion !== undefined) {
        if (cotizacion.length > 0) {
            for (var i = 0; i < cotizacion.length; i++) {
                const IDProducto = cotizacion[i].productoId;
                const ProductoNombre = cotizacion[i].productoNombre;
                const Total = cotizacion[i].productoTarifaImporte;
                const Beneficios = cotizacion[i].beneficiosHtml;
                const Dias = cotizacion[i].productoTarifaDia;

                if (i < 3) {
                    if (i == 0) {
                        arrProductoids = IDProducto;
                        arrProductoNombres = ProductoNombre;
                        arrPrecios = Total;
                    } else {
                        arrProductoids = arrProductoids + "," + IDProducto;
                        arrProductoNombres = arrProductoNombres + "," + ProductoNombre;
                        arrPrecios = arrPrecios + "," + Total;
                    }
                    
                }

                HtmlProducto = `<div class="col-sm-3 caja-plan-categoria categoria-1"> 
                                    <div class="caja-plan2"> 
                                         <div class="row align-items-center"> 
	                                        <div class="col-sm-12"> 
		                                        <label for="plancheck1" class="titulo-resultados"> 
		                                        <input type="checkbox" id="plancheck1" class="form-check-input planescheck" value="1"> 
		                                        <h3>${ProductoNombre}</h3> </label> 
	                                        </div> 
                            <div class="col-sm-12 "> 
                                <div class="informacion">                    
                                    <ul> 
                                    ${Beneficios}
                                    </ul> 
                                    <div class="text-center"> 
                                        <a onclick="MostrarBeneficios(${IDProducto},'${ProductoNombre}')" data-bs-toggle="modal" data-bs-target="#modalpage" data-id="1" class=" btn-information view-detalle-plan"><i class="fa fa-plus"></i> información</a> 
                                     </div> 
                                 </div>  
                            </div> 
                            <div class="col-sm-12 text-center "> 
                            <div class="datos"> 
                            <div>Total Para ${elCantidad.value} Personas</div> 
                            <div class="caja-costos-plan">  
                            <div class="total-table"><span>${Total} </span> USD  </div> 
                            </div> 
                            <form class="form-compra">                             
                            <button class="btn btn-success comprar" type="button"  onclick="AbrirModal(${IDProducto},${agenciaIdCompra},'${agenciaNombreCompra}');" >EMITIR</button> 
                            </form> 
                            </div> 
                            </div> 
                            </div> 
                            </div>
                            </div>`;

                HtmlResultados = HtmlResultados + HtmlProducto;
            }
            document.getElementById("mdHidProductosIds").value = arrProductoids;
            document.getElementById("mdHidProductosNombres").value = arrProductoNombres;
            document.getElementById("mdHidProductosPrecios").value = arrPrecios;    
            document.getElementById("divResultadoInfoPro").innerHTML = HtmlResultados;
            $('#descargacotizacion').show();
        }
    }
}

async function getCotizacion(pOrigen, pDestino, pDias, pCantidad, pModalidad, pMayor) {
    const urlApiFecht = menuUrlApi + "mantenimiento/CotizacionObtener";
    const urlParametro = "?pOrigen=" + pOrigen + "&pDestino=" + pDestino + "&pDias=" + pDias + "&pCantidad=" + pCantidad + "&pModalidad=" + pModalidad + "&pEdadMayor=" + pMayor;
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

async function getBeneficios(pProductoId, pBeneficioId, pIdioma) {
    const urlApiFecht = menuUrlApi + "mantenimiento/ProductoBeneficiosObtener";
    const urlParametro = "?int_pProductoID=" + pProductoId + "&int_pBeneficioID=" + pBeneficioId + "&int_pBeneficioIdioma=" + pIdioma;
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

function myFunc(anterior, actual) {
    return actual > anterior ? actual : anterior;
}

function formatToLocal(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function isDateInRange(dateStr, startDateStr, endDateStr) {
    // Convertir fechas de dd/mm/yyyy a objetos Date
    const [day, month, year] = dateStr.split('/');
    const date = new Date(`${year}-${month}-${day}`);

    const [startDay, startMonth, startYear] = startDateStr.split('/');
    const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);

    const [endDay, endMonth, endYear] = endDateStr.split('/');
    const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

    // Verificar si la fecha estÃ¡ dentro del rango
    return date >= startDate && date <= endDate;
}

async function clickImprimir() {
    const sesionActiva = await fetch('/validateJS', { credentials: 'include' });
    if (!sesionActiva.ok) {
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return;
    }
   
    showLoader();
    try {
        debugger;
        var startDate = $('#rangoFechasLista').data('daterangepicker').startDate._d;
        var endDate = $('#rangoFechasLista').data('daterangepicker').endDate._d;

        const fechaInicio = formatearFechaString(startDate);
        const fechaFin = formatearFechaString(endDate);
        var selOrigen = document.getElementById("mdselOrigen");         
        const origen = selOrigen.options[selOrigen.selectedIndex].text;
        var selDestino = document.getElementById("mdselDestino");      
        const destino = selDestino.options[selDestino.selectedIndex].text;
        const personas = document.getElementById("edades").value;
        const codigos = document.getElementById("mdHidProductosIds").value;
        const nombres = document.getElementById("mdHidProductosNombres").value;
        const precios = document.getElementById("mdHidProductosPrecios").value;

        const parametro = fechaInicio + "_" + fechaFin + "_" + origen + "_" + destino + "_" + personas + "_" + codigos + "_" + nombres + "_" + precios;

        let response = await fetch('/exportCotizacionImprimir/' + parametro, {
            method: 'GET',
            headers: {
                'Accept': 'application/octet-stream'  // Expecting a PDF response
            }
        });
        debugger;
        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = destino + '.pdf';
            link.click();
        } else {
            mostrarMensaje(1, "Error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {       
        hideLoader();
    }
   
}