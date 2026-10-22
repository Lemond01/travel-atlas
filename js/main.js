// ==========================================================
// TRAVEL ATLAS — interacciones
// ==========================================================

// ---------- 1. Navbar al hacer scroll ----------
const header = document.querySelector('.site-header');

function revisarScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
}

revisarScroll();
window.addEventListener('scroll', revisarScroll, { passive: true });

// ---------- 2. Toast ----------
const toastEl = document.getElementById('toastGuardado');
const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });

function avisar(mensaje) {
  toastEl.querySelector('.toast-body').textContent = mensaje;
  toast.show();
}

// Guardar destino
document.querySelectorAll('.btn-save').forEach((boton) => {
  boton.addEventListener('click', () => {
    const guardado = boton.getAttribute('aria-pressed') === 'true';
    const destino = boton.dataset.destino;

    boton.setAttribute('aria-pressed', String(!guardado));
    boton.setAttribute('aria-label', `${guardado ? 'Guardar' : 'Quitar'} ${destino}`);

    avisar(guardado
      ? `${destino} se quitó de tu lista.`
      : `❤ ${destino} se guardó en tu lista de viajes.`);
  });
});

// Newsletter
const formNewsletter = document.getElementById('formNewsletter');

if (formNewsletter) {
  formNewsletter.addEventListener('submit', (evento) => {
    evento.preventDefault();
    avisar('¡Listo! Te enviaremos un destino nuevo cada semana.');
    formNewsletter.reset();
  });
}

// ---------- 3. Filtros ----------
const botonesFiltro = document.querySelectorAll('[data-filter]');
const tarjetas = document.querySelectorAll('#gridDestinos [data-category]');
const contador = document.getElementById('contador');

function filtrar(categoria) {
  let visibles = 0;

  tarjetas.forEach((tarjeta) => {
    const cat = tarjeta.dataset.category;
    const mostrar = cat === 'sugerencia' || categoria === 'todos' || cat === categoria;
    tarjeta.classList.toggle('d-none', !mostrar);
    if (mostrar && cat !== 'sugerencia') visibles++;
  });

  botonesFiltro.forEach((boton) => {
    const activo = boton.dataset.filter === categoria;
    boton.classList.toggle('active', activo);
    boton.setAttribute('aria-pressed', String(activo));
  });

  if (contador) contador.textContent = visibles;
}

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => filtrar(boton.dataset.filter));
});

if (botonesFiltro.length) {
  const desdeUrl = new URLSearchParams(window.location.search).get('cat');
  const valida = [...botonesFiltro].some((b) => b.dataset.filter === desdeUrl);
  filtrar(valida ? desdeUrl : 'todos');
}

// ---------- 4. Offcanvas ----------
document.querySelectorAll('#menu a[href^="#"]').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    const menu = bootstrap.Offcanvas.getInstance(document.getElementById('menu'));
    if (menu) menu.hide();
  });
});

// ---------- 5. Selección de tarjetas ----------
const tarjetasDestino = document.querySelectorAll('#gridDestinos .card-destino');

function seleccionar(columna) {
  document.querySelectorAll('#gridDestinos .seleccionada').forEach((otra) => {
    otra.classList.remove('seleccionada');
    otra.querySelector('.card-destino').removeAttribute('aria-current');
  });
  columna.classList.add('seleccionada');
  columna.querySelector('.card-destino').setAttribute('aria-current', 'true');
  history.replaceState(null, '', `#${columna.id}`);
}

tarjetasDestino.forEach((tarjeta) => {
  const columna = tarjeta.closest('.col');

  tarjeta.addEventListener('click', (evento) => {
    if (evento.target.closest('.btn-save')) return;
    seleccionar(columna);
  });

  tarjeta.addEventListener('keydown', (evento) => {
    if (evento.target !== tarjeta) return;
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      seleccionar(columna);
    }
  });
});

if (location.hash) {
  const desdeInicio = document.getElementById(location.hash.slice(1));
  if (desdeInicio && desdeInicio.querySelector('.card-destino')) seleccionar(desdeInicio);
}
