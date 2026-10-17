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
  const artworkInput = document.getElementById('waArtwork');
  const peopleInput = document.getElementById('waPeople');
  const peopleField = document.getElementById('waPeopleField');
  const review = document.getElementById('waReview');
  const reviewButton = document.getElementById('waReviewButton');
  const nameInput = document.getElementById('waName');
  const phoneInput = document.getElementById('waPhone');
  let reviewed = false;

  function message() {
    const artwork = artworkInput.value.trim();
    const size = document.getElementById('waSize').value.trim();
    const people = peopleInput.disabled ? '' : peopleInput.value.trim();
    const lines = ['Hello Satyam,', `My name: ${nameInput.value.trim()}`, `Phone / WhatsApp: ${phoneInput.value.trim()}`, `I’d like to enquire about ${artwork}.`];
    if (size) lines.push(`Preferred size or notes: ${size}`);
    if (people) lines.push(`People in the portrait: ${people}.`);
    const requirements = document.getElementById('waRequirements').value.trim();
    if (requirements) lines.push(`Portrait description / requirements: ${requirements}`);
    lines.push('I can share a reference photo in this chat if needed.');
    lines.push('Please confirm the final quote, size, medium, frame options, payment terms, completion time and delivery details before I confirm the order.');
    return lines.join('\n');
  }
  function invalidateReview() {
    reviewed = false;
    review.hidden = true;
    reviewButton.hidden = false;
  }
  function updatePeople() {
    const portrait = ['Face Sketch', 'Half Body Sketch', 'Full Image Sketch', 'Couple Sketch', 'Family Sketch', 'Colour Sketch', 'Custom Painting', 'Something else / not sure yet'].includes(artworkInput.value);
    peopleField.hidden = !portrait;
    peopleInput.disabled = !portrait;
  }
  reviewButton.textContent = 'Review order enquiry';
  updatePeople();
  function validateCustomer() {
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Please enter your name.');
    const phone = phoneInput.value.trim();
    const digits = phone.replace(/\D/g, '');
    phoneInput.setCustomValidity(/^[+()\d\s-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a phone number with 7–15 digits, using an optional +, spaces, brackets or hyphens.');
  }
  form.addEventListener('input', () => { validateCustomer(); invalidateReview(); });
  validateCustomer();
  artworkInput.addEventListener('change', () => { updatePeople(); invalidateReview(); });
  document.getElementById('waEditButton').addEventListener('click', () => {
    invalidateReview();
    artworkInput.focus();
  });
  form.addEventListener('submit', event => {
    validateCustomer();
    if (!form.reportValidity()) { event.preventDefault(); return; }
    form.elements.namedItem('text').value = message();
    if (reviewed) return; // Only opens a draft; the visitor sends in WhatsApp.
    event.preventDefault();
    document.getElementById('waReviewText').textContent = message();
    review.hidden = false;
    reviewButton.hidden = true;
    reviewed = true;
    document.getElementById('waReviewHeading').focus();
  });
})();
