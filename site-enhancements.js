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
  const websiteOnly = form.dataset.websiteOnly === 'true';
  const artworkInput = document.getElementById('waArtwork');
  const peopleInput = document.getElementById('waPeople');
  const peopleField = document.getElementById('waPeopleField');
  const review = document.getElementById('waReview');
  const reviewButton = document.getElementById('waReviewButton');
  const nameInput = document.getElementById('waName');
  const phoneInput = document.getElementById('waPhone');
  const photoInput = document.getElementById('waPhoto');
  const photoStatus = document.getElementById('waPhotoStatus');
  const photoPreview = document.getElementById('waPhotoPreview');
  const photoImage = document.getElementById('waPhotoImage');
  let photoUrl = '';
  let photoReady = false;
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
    if (websiteOnly) {
      lines.push(photoReady ? 'Reference photo: local preview only — not uploaded or sent.' : 'No reference photo selected.');
      lines.push('Draft only. Website ordering is not available yet. Nothing has been sent or confirmed.');
      return lines.join('\n');
    }
    lines.push(photoReady ? 'A reference photo was previewed on my device only. The website has not uploaded or sent it.' : 'I can share a reference photo in this chat if needed.');
    lines.push('Please confirm the final quote, size, medium, frame options, payment terms, completion time and delivery details before I confirm the order.');
    return lines.join('\n');
  }
  function invalidateReview() {
    reviewed = false;
    review.hidden = true;
    reviewButton.hidden = false;
    document.getElementById('waReviewPhoto').hidden = true;
    document.getElementById('waReviewPhotoImage').removeAttribute('src');
  }
  function updatePeople() {
    const portrait = ['Face Sketch', 'Half Body Sketch', 'Full Image Sketch', 'Couple Sketch', 'Family Sketch', 'Colour Sketch', 'Custom Painting', 'Something else / not sure yet'].includes(artworkInput.value);
    peopleField.hidden = !portrait;
    peopleInput.disabled = !portrait;
  }
  function clearPhoto(clearInput = true) {
    photoReady = false;
    photoPreview.hidden = true;
    photoImage.removeAttribute('src');
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = '';
    if (clearInput) photoInput.value = '';
    invalidateReview();
  }
  let photoGeneration = 0;
  photoInput.addEventListener('change', async () => {
    const generation = ++photoGeneration;
    const file = photoInput.files[0];
    clearPhoto(false);
    if (!file) { photoStatus.textContent = ''; return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      photoInput.value = '';
      photoStatus.textContent = 'Choose a JPG, PNG or WebP image no larger than 10 MB. Nothing was uploaded.';
      return;
    }
    photoStatus.textContent = 'Preparing a local preview. Nothing is being uploaded.';
    try {
      let preview = file;
      if ('createImageBitmap' in window) {
        const bitmap = await createImageBitmap(file);
        if (generation !== photoGeneration) { bitmap.close(); return; }
        const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        preview = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .85));
        canvas.width = canvas.height = 0;
        if (!preview) throw new Error('Preview unavailable');
      }
      if (generation !== photoGeneration) return;
      photoUrl = URL.createObjectURL(preview);
      const currentUrl = photoUrl;
      photoImage.onload = () => {
        if (currentUrl !== photoUrl) return;
        photoReady = true;
        photoPreview.hidden = false;
        photoStatus.textContent = 'Preview only — your photo stays on this device. It has not been uploaded or sent to Satyam.';
        invalidateReview();
      };
      photoImage.onerror = () => {
        if (currentUrl !== photoUrl) return;
        clearPhoto();
        photoStatus.textContent = 'This image could not be previewed. Please choose another JPG, PNG or WebP photo. Nothing was uploaded.';
      };
      photoImage.src = photoUrl;
    } catch (_) {
      if (generation !== photoGeneration) return;
      clearPhoto();
      photoStatus.textContent = 'This image could not be previewed. Please choose another JPG, PNG or WebP photo. Nothing was uploaded.';
    }
  });
  document.getElementById('waRemovePhoto').addEventListener('click', () => {
    photoGeneration++;
    clearPhoto();
    photoStatus.textContent = 'Preview removed. Nothing was uploaded or sent.';
    photoInput.focus();
  });
  window.addEventListener('pagehide', () => { photoGeneration++; clearPhoto(); });
  reviewButton.textContent = websiteOnly ? 'Review details' : 'Review order enquiry';
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
  function reviewRequest(event) {
    if (websiteOnly) event.preventDefault();
    validateCustomer();
    if (!form.reportValidity()) { event.preventDefault(); return; }
    if (!websiteOnly) form.elements.namedItem('text').value = message();
    if (reviewed && !websiteOnly) return; // Only opens a draft; the visitor sends in WhatsApp.
    event.preventDefault();
    document.getElementById('waReviewText').textContent = message();
    document.getElementById('waReviewPhoto').hidden = !photoReady;
    if (photoReady) document.getElementById('waReviewPhotoImage').src = photoUrl;
    review.hidden = false;
    reviewButton.hidden = true;
    reviewed = true;
    document.getElementById('waReviewHeading').focus();
  }
  form.addEventListener('submit', reviewRequest);
  if (websiteOnly) reviewButton.addEventListener('click', reviewRequest);
})();
