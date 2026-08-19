hideLoader();
cargarAcciones();
async function cargarAcciones() {
    await mostrarFecha(false)
    await CargarCombos();
    await IniciarFechasBsuqueda();
    setTimeout(async () => {
        await cambiarValoresChart();
        await actualizarTitulosGraficos(); // Actualizar títulos después de cargar los gráficos
    }, 300);
}

// Nueva función para actualizar los títulos de los gráficos con períodos
async function actualizarTitulosGraficos() {
    const elcombomes = document.getElementById("idopcionesmes");
    const valorItem = parseInt(elcombomes.options[elcombomes.selectedIndex].value);
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1;
    
    let textoGrafico1 = "";
    let textoGrafico2 = "";
    
    switch(valorItem) {
        case 1: // Mes Actual
            textoGrafico1 = anioActual + "/" + mesActual;
            const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
            const anioMesAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
            textoGrafico2 = anioMesAnterior + "/" + mesAnterior;
            break;
        case 2: // Mes Anterior
            const mesAnt = mesActual === 1 ? 12 : mesActual - 1;
            const anioMesAnt = mesActual === 1 ? anioActual - 1 : anioActual;
            textoGrafico1 = anioMesAnt + "/" + mesAnt;
            const mesAnt2 = mesAnt === 1 ? 12 : mesAnt - 1;
            const anioMesAnt2 = mesAnt === 1 ? anioMesAnt - 1 : anioMesAnt;
            textoGrafico2 = anioMesAnt2 + "/" + mesAnt2;
            break;
        case 3: // Año Actual
            textoGrafico1 = anioActual.toString();
            textoGrafico2 = (anioActual - 1).toString();
            break;
        case 4: // Año Anterior
            textoGrafico1 = (anioActual - 1).toString();
            textoGrafico2 = (anioActual - 2).toString();
            break;
        case 5: // Rango
            const fechaIni = document.getElementById("mdvenFecIni").value;
            const fechaFin = document.getElementById("mdvenFecFin").value;
            textoGrafico1 = fechaIni + " al " + fechaFin;
            textoGrafico2 = "Período Anterior";
            break;
        default:
            textoGrafico1 = anioActual.toString();
            textoGrafico2 = (anioActual - 1).toString();
    }
    
    $('#anioGrafico1').text(textoGrafico1);
    $('#anioGrafico2').text(textoGrafico2);
}

DivNoVisible();
async function IniciarFechasBsuqueda() {
    const fechaHoy = new Date();
    const dtfechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2)
    const strfechaHoyAnh = fechaHoy.getFullYear();
    const strfechaHoyFin = strfechaHoyAnh + "-" + strfechaHoyMes + "-" + strfechaHoyDia;
    const fecha3meses = new Date(fechaHoy.setDate(fechaHoy.getDate() + 1));
    const strfecha3mesesDia = ("0" + fecha3meses.getDate()).slice(-2)
    const strfecha3mesesMes = ("0" + (fecha3meses.getMonth() + 1)).slice(-2)
    const strfecha3mesesAnh = fecha3meses.getFullYear();
    const strfecha3mesesFin = strfecha3mesesAnh + "-" + strfecha3mesesMes + "-" + strfecha3mesesDia;
    document.getElementById("mdvenFecIni").value = strfechaHoyFin;
    document.getElementById("mdvenFecFin").value = strfecha3mesesFin;
    document.getElementById("mdvenFecFin").min = strfechaHoyFin;
}
async function mostrarFecha(estado) {
    if (estado === true) {
        $("#mdvenFecIni").show();
        $("#mdvenFecFin").show();
        $("#btonFechas").show();
    } else {
        $("#mdvenFecIni").hide();
        $("#mdvenFecFin").hide();
        $("#btonFechas").hide();
    }
}
$('#mdvenFecIni').change(async function () {
    const strfechaSelecVigIni = $(this).val();
    const strfechaSelecVigIniMoment = moment(strfechaSelecVigIni, "YYYY-MM-DD");
    const dtfechaSelecVigIni = strfechaSelecVigIniMoment.toDate();
    document.getElementById("mdvenFecFin").min = strfechaSelecVigIni;
});
$('#btonFechas').on('click', async function (e) {
    cambiarValoresChart();
});

$('#mdselPromotor').change(async function () {
    cambiarValoresChart();
});
function join(date, options, separator) {
    function format(option) {
        let formatter = new Intl.DateTimeFormat('en', option);
        return formatter.format(date);
    }
    return options.map(format).join(separator);
}
function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}
async function cambiarValoresChart() {
    const elcombomes = document.getElementById("idopcionesmes");
    const valorItem = parseInt(elcombomes.options[elcombomes.selectedIndex].value);

    const BusquedaFechaIni = document.getElementById("mdvenFecIni").value;
    const BusquedaFechaFin = document.getElementById("mdvenFecFin").value;
    let BusquedaPromotor = document.getElementById("mdselPromotor").value;
    const fechaIniMoment = moment(BusquedaFechaIni, "YYYY-MM-DD");
    const dtfechaIni = fechaIniMoment.toDate();
    let dtfechaVigINI = formatearFechaString(dtfechaIni);
    const fechaFinMoment = moment(BusquedaFechaFin, "YYYY-MM-DD");
    const dtfechaFin = fechaFinMoment.toDate();
    let dtfechaVigFIN = formatearFechaString(dtfechaFin);

    if (BusquedaPromotor == '') {
        BusquedaPromotor = 0;
    }
    if (valorItem === 5) {
        mostrarFecha(true)
    } else {
        mostrarFecha(false)
        let optionsVacia = [{ day: 'numeric' }, { month: 'numeric' }, { year: 'numeric' }];
        dtfechaVigINI = join(new Date(1900, 0, 1), optionsVacia, '/');
        dtfechaVigFIN = join(new Date(1900, 0, 1), optionsVacia, '/');
    }
    console.log(dtfechaVigINI, "INI");
    console.log(dtfechaVigFIN, "FIN");
    console.log(BusquedaPromotor, "Promotor");

    showLoader();
    const permisosVisualizar = await getMenuDashBoradJefe();
    if (permisosVisualizar !== undefined) {
        const divsGraficos = document.getElementById("graficosjefes").getElementsByTagName("*")
        for (let i = 0; i < permisosVisualizar.length; i++) {
            const idMenu = permisosVisualizar[i].menuId;
            const MenuNombre = permisosVisualizar[i].menuNombre;
            const valorParametro = permisosVisualizar[i].menuParametros;
            let datosParametro = valorParametro.split("_")
            const metodoChart = datosParametro[0];
            const tipoChart = datosParametro[1];
            const reporteChart = datosParametro[2];
            const tituloCategoria = datosParametro[3];
            const tituloValor = datosParametro[4];
            const idChart = "c" + idMenu;
            if (tipoChart === "1") {
                await getObetenerPie(valorItem, metodoChart, idChart, reporteChart, BusquedaPromotor, dtfechaVigINI, dtfechaVigFIN, tituloCategoria, tituloValor, MenuNombre);
            } else {
                await getObetenerBarras(valorItem, metodoChart, idChart, reporteChart, BusquedaPromotor, dtfechaVigINI, dtfechaVigFIN, tituloCategoria, tituloValor, MenuNombre);
            }
            for (let i2 = 0; i2 < divsGraficos.length; i2++) {
                const subconsulta = divsGraficos[i2].children
                for (let i3 = 0; i3 < subconsulta.length; i3++) {
                    if (subconsulta[i3].id.includes(idMenu) === true) {
                        const elelementoMostrar = subconsulta[i3].id;
                        $('#' + elelementoMostrar).show();
                        break;
                    }
                }
            }
        }
    }
    // Actualizar títulos después de cargar los gráficos
    await actualizarTitulosGraficos();
    hideLoader();

}
function DivNoVisible() {
    $('#chart_DashboardGraficoObtener_96').hide();
    $('#chart_DashboardGraficoObtener_98').hide();
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
//FUNCIONES DE API
async function getMenuDashBoradJefe() {
    const urlApiFecht = menuUrlApi + "generales/MenuDashboardObtener";
    const urlParametro = "?pPerfilId=" + menuPerfilId + "&pMenuPadreId=94";
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
//FUNCIONES DE OBTENER DATA
async function getObetenerLineas(vPeriodoId, vMetodo, vChart, vReporte, vPromotor, vTituloCategoria, vtituloValor, vNombreReporte) {
    const urlApiFecht = menuUrlApi + "reportes/" + vMetodo;
    const urlParametro = "?pPeriodoId=" + vPeriodoId + "&pOpcion=" + vReporte + "&pUsuarioId=" + menuUserId + "&pPromotorId=" + vPromotor;
    console.log("reporte", urlApiFecht + urlParametro);
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
        const object5 = await response.json()
        if (object5.length > 0) {
            const columnas = object5[0];
            let dataChatXTipo = []
            let dataMeses = []
            for (let key in columnas) {
                if (key != "mes") {
                    const registro = {
                        name: key,
                        type: 'area',
                        data: [],
                    };
                    dataChatXTipo.push(registro)
                }
            }
            for (let i = 0; i < object5.length; i++) {
                const valor1 = object5[i].mes;
                dataMeses.push(fnReturnaMes(valor1))
            }
            for (let adata = 0; adata < dataChatXTipo.length; adata++) {
                const akey = dataChatXTipo[adata].name;
                const alista = object5.map((x) => x[akey]);
                dataChatXTipo[adata].data = alista;
            }
            const opcionesOTXTipo = {
                series: dataChatXTipo,
                chart: {
                    height: 300,
                    type: 'line',
                    stacked: false,
                    toolbar: {
                        show: true,
                        export: {
                            csv: {
                                headerCategory: vTituloCategoria,
                                headerValue: vtituloValor,
                                filename: vNombreReporte
                            },
                            png: { filename: vNombreReporte },
                            svg: { filename: vNombreReporte }
                        },
                    },
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        blur: 4,
                        color: '#000',
                        opacity: 0.08
                    }
                },
                stroke: {
                    width: [2, 2, 2, 2, 2, 2, 2],
                    curve: 'smooth'
                },
                grid: {
                    show: true,
                    borderColor: 'var(--chart-border)',
                    strokeDashArray: 0,
                    position: 'back',
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%'
                    }
                },
                colors: ["#DC4C64", "#14A44D", "#3B71CA", "#E4A11B", "#54B4D3", "#7F1E57", "#332D2D"],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: "vertical",
                        opacityFrom: 0.4,
                        opacityTo: 0,
                        stops: [0, 100]
                    }
                },
                labels: dataMeses,
                xaxis: {
                    type: 'category',
                    tickAmount: 10,
                    tickPlacement: 'between',
                    tooltip: {
                        enabled: false,
                    },
                    axisBorder: {
                        color: 'var(--chart-border)',
                    },
                    axisTicks: {
                        show: false
                    },
                    rotate: 15,
                },
                legend: {
                    show: false,
                },
                yaxis: {
                    min: 0,
                    tickAmount: 6,
                    tickPlacement: 'between',
                },
                tooltip: {
                    shared: false,
                    intersect: false,
                },
                responsive: [{
                    breakpoint: 1200,
                    options: {
                        chart: {
                            height: 250,
                        }
                    },
                }]

            };
            const chartOTXTipo = new ApexCharts(document.querySelector("#" + vChart), opcionesOTXTipo);
            chartOTXTipo.empty = true;
            chartOTXTipo.render();
            chartOTXTipo.empty = false;
            window.dispatchEvent(new Event('resize'))
        }
    }
}

function getRandomColor() {
    const miArreglo = ["#DC4C64", "#14A44D", "#3B71CA", "#E4A11B", "#54B4D3", "#7F1E57", "#332D2D"];
    //const letters = '0123456789ABCDEF';
    //let color = '#';
    //for (let i = 0; i < 6; i++) {
    //    color += letters[Math.floor(Math.random() * 16)];
    //}
    //return color;
    const indiceAleatorio = Math.floor(Math.random() * miArreglo.length);
    return miArreglo[indiceAleatorio];
}

async function getObetenerBarras(vPeriodoId, vMetodo, vChart, vReporte, vPromotor, vInicio, vFin, vTituloCategoria, vtituloValor, vNombreReporte) {
    const cntAcumulado = 0;
    const miPais = await $("#mdSelPais option:selected").val();
    const nombrePromotor = await $("#mdselPromotor option:selected").text();
    const PaisSel = isNaN(parseInt(miPais)) ? 0 : parseInt(miPais);
    const urlApiFecht = menuUrlApi + "reportes/" + vMetodo;
    const urlParametro = "?pPeriodoId=" + vPeriodoId + "&pOpcion=" + vReporte + "&pUsuarioId=" + menuUserId + "&pPaisId=" + PaisSel + "&pOrigen=" + menuelOrigen + "&pPromotorId=" + vPromotor + "&pInicio=" + vInicio + "&pFin=" + vFin;;
    console.log('reporte', urlApiFecht + urlParametro);
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
        console.log("error barras", responseError)
    } else if (response.status === 200) {
        const object6pre = await response.json()
        const object6 = JSON.parse(object6pre);
        if (object6.length > 0) {
            const columnas = object6[0];
            let dataChatXModelo = []
            let dataMeses2 = []
            for (let key in columnas) {
                if (key != "mes") {
                    const registro = {
                        name: key,
                        type: 'bar',
                        data: [],
                    };
                    dataChatXModelo.push(registro)
                }
            }
            let cntAcumulado = 0;
            let maxImporte = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < object6.length; i++) {
                const valor1 = object6[i].mes;
                cntAcumulado = cntAcumulado + object6[i].importe;
                dataMeses2.push(fnReturnaMes(valor1))
                if (object6[i].importe > maxImporte) {
                    maxImporte = object6[i].importe;
                }
            }
            for (let adata = 0; adata < dataChatXModelo.length; adata++) {
                const akey = dataChatXModelo[adata].name;
                const alista = object6.map((x) => x[akey]);
                for (let i = 0; i < alista.length; i++) {
                    if (alista[i] == null) {
                        alista[i] = 0;
                    }
                }
                dataChatXModelo[adata].data = alista;
            }
            const optionsXModelo = {
                series: dataChatXModelo,
                theme: {
                    palette: 'palette2'
                },
                chart: {
                    type: 'bar',
                    height: 400,
                    toolbar: {
                        show: true,
                        export: {
                            csv: {
                                headerCategory: vTituloCategoria,
                                headerValue: vtituloValor,
                                filename: 'Agencias de ' + nombrePromotor
                            },
                            png: { filename: 'Agencias de ' + nombrePromotor },
                            svg: { filename: 'Agencias de ' + nombrePromotor }
                        },
                    },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        borderRadiusApplication: 'around',
                        borderRadiusWhenStacked: 'last',
                        horizontal: false,
                        columnWidth: '70%',
                        barHeight: '70%',
                        distributed: false,
                        gap: 20,
                        dataLabels: {
                            position: 'top',
                            maxItems: 100,
                            hideOverflowingLabels: false,
                            horizontal: true,
                        }
                    }
                },
                dataLabels: {
                    enabled: true, offsetY: -20, // Mueve el texto 20px hacia arriba (fuera de la barra)
                    style: {
                        fontSize: '12px',
                        fontWeight: 'bold',
                        colors: ["#304758"] // IMPORTANTE: Cambia el color a oscuro (gris/negro)
                    }, formatter: function (val, opts) {
                        // Formatea el valor para mejor legibilidad
                        if (val === 0 || val === null) return '';
                        return numberWithCommas(parseFloat(val).toFixed(2));
                    },
                    background: {
                        enabled: true, // Añade un fondo a las etiquetas
                        foreColor: '#fff',
                        padding: 4,
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: '#fff',
                        opacity: 0.9
                    }
                },
                stroke: {
                    show: true,
                    width: 6,
                    colors: ['transparent']
                },
                grid: {
                    show: true,
                    borderColor: 'var(--chart-border)',
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                },
                xaxis: {
                    categories: dataMeses2,
                    tickAmount: 14,
                    tickPlacement: 'between',
                    labels: {
                        style: {
                            fontFamily: 'Rubik, sans-serif',
                        },
                        rotate: -45,
                        minHeight: undefined,
                        maxHeight: 200,
                    },
                    axisBorder: {
                        show: true
                    },
                    axisTicks: {
                        show: true
                    }
                },
                yaxis: {
                    min: 0,
                    max: maxImporte * 1.15,
                    tickAmount: 5,
                    tickPlacement: 'between',
                    labels: {
                        formatter: (value) => {
                            var resultado = numberWithCommas(parseFloat(value).toFixed(2)).toString();
                            return `USD ${resultado} `;
                        },
                        style: {
                            fontFamily: 'Rubik, sans-serif',
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    fontFamily: "Rubik, sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    labels: {
                        colors: "var(--chart-text-color)",
                    },
                    markers: {
                        width: 6,
                        height: 6,
                        radius: 10,
                    },
                    itemMargin: {
                        horizontal: 10,
                    }
                }
            };
            const chartXModelo = new ApexCharts(document.querySelector("#" + vChart), optionsXModelo);
            chartXModelo.empty = true;
            chartXModelo.render();
            chartXModelo.empty = false;
            window.dispatchEvent(new Event('resize'))
        }
    } else {
        if (response.status === 204) {
            console.log("entro else barras");
            const optionsXModelo = {
                series: [{
                    name: "Sin data",
                    type: 'bar',
                    data: []
                }],
                chart: {
                    type: 'bar',
                    height: 270,
                    toolbar: {
                        show: false
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%',
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 6,
                    colors: ['transparent']
                },
                grid: {
                    show: true,
                    borderColor: 'var(--chart-border)',
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                },
                colors: [],
                xaxis: {
                    categories: [],
                    tickAmount: 4,
                    tickPlacement: 'between',
                    labels: {
                        style: {
                            fontFamily: 'Rubik, sans-serif',
                        },
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    tickAmount: 5,
                    tickPlacement: 'between',
                    labels: {
                        style: {
                            fontFamily: 'Rubik, sans-serif',
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    fontFamily: "Rubik, sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    labels: {
                        colors: "var(--chart-text-color)",
                    },
                    markers: {
                        width: 6,
                        height: 6,
                        radius: 12,
                    },
                    itemMargin: {
                        horizontal: 10,
                    }
                },
                responsive: [{
                    breakpoint: 1366,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '80%',
                            },
                        },
                        grid: {
                            padding: {
                                right: 0,
                            }
                        }
                    },
                },
                {
                    breakpoint: 992,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '70%',
                            },
                        },
                    },
                },
                {
                    breakpoint: 576,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '60%',
                            },
                        },
                        grid: {
                            padding: {
                                right: 5,
                            }
                        }
                    },
                }
                ]
            };
            const chartXModelo = new ApexCharts(document.querySelector("#" + vChart), optionsXModelo);
            chartXModelo.empty = true;
            chartXModelo.render();
            chartXModelo.empty = false;
            window.dispatchEvent(new Event('resize'))
        }
    }
}

async function getObetenerPie(vPeriodoId, vMetodo, vChart, vReporte, vPromotor, vInicio, vFin, vTituloCategoria, vtituloValor, vNombreReporte) {
    const miPais = await $("#mdSelPais option:selected").val();
    const PaisSel = isNaN(parseInt(miPais)) ? 0 : parseInt(miPais);
    const urlApiFecht = menuUrlApi + "reportes/" + vMetodo;
    const urlParametro = "?pPeriodoId=" + vPeriodoId + "&pOpcion=" + vReporte + "&pUsuarioId=" + menuUserId + "&pPaisId=" + PaisSel + "&pOrigen=" + menuelOrigen + "&pPromotorId=" + vPromotor + "&pInicio=" + vInicio + "&pFin=" + vFin;
    console.log('reporte ' + vReporte, urlApiFecht + urlParametro);
    const response = await fetch(urlApiFecht + urlParametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${menuToken}`,
        }
    })
    console.log("Pie Status", response.status);
    if (response.status === 404 || response.status === 400) {
        const responseError = await response.json();
        console.log("error Pie", responseError);
    } else if (response.status === 200) {
        const object6pre = await response.json()
        const object6 = JSON.parse(object6pre);
        console.log("length Pie", object6.length);
        if (object6.length > 0) {
            let dataSeries = []
            let dataLabels = []

            for (let i = 0; i < object6.length; i++) {
                const valor1 = object6[i].mes;
                dataLabels.push(fnReturnaMes(valor1))
            }
            for (let i = 0; i < object6.length; i++) {
                const valor2 = object6[i].importe;
                dataSeries.push(valor2)
            }

            console.log("series", dataSeries);
            console.log("labels", dataLabels);
            var pieOptions = {
                series: dataSeries,
                labels: dataLabels,
                theme: {
                    palette: 'palette2'
                },
                chart: {
                    type: 'donut',
                    height: 450,
                    toolbar: {
                        show: true,
                        export: {
                            csv: {
                                headerCategory: vTituloCategoria,
                                headerValue: vtituloValor,
                                filename: vNombreReporte
                            },
                            png: { filename: vNombreReporte },
                            svg: { filename: vNombreReporte }
                        },
                    }
                },
                dataLabels: {
                    enabled: false
                },

                title: {
                    //text: "Huellas mitigadas",
                    align: "center",
                    verticalAlign: "middle",
                    offsetY: 207,
                    style: {
                        fontSize: "15px",
                        fontFamily: "helvetica, sans-serif",
                        fontWeight: 600,
                        color: "rgba(76, 175, 80, 0.77)",
                        letterSpacing: "2px"
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: "86%",
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    offsetY: -35
                                },
                                value: {
                                    show: true,
                                    fontSize: "44px",
                                    fontFamily: "helvetica, sans-serif",
                                    fontWeight: 700,
                                    letterSpacing: 700,
                                    color: "#333333",
                                    offsetY: 0,
                                    formatter: function (value) {
                                        //return value + "kg";
                                        return value;
                                    }
                                },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    //label: "CO²",
                                    fontSize: "22px",
                                    fontFamily: "Inter, helvetica, sans-serif",
                                    fontWeight: 700,
                                    color: "rgba(76, 175, 80, 0.95)",
                                    formatter: function (w) {
                                        let total = w.globals.seriesTotals.reduce((a, b) => {
                                            return a + b;
                                        }, 0);

                                        //return total + "kg";
                                        return total;
                                    }
                                }
                            }
                        }
                    }
                },
                legend: {
                    show: true,
                    width: "100%",
                    height: "auto",
                    position: "bottom",
                    offsetY: 0,
                    markers: {
                        width: 10,
                        height: 10,
                        radius: 100
                    },
                    itemMargin: {
                        horizontal: 8,
                        vertical: 8
                    }
                },
            };

            const chartPieModelo = new ApexCharts(document.querySelector("#" + vChart), pieOptions);
            chartPieModelo.empty = true;
            chartPieModelo.render();
            chartPieModelo.empty = false;
            window.dispatchEvent(new Event('resize'))
        }
    } else {
        if (response.status === 204) {
            let dataSeries = []
            let dataLabels = []
            console.log("entro else pie");
            var pieOptions = {
                series: dataSeries,
                labels: dataLabels,
                theme: {
                    palette: 'palette2'
                },
                chart: {
                    type: 'donut',
                    height: 310,
                },
                dataLabels: {
                    enabled: false
                },

                title: {
                    //text: "Huellas mitigadas",
                    align: "center",
                    verticalAlign: "middle",
                    offsetY: 207,
                    style: {
                        fontSize: "15px",
                        fontFamily: "helvetica, sans-serif",
                        fontWeight: 600,
                        color: "rgba(76, 175, 80, 0.77)",
                        letterSpacing: "2px"
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: "86%",
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    offsetY: -35
                                },
                                value: {
                                    show: true,
                                    fontSize: "44px",
                                    fontFamily: "helvetica, sans-serif",
                                    fontWeight: 700,
                                    letterSpacing: 700,
                                    color: "#333333",
                                    offsetY: 0,
                                    formatter: function (value) {
                                        //return value + "kg";
                                        return value;
                                    }
                                },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    //label: "CO²",
                                    fontSize: "22px",
                                    fontFamily: "Inter, helvetica, sans-serif",
                                    fontWeight: 700,
                                    color: "rgba(76, 175, 80, 0.95)",
                                    formatter: function (w) {
                                        let total = w.globals.seriesTotals.reduce((a, b) => {
                                            return a + b;
                                        }, 0);

                                        //return total + "kg";
                                        return total;
                                    }
                                }
                            }
                        }
                    }
                },
                legend: {
                    show: true,
                    width: "100%",
                    height: "auto",
                    position: "bottom",
                    offsetY: 0,
                    markers: {
                        width: 10,
                        height: 10,
                        radius: 100
                    },
                    itemMargin: {
                        horizontal: 8,
                        vertical: 8
                    }
                },
            };

            const chartPieModelo = new ApexCharts(document.querySelector("#" + vChart), pieOptions);
            chartPieModelo.empty = true;
            chartPieModelo.render();
            chartPieModelo.empty = false;
            window.dispatchEvent(new Event('resize'))
        }
    }
}
//FUNCIONES GENERALES
function radialCommonOption(data) {
    return {
        series: data.radialYseries,
        chart: {
            height: 150,
            type: 'radialBar',
            dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 10,
                color: data.dropshadowColor,
                opacity: 0.35
            }
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '60%',
                },
                track: {
                    strokeWidth: '45%',
                    opacity: 1,
                    margin: 5,
                },
                dataLabels: {
                    showOn: "always",
                    value: {
                        formatter: function (val) {
                            return data.radialYseries;
                        },
                        color: "var(--chart-text-color)",
                        fontSize: "18px",
                        show: true,
                        offsetY: -8,
                    }
                }
            },
        },
        colors: data.color,
        stroke: {
            lineCap: "round",
        },
        responsive: [
            {
                breakpoint: 1800,
                options: {
                    chart: {
                        height: 130,
                    }
                }
            },
        ]
    }
}
function fnReturnaMes(mes) {
    let resultado = "";
    switch (mes) {
        case 1:
            resultado = "Ene"
            break;
        case 2:
            resultado = "Feb"
            break;
        case 3:
            resultado = "Mar"
            break;
        case 4:
            resultado = "Abr"
            break;
        case 5:
            resultado = "May"
            break;
        case 6:
            resultado = "Jun"
            break;
        case 7:
            resultado = "Jul"
            break;
        case 8:
            resultado = "Ago"
            break;
        case 9:
            resultado = "Sep"
            break;
        case 10:
            resultado = "Oct"
            break;
        case 11:
            resultado = "Nov"
            break;
        case 12:
            resultado = "Dic"
            break;
        default:
            resultado = mes
    }
    return resultado;
}

async function CargarCombos() {
    const elcomboTipo4 = await getPais(0, 1);
    let cantElementos04 = elcomboTipo4.length;
    if (cantElementos04 > 0) {
        $('#mdSelPais').append($('<option/>').attr("value", "").text('Todos'));
        console.log(elcomboTipo4, 'paises');
        for (const cboobj of elcomboTipo4) {
            const valorId = cboobj.paisId;
            const valorNombre = cboobj.paisNombre;
            $('#mdSelPais').append($('<option/>').attr("value", valorId).text(valorNombre));
        }
        console.log(menuPaisId, 'pais');
        $("#mdSelPais").val(menuPaisId);
        if (parseInt(menuPerfilId) === 2) {
            //es agencia
            $("#mdSelPais").prop('readonly', true);
        } else {
            $("#mdSelPais").prop('readonly', false);
        }
    }

    if (parseInt(menuPerfilId) === 2 || parseInt(menuPerfilId) === 6 || parseInt(menuPerfilId) === 5) {
        $("#mdselPromotor").hide();
    } else {
        $("#mdselPromotor").show();
        const PaisSelId = await $("#mdSelPais option:selected").val();
        const elcomboTipo5 = await getPromotoresPais(parseInt(menuUserId), PaisSelId);
        let cantElementos05 = elcomboTipo5.length;
        if (cantElementos05 > 0) {
            $('#mdselPromotor').append($('<option/>').attr("value", "").text('---Todos---'));
            for (const cboobj of elcomboTipo5) {
                const valorId = cboobj.usuarioId;
                const valorNombre = cboobj.usuarioNombre;
                $('#mdselPromotor').append($('<option/>').attr("value", valorId).text(valorNombre));
            }
        }
    }
}