/* Passive Pointer Events keep native scrolling, links and image previews intact. */
(() => {
 'use strict';
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.card,.other-card,.paint,.gallery-card,.fact').forEach(el => el.dataset.spatial = 'card');
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
   const limit = el.dataset.spatial === 'room' ? 6 : 4;
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
 motion.addEventListener('change', () => surfaces.forEach(reset));
 window.addEventListener('blur', () => surfaces.forEach(reset));
 document.addEventListener('visibilitychange', () => { if (document.hidden) surfaces.forEach(reset); });
})();
