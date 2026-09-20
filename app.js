document.addEventListener('DOMContentLoaded', () => {
    // Selectores del DOM
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const clearSearchBtn = document.getElementById('clear-search');
    const shareBtn = document.getElementById('share-website-btn');
    const shareHeaderBtn = document.getElementById('share-header-btn');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const floatingCart = document.getElementById('floating-cart');
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    const cartCount = document.getElementById('cart-count');
    const promosContainer = document.getElementById('promos-container');
    const btnPrev = document.getElementById('promo-prev');
    const btnNext = document.getElementById('promo-next');

    // Configuración física del Carrusel Infinito Seamless
    const BUFFER_SIZE = 3; 
    let promoNodeIndex = BUFFER_SIZE; 
    let promoTimer = null;
    let isMoving = false; 

    // Variables de control de arrastre manual (Swipe)
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let initialTranslate = 0;

    const WHATSAPP_PHONE = "5217791063722"; 
    let miListaMedicamentos = cargarListaDeAlmacenamiento();

    renderizarSeccionPromociones();
    actualizarInterfazCarrito();

    // =========================================================================
    // 🎯 ARQUITECTURA DEL CARRUSEL INFINITO DE PROMOCIONES
    // =========================================================================
    function renderizarSeccionPromociones() {
        if (!promosContainer || typeof PRODUCTOS_PROMOCION === 'undefined' || PRODUCTOS_PROMOCION.length === 0) return;
        promosContainer.innerHTML = ''; 

        const ultimasClonadas = PRODUCTOS_PROMOCION.slice(PRODUCTOS_PROMOCION.length - BUFFER_SIZE);
        const primerasClonadas = PRODUCTOS_PROMOCION.slice(0, BUFFER_SIZE);
        const listaExtendida = [...ultimasClonadas, ...PRODUCTOS_PROMOCION, ...primerasClonadas];

        listaExtendida.forEach((promo, idx) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = `promo-card ${idx === BUFFER_SIZE ? 'active' : ''}`;
            
            const textoWhatsAppPromo = encodeURIComponent(`Hola, vi en la sección de ofertas de su página web la promoción de "${promo.nombre}" (${promo.precioOferta}) y me interesa saber si tienen disponibles en la sucursal.`);
            const urlPromoWhatsApp = `https://wa.me/${WHATSAPP_PHONE}?text=${textoWhatsAppPromo}`;

            cardDiv.innerHTML = `
                <span class="promo-tag">${promo.tag}</span>
                <div><h3>${promo.nombre}</h3><p>${promo.descripcion}</p></div>
                <div class="promo-action-area">
                    <span class="promo-price">${promo.precioOferta}</span>
                    <a href="${urlPromoWhatsApp}" target="_blank" class="btn-item-wa">
                        Consultar <span class="material-icons-round">chat</span>
                    </a>
                </div>`;
            promosContainer.appendChild(cardDiv);
        });

        const viewport = promosContainer.parentElement;
        if (viewport) {
            viewport.className = 'promo-viewport';
            configurarEventosArrastre(viewport);
        }

        const tarjetas = promosContainer.querySelectorAll('.promo-card');
        if (tarjetas.length > 0) {
            setTimeout(() => calcularDesplazamientoCarrusel(tarjetas, true), 100);
            if (PRODUCTOS_PROMOCION.length > 1) iniciarTemporizadorCarrusel();
        }

        if (btnNext) btnNext.addEventListener('click', () => moverCarruselManual('next'));
        if (btnPrev) btnPrev.addEventListener('click', () => moverCarruselManual('prev'));

        promosContainer.addEventListener('transitionend', () => {
            isMoving = false; 
            const tarjetasActuales = promosContainer.querySelectorAll('.promo-card');
            const totalReales = PRODUCTOS_PROMOCION.length;

            if (promoNodeIndex >= totalReales + BUFFER_SIZE) {
                tarjetasActuales[promoNodeIndex].classList.remove('active');
                promoNodeIndex = BUFFER_SIZE; 
                tarjetasActuales[promoNodeIndex].classList.add('active');
                calcularDesplazamientoCarrusel(tarjetasActuales, true); 
            } 
            else if (promoNodeIndex <= BUFFER_SIZE - 1) {
                tarjetasActuales[promoNodeIndex].classList.remove('active');
                promoNodeIndex = totalReales + BUFFER_SIZE - 1; 
                tarjetasActuales[promoNodeIndex].classList.add('active');
                calcularDesplazamientoCarrusel(tarjetasActuales, true); 
            }
        });
    }

    function iniciarTemporizadorCarrusel() {
        if (promoTimer) clearInterval(promoTimer);
        promoTimer = setInterval(() => moverCarruselManual('next'), 8000); // 8 SEGUNDOS
    }

    function moverCarruselManual(direccion) {
        if (isMoving) return; 
        const tarjetas = promosContainer.querySelectorAll('.promo-card');
        if (tarjetas.length === 0) return;

        isMoving = true;
        tarjetas[promoNodeIndex].classList.remove('active');

        if (direccion === 'next') {
            promoNodeIndex++;
        } else {
            promoNodeIndex--;
        }

        tarjetas[promoNodeIndex].classList.add('active');
        calcularDesplazamientoCarrusel(tarjetas, false);
        iniciarTemporizadorCarrusel(); 
    }

    function calcularDesplazamientoCarrusel(tarjetas, instantaneo = false) {
        const viewportContainer = promosContainer.parentElement;
        if (!viewportContainer) return;

        const widthVentana = viewportContainer.offsetWidth; 
        const tarjetaActual = tarjetas[promoNodeIndex];
        if (!tarjetaActual) return;

        const centroTarjeta = tarjetaActual.offsetLeft + (tarjetaActual.offsetWidth / 2);
        const centroPantalla = widthVentana / 2;
        const totalTranslateX = centroPantalla - centroTarjeta;

        if (instantaneo) {
            promosContainer.style.transition = 'none'; 
        } else {
            promosContainer.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'; 
        }
        promosContainer.style.transform = `translateX(${totalTranslateX}px)`;
    }

    function configurarEventosArrastre(viewport) {
        viewport.addEventListener('mousedown', startDrag);
        viewport.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', endDrag);
        viewport.addEventListener('touchstart', startDrag, { passive: true });
        viewport.addEventListener('touchmove', dragMove, { passive: true });
        window.addEventListener('touchend', endDrag);
    }

    function getPositionX(e) { return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX; }

    function startDrag(e) {
        if (e.target.closest('.btn-item-wa') || e.target.closest('.promo-nav-btn') || isMoving) return;
        isDragging = true;
        startX = getPositionX(e);
        currentX = startX;
        if (promoTimer) clearInterval(promoTimer);
        const style = window.getComputedStyle(promosContainer);
        const matrix = style.transform || style.webkitTransform;
        initialTranslate = (matrix && matrix !== 'none') ? parseFloat(matrix.split(',')[4]) : 0;
        promosContainer.style.transition = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;
        currentX = getPositionX(e);
        promosContainer.style.transform = `translateX(${initialTranslate + (currentX - startX)}px)`;
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        const tarjetas = promosContainer.querySelectorAll('.promo-card');
        const diffX = currentX - startX;
        
        if (Math.abs(diffX) > 50) {
            isMoving = true;
            tarjetas[promoNodeIndex].classList.remove('active');
            if (diffX < -50) promoNodeIndex++;
            else promoNodeIndex--;
            tarjetas[promoNodeIndex].classList.add('active');
        }
        calcularDesplazamientoCarrusel(tarjetas, false);
        iniciarTemporizadorCarrusel();
    }

    // BUSCADOR OPTIMIZADO CON TEXTOS ESTANDARIZADOS Y SALTO DE LÍNEA


    function buscarMedicamentos(query) {
        const palabras = query.split(' ');
        const resultados = INVENTARIO_MEDICAMENTOS.filter(p => palabras.every(pal => p.toLowerCase().includes(pal)));
        resultsContainer.innerHTML = '';
        
        if (resultados.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results"><p>No lo encontramos en el catálogo, pero pregúntanos por WhatsApp para conseguirlo.</p></div>';
            return;
        }
        
        resultados.slice(0, 15).forEach(nombreProducto => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'product-item';
            const estaEnLista = miListaMedicamentos.includes(nombreProducto);
            
            const textoIndividual = encodeURIComponent(`Hola, vi en su página web el producto "${nombreProducto}" y me gustaría saber si lo tienen disponible actualmente en Nuvaria Farmacia.`);
            const urlIndividual = `https://wa.me/${WHATSAPP_PHONE}?text=${textoIndividual}`;

            const btnClass = estaEnLista ? 'btn-remove-list' : 'btn-add-list';
            const iconName = estaEnLista ? 'remove_shopping_cart' : 'shopping_bag';
            const btnText = estaEnLista ? 'Quitar de mi<br>lista' : 'Añadir a mi<br>lista'; 

            itemDiv.innerHTML = `
                <div class="product-info">
                    <h4>${nombreProducto}</h4>
                </div>
                <div class="product-actions">
                    <button class="action-list-btn ${btnClass}" data-prod="${nombreProducto}">
                        <span class="material-icons-round">${iconName}</span>
                        <span class="btn-text-content">${btnText}</span>
                    </button>
                    <a href="${urlIndividual}" target="_blank" class="btn-item-wa">
                        <span class="btn-text-content">Preguntar por este<br>medicamento</span>
                        <span class="material-icons-round">chat</span>
                    </a>
                </div>`;
            
            itemDiv.querySelector('.action-list-btn').addEventListener('click', (e) => alternarProducto(nombreProducto, e.currentTarget));
            resultsContainer.appendChild(itemDiv);
        });
    }

    function alternarProducto(nombre, btn) {
        const idx = miListaMedicamentos.indexOf(nombre);
        const iconNode = btn.querySelector('.material-icons-round');
        const textNode = btn.querySelector('.btn-text-content');

        if (idx === -1) {
            miListaMedicamentos.push(nombre);
            btn.className = 'action-list-btn btn-remove-list';
            if (iconNode) iconNode.textContent = 'remove_shopping_cart';
            if (textNode) textNode.innerHTML = 'Quitar de mi<br>lista';
        } else {
            miListaMedicamentos.splice(idx, 1);
            btn.className = 'action-list-btn btn-add-list';
            if (iconNode) iconNode.textContent = 'shopping_bag';
            if (textNode) textNode.innerHTML = 'Añadir a mi<br>lista';
        }
        guardarListaEnAlmacenamiento();
        actualizarInterfazCarrito();
    }

    // LÓGICA DE TRÁFICO DE MENÚS Y COMPARTIR


    window.addEventListener('resize', () => {
        const tarjetas = promosContainer.querySelectorAll('.promo-card');
        if (tarjetas.length > 0) calcularDesplazamientoCarrusel(tarjetas, true);
    });

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.querySelector('.material-icons-round').textContent = mainNav.classList.contains('active') ? 'close' : 'menu';
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 0) { clearSearchBtn.style.display = 'block'; buscarMedicamentos(query); }
        else { clearSearchBtn.style.display = 'none'; restaurarEstadoInicial(); }
    });

    clearSearchBtn.addEventListener('click', () => { searchInput.value = ''; clearSearchBtn.style.display = 'none'; restaurarEstadoInicial(); searchInput.focus(); });
    function restaurarEstadoInicial() { resultsContainer.innerHTML = '<div class="initial-message"><span class="material-icons-round">manage_search</span><p>Comienza a escribir para buscar entre nuestros más de 6,000 productos disponibles.</p></div>'; }
    
    function actualizarInterfazCarrito() {
        const total = miListaMedicamentos.length;
        cartCount.textContent = total;
        if (total > 0) {
            floatingCart.classList.add('visible');
            let msj = "Hola, buenas tardes. Revisé el catálogo de la página web de Nuvaria Farmacia y me gustaría consultar la disponibilidad de la siguiente lista:\n" + miListaMedicamentos.map((p,i)=>`${i+1}. ${p}`).join('\n');
            floatingCartBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msj)}`;
        } else floatingCart.classList.remove('visible');
    }
    
    function guardarListaEnAlmacenamiento() { localStorage.setItem('lista_nuvaria_farmacia', JSON.stringify(miListaMedicamentos)); }
    function cargarListaDeAlmacenamiento() { const d = localStorage.getItem('lista_nuvaria_farmacia'); return d ? JSON.parse(d) : []; }
    
    async function compartir() {
        try { await navigator.share({title:'Nuvaria Farmacia', url: window.location.href}); }
        catch { navigator.clipboard.writeText(window.location.href); alert('¡Enlace de la página copiado al portapapeles!'); }
    }
    shareBtn.addEventListener('click', compartir);
    shareHeaderBtn.addEventListener('click', (e) => { e.preventDefault(); compartir(); });
});