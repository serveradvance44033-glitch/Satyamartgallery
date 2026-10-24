/* Replace failed gallery images with a local, accessible photo icon. */
(() => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="#171615"/><rect x="176" y="82" width="288" height="236" rx="22" fill="#211f1b" stroke="#b99a5b" stroke-width="10"/><circle cx="390" cy="148" r="27" fill="none" stroke="#e0c27c" stroke-width="12"/><path d="m198 286 78-82 53 55 38-38 75 77H198Z" fill="none" stroke="#e0c27c" stroke-linecap="round" stroke-linejoin="round" stroke-width="14"/><path d="M230 340h180" stroke="#806a42" stroke-linecap="round" stroke-width="8"/></svg>';
    const icon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    function showFallback(image) {
        if (!(image instanceof HTMLImageElement)) return;

        if (image.dataset.galleryImageFallback === 'shown') {
            // If even the local data image fails, render the same icon as inline SVG without retrying.
            image.dataset.galleryImageFallback = 'unavailable';
            image.removeAttribute('srcset');
            image.removeAttribute('src');
            image.classList.add('gallery-image-fallback-unavailable');

            const rect = image.getBoundingClientRect();
            const style = getComputedStyle(image);
            const wrapper = document.createElement('span');
            wrapper.className = 'gallery-image-fallback-wrapper';
            wrapper.style.display = style.display === 'inline' ? 'inline-block' : style.display;
            wrapper.style.position = style.position === 'absolute' || style.position === 'fixed' ? style.position : 'relative';
            wrapper.style.width = `${Math.max(1, rect.width)}px`;
            wrapper.style.height = `${Math.max(1, rect.height)}px`;
            wrapper.style.verticalAlign = style.verticalAlign;
            wrapper.style.margin = style.margin;
            if (style.position === 'absolute' || style.position === 'fixed') {
                for (const edge of ['top', 'right', 'bottom', 'left']) wrapper.style[edge] = style[edge];
                wrapper.style.transform = style.transform;
                wrapper.style.zIndex = style.zIndex;
            }
            if (image.alt) {
                wrapper.setAttribute('role', 'img');
                wrapper.setAttribute('aria-label', image.alt);
            } else {
                wrapper.setAttribute('aria-hidden', 'true');
            }

            const parsedIcon = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement;
            const inlineIcon = document.importNode(parsedIcon, true);
            inlineIcon.classList.add('gallery-image-fallback-vector');
            inlineIcon.setAttribute('aria-hidden', 'true');
            image.parentNode.insertBefore(wrapper, image);
            wrapper.appendChild(image);
            wrapper.appendChild(inlineIcon);
            image.style.position = 'absolute';
            image.style.inset = '0';
            image.style.width = '100%';
            image.style.height = '100%';
            image.style.opacity = '0';
            image.style.margin = '0';
            image.setAttribute('aria-hidden', 'true');
            image.alt = '';

            const aboutPlaceholder = image.closest('.photo-inner')?.querySelector('.photo-placeholder');
            if (aboutPlaceholder) aboutPlaceholder.hidden = true;
            return;
        }
        if (image.dataset.galleryImageFallback) return;

        image.dataset.galleryOriginalSrc = image.getAttribute('src') || image.currentSrc || '';
        image.dataset.galleryOriginalSrcset = image.getAttribute('srcset') || '';
        image.dataset.galleryImageFallback = 'shown';
        image.classList.add('gallery-image-fallback');
        image.removeAttribute('srcset');
        image.setAttribute('src', icon);

        // The About page has a decorative text placeholder for this portrait; the icon replaces it.
        const aboutPlaceholder = image.closest('.photo-inner')?.querySelector('.photo-placeholder');
        if (aboutPlaceholder) aboutPlaceholder.hidden = true;
    }

    // Capture catches normal, lazy and script-created lightbox images before target handlers run.
    document.addEventListener('error', event => showFallback(event.target), true);

    // Covers an eager image that failed before the deferred handler was installed.
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img').forEach(image => {
            if (image.complete && image.naturalWidth === 0 && image.getAttribute('src')) showFallback(image);
        });
    }, { once: true });
})();
