/* Progressive artwork filters and an editable WhatsApp enquiry draft. */
(() => {
  'use strict';

  const filters = document.getElementById('galleryFilters');
  const status = document.getElementById('galleryFilterStatus');
  if (filters && status) {
    const buttons = [...filters.querySelectorAll('[data-gallery-filter]')];
    const artworks = [...document.querySelectorAll('[data-artwork-categories]')];
    const names = { pencil: 'Pencil', colour: 'Colour', painting: 'Paintings' };
    buttons.forEach(button => button.addEventListener('click', () => {
      const selected = button.dataset.galleryFilter;
      let shown = 0;
      artworks.forEach(artwork => {
        const categories = (artwork.dataset.artworkCategories || '').split(/\s+/);
        const visible = selected === 'all' || categories.includes(selected);
        artwork.hidden = !visible;
        if (visible) shown += 1;
      });
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      status.textContent = selected === 'all'
        ? `Showing all ${shown} artworks.`
        : `${names[selected] || 'Artwork'}: ${shown} ${shown === 1 ? 'artwork' : 'artworks'} shown.`;
    }));
    filters.hidden = false;
    status.textContent = `Showing all ${artworks.length} artworks.`;
  }

  const form = document.getElementById('whatsappEnquiry');
  if (!form) return;
  form.addEventListener('submit', () => {
    const artwork = document.getElementById('waArtwork').value.trim();
    const size = document.getElementById('waSize').value.trim();
    const people = document.getElementById('waPeople').value.trim();
    const lines = ['Hello Satyam,', `I’d like to enquire about ${artwork}.`];
    if (size) lines.push(`Preferred size or notes: ${size}.`);
    if (people) lines.push(`People in the portrait: ${people}.`);
    lines.push('I can share a reference photo in this chat if needed.');
    form.elements.namedItem('text').value = lines.join('\n');
  });
})();
