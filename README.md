# Satyam Art Shop

Original artwork and custom sketch enquiries. Live website: https://satyam2026.vercel.app/

## Run locally

No build step, package installation, database or API key is required. From this folder run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/. Serve the whole folder, not just `index.html`, so the artwork files and existing artist profile load correctly.

## Website behaviour

- Search and filter original artwork and sketch services; sort known prices.
- Open artwork details to inspect the full-resolution originals.
- Save favourites and an enquiry bag on the visitor's device. Storage is optional; browsing still works if the browser blocks it.
- Prepare an enquiry for the existing artist WhatsApp destination. The visitor must review and send the message in WhatsApp.
- Custom-art form validates required details and prepares a WhatsApp message. It does not submit to a server or save contact details.
- No checkout, payment processing, order tracking or backend is configured. Prices, availability, shipping and payment must be confirmed directly with the artist. Prices marked `+` are starting prices; originals without a confirmed price remain enquiry-only.

## Deployment

This is a static website. The existing Vercel project's production branch is `main`; GitHub pushes can trigger that project's existing deployment integration. A successful GitHub push alone does not prove deployment: check the Vercel status on the commit and inspect the live URL after publishing.

For a separate static host, publish this repository's root directory with no build command. Keep filenames and capitalization intact (`About.html` and the local image assets). Do not add payment credentials or API secrets to HTML.

Google Fonts improves the typography when available, with local serif/sans-serif fallbacks when offline. WhatsApp must be reachable on the visitor's device to send an enquiry.

## Editing authentic content

The active homepage's style and behaviour are in `index.html`, including its `products` catalogue and `WHATSAPP_NUMBER`. Preserve genuine prices and contact destinations when editing. Product examples reuse real gallery artwork and are explicitly labelled as examples; they are not photographs of unverified commissions. Responsive WebP images are used for previews; original JPG/PNG files are retained for the detail viewer.

Existing secondary pages, styles and scripts are retained. Artwork, photographs and personal assets should not be copied or redistributed without the owner's permission.
