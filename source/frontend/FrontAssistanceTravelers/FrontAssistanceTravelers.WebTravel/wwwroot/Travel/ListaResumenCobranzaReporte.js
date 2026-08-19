hideLoader();
IniciarFechaDatosVigencia();
//iniciarPredeterminado();
function showLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}
async function iniciarPredeterminado() {
    let AgenciaId = 0;
    if (menuelOrigen !== 'U') {
        AgenciaId = menuelAgenciaUsuarioId;
    }
    if (AgenciaId === 0) {
        let PaisId = "0";
        if (menuUserId !== "1") {
            PaisId = menuPaisId.toString();
        }
        const elcomboAgencia = await getAgencia(0, -1, PaisId, 0, '', '');
        let cantElementos00 = elcomboAgencia.length;
        if (cantElementos00 > 0) {
            var dataSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('agenciaNombre'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: elcomboAgencia
            });
            $('#mdvenSelAgenciasResRep').typeahead(
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

            $('#mdvenSelAgenciasResRep').on('typeahead:select', async function (e, selection) {
                $('#mdvenSelAgenciasResRep').val(selection.agenciaId); // Muestra el ID en el input
                localStorage.setItem("lsagenciaIdSelVentaResRep", selection.agenciaId); // Guarda el ID
            });
        }
    }
}

async function IniciarFechaDatosVigencia() {
    const fechaHoy = new Date();
    const strfechaHoyDia = ("0" + fechaHoy.getDate()).slice(-2)
    const strfechaHoyMes = ("0" + (fechaHoy.getMonth())).slice(-2)
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
$('#mdvenFecIni').change(async function () {
    const strfechaSelecVigIni = $(this).val();
    document.getElementById("mdvenFecFin").min = strfechaSelecVigIni;
});
async function limpiarIniciarBusuqueda() {
    IniciarFechaDatosVigencia();
    //$('#mdvenSelAgenciasResRep').val(""); 
    //localStorage.removeItem('lsagenciaIdSelVentaResRep');
}


async function exportaReporteResumen() {
    const sesionActiva = await fetch('/validateJS', { credentials: 'include' });
    if (!sesionActiva.ok) {
        const currentUrl = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentUrl);
        window.location.href = `/Autenticacion/Acceso?returnUrl=${returnUrl}`;
        return;
    }
    try {
        //let agenciaId = localStorage.getItem("lsagenciaIdSelVentaResRep");
        //if (document.getElementById("mdvenSelAgenciasResRep").value == "") {
            //localStorage.removeItem('lsagenciaIdSelVentaResRep');
            //agenciaId = 0;
        //}
        const codLiquidacion = document.getElementById("txtCodLiquidacion").value;

        if (codLiquidacion === "") {
            codLiquidacion = "0";
        }

        const fechaIni = document.getElementById("mdvenFecIni").value;
        const fechaFin = document.getElementById("mdvenFecFin").value;

        const fechaIniMoment = moment(fechaIni, "YYYY-MM-DD");
        const dtfechaIni = fechaIniMoment.toDate();
        let dtfechaVigINI = formatearFechaString(dtfechaIni);
        const fechaFinMoment = moment(fechaFin, "YYYY-MM-DD");
        const dtfechaFin = fechaFinMoment.toDate();
        let dtfechaVigFIN = formatearFechaString(dtfechaFin);
        
        const resumenParama = {
            agenciaId: "0",
            fechaIni: dtfechaVigINI,
            fechaFin: dtfechaVigFIN,
            usuarioId: menuUserId,
            codliquidacion: codLiquidacion
        };
        let response = await fetch('/ReporteResumenExcel', {
            method: 'POST',
            headers: {
                'Accept': 'application/octet-stream',  // Expecting a PDF response
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resumenParama)
        });
        if (response.ok) {
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = '';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const fileNameMatch = contentDisposition.match(/filename\*?=\s*['"]?([^'";\s]+)/);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = fileNameMatch[1];
                }
            }
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            //limpiarIniciarBusuqueda();
        } else {
            mostrarMensaje(1, "Error al generar el archivo.");
        }
    } catch (error) {
        mostrarMensaje(1, "Error inesperado: " + error);
    } finally {
        hideLoader();
    }
}
