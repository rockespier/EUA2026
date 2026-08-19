(function () {
    function debounce(fn, ms) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, arguments), ms);
        };
    }

    function computeAvailableHeight() {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const header = document.querySelector('.page-title');
        const headerH = header ? header.getBoundingClientRect().height : 0;
        // spazio riservato per margini, bottoni nella card, footer, ecc. regola se necessario
        const reserved = 180;
        const minHeight = 220;
        const available = Math.max(minHeight, Math.floor(vh - headerH - reserved));
        return available;
    }

    function applyHeightToTable(selector) {
        const el = document.querySelector(selector);
        if (!el) return;
        const dtSelector = selector; // es: '#dtVenta'
        // se DataTable è inizializzato, adattiamo il .dataTables_scrollBody
        if (window.jQuery && jQuery.fn.DataTable && jQuery.fn.DataTable.isDataTable(dtSelector)) {
            const dt = jQuery(dtSelector).DataTable();
            const wrapper = dt.table().container();
            if (wrapper) {
                const scrollBody = wrapper.querySelector('.dataTables_scrollBody');
                if (scrollBody) {
                    scrollBody.style.height = computeAvailableHeight() + 'px';
                }
            }
            // refresh per ridimensionare eventuali componenti fissi
            try { dt.draw(false); } catch (e) { /* ignore */ }
        } else {
            // Se non ancora inizializzato, applico altezza al contenitore per quando DataTable lo userà
            const parent = el.closest('.table-responsive') || el.parentElement;
            if (parent) parent.style.maxHeight = computeAvailableHeight() + 'px';
        }
    }

    function applyAll() {
        applyHeightToTable('#dtVenta');
        applyHeightToTable('#dtVenta2');
    }

    document.addEventListener('DOMContentLoaded', function () {
        // prima applicazione (utile se DataTables già inizializzati)
        applyAll();
        // riassegna al resize
        window.addEventListener('resize', debounce(applyAll, 150));
        // se DataTables sono inizializzati in un file esterno dopo DOMContentLoaded,
        // puoi richiamare manualmente applyAll() dopo l'inizializzazione.
    });
})();