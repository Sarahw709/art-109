Neon Diary — Retro Y2K single page blog

Files:
- index.html — single page HTML
- css/style.css — retro styling

To preview locally:

```bash
python3 -m http.server --directory Tutorials/11-copilot-demo 8000
```

Then open http://localhost:8000 in your browser.

To use the custom phone cursor:

- Save your phone image as `phone-cursor.png` (transparent background recommended).
- Put it in `Tutorials/11-copilot-demo/images/`.
- Reload the page; the site uses `images/phone-cursor.png` as the cursor.

Note: For best results use a PNG around 64–128px and adjust the hotspot in `css/style.css` (the `16 16` coordinates).
