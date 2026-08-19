const menuToken = eltokenMen;
const menuUrlApi = elurlApiMen;
const menuUserId = elUserId;
const menuUserAcc = elUserAcc;
const menuPerfilId = elPerfilId;
const menuPaisId = elPaisId;
const menuEmpresaId = laEmpresarId;
const menuDesCorreo = eldesCorreo;
const menuidPageDashboard = elidPageDashboard;
const menuelapiUrlImagenes = elapiUrlImagenes;
const menuelOrigen = elOrigen;
const menuelAgenciaUsuarioId = laAgenciaUsuarioId;
const menuelAgenciaPaisId = laAgenciaPaisId
const nomeUsuario = elNombreUsuario;
//console.log(menuelOrigen, "origen");
//console.log(menuelAgenciaUsuarioId, "AgenciaId");
//console.log(menuelAgenciaPaisId, "AgenciaPaisId");
cargaMenu();
async function cargaMenu() {
    const menuListadoAcc = await getMenu();
    const principales = menuListadoAcc.filter((x) => x.menuIdPadre == 0);
    const secundarios = menuListadoAcc.filter((x) => x.menuIdPadre != 0);

    let menuTree = document.getElementById('simple-bar');

    for (const pri of principales) {
        const menuIdPadre = pri.menuId;
        const menuNombre = pri.menuNombre;
        const menuPagina = pri.menuPagina;
        const submenus = secundarios.filter((z) => z.menuIdPadre == menuIdPadre);

        if (submenus.length > 0) {
            let li_menu = document.createElement('li');
            li_menu.setAttribute("class", "sidebar-main-title");
            let dv_menu = document.createElement('div');
            let h6_menu = document.createElement('h6');
            h6_menu.innerText = menuNombre
            dv_menu.appendChild(h6_menu)
            li_menu.appendChild(dv_menu)
            menuTree.children[0].children[1].children[0].children[0].children[0].appendChild(li_menu);

            for (const sub of submenus) {
                const submenuNombre = sub.menuNombre;
                const submenuRuta = sub.menuPagina;
                const submenuIcono = sub.menuIcono;
                let li_submenu = document.createElement('li');
                li_submenu.setAttribute("class", "sidebar-list");
                let a_submenu = document.createElement('a');
                a_submenu.setAttribute("class", "sidebar-link sidebar-title link-nav");
                a_submenu.setAttribute("href", submenuRuta);
                let sv_submenu = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                sv_submenu.setAttribute("class", "stroke-icon");
                let us_submenu = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                us_submenu.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', submenuIcono);
                sv_submenu.appendChild(us_submenu);
                let sp_submenu = document.createElement('span');
                sp_submenu.innerText = submenuNombre
                let div_submenu = document.createElement('div');
                div_submenu.setAttribute("class", "according-menu");
                let i_submenu = document.createElement('i');
                i_submenu.setAttribute("class", "fa fa-angle-right");
                div_submenu.appendChild(i_submenu);
                a_submenu.appendChild(sv_submenu);
                a_submenu.appendChild(sp_submenu);
                a_submenu.appendChild(div_submenu);

                a_submenu.addEventListener('click', function (e) {
                    localStorage.setItem('activeMenuItem', submenuRuta);

                    const sidebarContainer = document.querySelector('#simple-bar .simplebar-content-wrapper') ||
                        document.querySelector('.sidebar-wrapper');

                    if (sidebarContainer) {
                        const elementTop = li_submenu.offsetTop;
                        sidebarContainer.scrollTo({
                            top: elementTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });

                li_submenu.appendChild(a_submenu);
                menuTree.children[0].children[1].children[0].children[0].children[0].appendChild(li_submenu);

                if (window.location.pathname === submenuRuta ||
                    localStorage.getItem('activeMenuItem') === submenuRuta) {
                    li_submenu.classList.add('active');
                }
            }
        }
    }

    // ✅ Funzione helper per lo scroll (evita duplicazione codice)
    function scrollToActive() {
        const activeItem = document.querySelector('.sidebar-list.active');
        const sidebarContainer =
            document.querySelector('#simple-bar .simplebar-content-wrapper') ||
            document.querySelector('.simplebar-scroll-content') ||
            document.querySelector('.sidebar-wrapper') ||
            document.querySelector('#simple-bar');

        console.log('🔍 [SCROLL DEBUG] Active item found:', activeItem);
        console.log('🔍 [SCROLL DEBUG] Sidebar container:', sidebarContainer);
        console.log('🔍 [SCROLL DEBUG] Element top:', activeItem ? activeItem.offsetTop : 'N/A');

        if (activeItem && sidebarContainer) {
            const elementTop = activeItem.offsetTop;
            const scrollTarget = elementTop - 100;

            console.log('✅ [SCROLL DEBUG] Attempting scroll to:', scrollTarget);

            // Metodo 1: scrollTo con smooth behavior
            try {
                sidebarContainer.scrollTo({
                    top: scrollTarget,
                    behavior: 'smooth'
                });

                // ✅ Verifica se lo scroll è avvenuto dopo 100ms
                setTimeout(() => {
                    const currentScroll = sidebarContainer.scrollTop;
                    console.log('📊 [SCROLL DEBUG] Current scroll position:', currentScroll);

                    // Se lo scroll non è cambiato, prova metodo alternativo
                    if (Math.abs(currentScroll - scrollTarget) > 50) {
                        console.warn('⚠️ [SCROLL DEBUG] scrollTo non ha funzionato, uso scrollTop diretto');
                        sidebarContainer.scrollTop = scrollTarget;
                    } else {
                        console.log('✅ [SCROLL DEBUG] Scroll completato con successo');
                    }
                }, 200);

            } catch (error) {
                console.error('❌ [SCROLL DEBUG] Errore durante scrollTo:', error);
                // Fallback: scroll diretto
                sidebarContainer.scrollTop = scrollTarget;
            }

            return true;
        }

        console.warn('❌ [SCROLL DEBUG] Elementi non trovati per lo scroll');
        return false;
    }

    // ✅ Primo tentativo: requestAnimationFrame (veloce)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const scrolled = scrollToActive();

            // ✅ Fallback: se il primo tentativo fallisce, riprova dopo 800ms
            if (!scrolled) {
                console.warn('⏱️ Primo tentativo di scroll fallito, attivazione fallback...');
                setTimeout(() => {
                    scrollToActive();
                }, 800);
            }
        });
    });
}

async function getMenu() {
    const urlApiFecht = menuUrlApi + "generales/MenuPerfilObtener";
    const urlParametro = "?pPerfilId=" + menuPerfilId;
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