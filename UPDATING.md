# Updating the Cake Artistry website

Live site: https://www.cakeartistrybyvictoria.com
Repository: https://github.com/PedrosLabs/cake-artistry

The domain is registered with Squarespace but the site is hosted on GitHub
Pages. Victoria's email runs on Google Workspace — the MX records in the
Squarespace DNS panel must never be changed, or her email stops working.

## Adding or changing gallery photos (the easy way)

1. Put the photo in `Photos for Website` on the Desktop.
   **Name the file exactly what the caption should say**, e.g.
   `Halloween Spooky Special.jpg` becomes the caption "Halloween Spooky Special".
2. Ask Claude: *"add the new photos to the cake gallery"* (or *"remove the football cake"*).
3. Claude resizes the photo, updates the gallery, checks it, and publishes.

Changes appear on the live site about a minute after publishing.

## Doing it by hand

Photos live in `images/`, sized to 1200px on the longest side, saved as JPEG
at quality 82 (keeps the page fast). Each gallery tile in `index.html` is:

```html
<figure class="gallery-item" tabindex="0">
  <img src="images/file-name.jpg" alt="Description of cake" loading="lazy">
  <figcaption>Caption Shown On Site</figcaption>
</figure>
```

Then publish:

```bash
git add -A && git commit -m "Add new cake photos" && git push
```

## Other things you might change

- **Enquiry form** — `GOOGLE_FORM_URL` at the top of `script.js`. Must end in
  `?embedded=true`. Clear it and the site falls back to an "email Victoria" card.
- **Email address** — search `index.html` for `victoria@`.
- **Facebook link** — search `index.html` for `facebook.com`.
- **Colours** — the `:root` block at the top of `styles.css` defines every
  colour in one place (gold, olive green, cream, blush, peach).

## Previewing before publishing

```bash
python3 -m http.server 8642 --directory "CakeArtistry"
```

Then open http://localhost:8642 — this is local only, nobody else sees it.
