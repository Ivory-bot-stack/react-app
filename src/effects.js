/* ==========================================================
   Instituto al Mundo — script.js (vanilla, sin librerías)
   ========================================================== */
export function initEffects() {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- 1. Rendimiento adaptativo ---- */
  const weak = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
               (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
               navigator.connection?.saveData;
  if (weak || reduce) document.documentElement.classList.add('lite');

  /* ---- 3. Scroll reveal + estado de secciones ---- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.rv:not(.hero .rv), .verse, .path, .final').forEach(e => io.observe(e));
  if (reduce) $$('.rv,.verse,.path,.final').forEach(e => e.classList.add('in'));

  /* ---- 4. Navegación activa ---- */
  const links = $$('.nav a');
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -45% 0px' });
  $$('main section[id]').forEach(s => navIO.observe(s));

  /* ---- 5. Contador + efecto lectura ---- */
  const counter = $('#counter'), cur = $('#cur'), verses = $$('.verse');
  const vIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      verses.forEach(v => v.classList.remove('focus'));
      e.target.classList.add('focus');
      cur.textContent = '0' + e.target.dataset.n;
      counter.classList.add('show'); document.body.classList.add('reading');
    }
  }), { rootMargin: '-35% 0px -35% 0px' });
  verses.forEach(v => vIO.observe(v));
  // Fuera del bloque de citas: restaurar interfaz
  const sec = $('#intercesion');
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) { counter.classList.remove('show'); document.body.classList.remove('reading'); verses.forEach(v => v.classList.remove('focus')); }
  }, { threshold: 0 }).observe(sec);

  /* ---- 6. Barra de progreso (rAF, solo transform) ---- */
  const bar = $('#progress'); let tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`; tick = false;
    });
  }, { passive: true });

  /* ---- 8. Spotlight: cursor (desktop) / dedo (móvil) / ambiente ---- */
  const spot = $('#spot'); let sx = innerWidth / 2, sy = innerHeight * .4;
  const moveSpot = (x, y) => { sx = x; sy = y; spot.style.transform = `translate3d(${x}px,${y}px,0)`; };
  if (!reduce && !weak) {
    addEventListener('pointermove', e => moveSpot(e.clientX, e.clientY), { passive: true });
    addEventListener('touchmove', e => moveSpot(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    if (!desktop) { let t = 0; setInterval(() => { t += .02; if (!document.hidden) moveSpot(innerWidth * (.5 + .3 * Math.sin(t)), innerHeight * (.4 + .2 * Math.cos(t * .8))); }, 100); }
  }

  /* ---- 9. Solo desktop: cursor, botón magnético, inclinación 3D, parallax ---- */
  if (desktop && !reduce) {
    const cu = $('#cursor');
    addEventListener('pointermove', e => cu.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`, { passive: true });
    $$('a,.btn').forEach(a => { a.addEventListener('pointerenter', () => cu.classList.add('big')); a.addEventListener('pointerleave', () => cu.classList.remove('big')); });
    $$('.mag').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
    if (!weak) $$('.card3d,.verse').forEach(c => {
      c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`; });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
    addEventListener('pointermove', e => { // parallax suave de orbes
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      $$('.orb').forEach((o, i) => o.style.translate = `${x * (i + 1) * -18}px ${y * (i + 1) * -18}px`);
    }, { passive: true });
  }

  /* ---- 10. Inclinación en móvil (solo si el dispositivo lo permite y no es débil) ---- */
  if (!desktop && !reduce && !weak && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    const logo = $('.hero-logo'); let busy = false;
    addEventListener('deviceorientation', e => {
      if (busy || e.gamma == null) return; busy = true;
      requestAnimationFrame(() => { logo.style.translate = `${Math.max(-1, Math.min(1, e.gamma / 30)) * 8}px 0`; busy = false; });
    }, { passive: true });
  }
}
