/* Passive Pointer Events keep native scrolling, links and image previews intact. */
(() => {
 'use strict';
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.card,.other-card,.paint,.gallery-card,.fact,.step,.order-contact,.quote').forEach(el => { el.dataset.spatial = 'card'; el.classList.add('depth-panel'); });
 const surfaces = [...document.querySelectorAll('[data-spatial]')];
 const states = new WeakMap();
 function reset(el) {
  const state = states.get(el);
  if (state) { cancelAnimationFrame(state.frame); clearTimeout(state.timer); state.frame = 0; }
  el.style.removeProperty('--rx'); el.style.removeProperty('--ry');
  el.classList.remove('spatial-active');
 }
 function move(el, event) {
  if (motion.matches || (event.isPrimary === false)) return;
  let state = states.get(el);
  if (!state) { state = { frame: 0, timer: 0 }; states.set(el, state); }
  state.x = event.clientX; state.y = event.clientY;
  if (state.frame) return;
  state.frame = requestAnimationFrame(() => {
   state.frame = 0;
   const rect = el.getBoundingClientRect();
   const x = Math.max(-1, Math.min(1, (state.x - rect.left) / rect.width * 2 - 1));
   const y = Math.max(-1, Math.min(1, (state.y - rect.top) / rect.height * 2 - 1));
   const limit = el.dataset.spatial === 'room' ? 6 : (el.matches('.step,.order-contact,.quote') ? 2 : 3.5);
   el.style.setProperty('--rx', `${(-y * limit).toFixed(2)}deg`);
   el.style.setProperty('--ry', `${(x * limit).toFixed(2)}deg`);
   el.style.setProperty('--mx', `${((x + 1) * 50).toFixed(1)}%`);
   el.style.setProperty('--my', `${((y + 1) * 50).toFixed(1)}%`);
   el.classList.add('spatial-active');
  });
 }
 surfaces.forEach(el => {
  el.addEventListener('pointermove', e => move(el, e), {passive:true});
  el.addEventListener('pointerdown', e => move(el, e), {passive:true});
  el.addEventListener('pointerleave', () => reset(el), {passive:true});
  el.addEventListener('pointercancel', () => reset(el), {passive:true});
  el.addEventListener('pointerup', e => {
   if (e.pointerType !== 'mouse') {
    const state = states.get(el);
    if (state) { clearTimeout(state.timer); state.timer = setTimeout(() => reset(el), 450); }
   }
  }, {passive:true});
 });
 // One-off exhibition entrances; no scroll-loop rendering or hidden content.
 const arrivals = [...document.querySelectorAll('.depth-panel,.heading')];
 const timers = new Map();
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) { reset(entry.target); return; }
   observer.unobserve(entry.target);
   if (motion.matches) return;
   entry.target.classList.add('exhibition-arrive');
   timers.set(entry.target, setTimeout(() => {
    entry.target.classList.remove('exhibition-arrive'); timers.delete(entry.target);
   }, 900));
  });
 }, {threshold: .12});
 arrivals.forEach(el => observer.observe(el));
 // Reset active panels when scrolling them out of view, with no perpetual animation.
 const visibility = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) reset(entry.target);
 }), {threshold:0});
 surfaces.forEach(el => visibility.observe(el));
 motion.addEventListener('change', () => {
  surfaces.forEach(reset);
  timers.forEach((timer,el) => {clearTimeout(timer);el.classList.remove('exhibition-arrive');}); timers.clear();
 });
 window.addEventListener('blur', () => surfaces.forEach(reset));
 document.addEventListener('visibilitychange', () => { if (document.hidden) surfaces.forEach(reset); });
})();
