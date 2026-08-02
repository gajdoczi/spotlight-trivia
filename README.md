# Akarás Jeopardy

A self-hosted, no-subscription Jeopardy-style board builder and host tool.

## Run locally

```
npm install
npm run dev
```

## Build for production

```
npm install
npm run build
```

This outputs a static `dist/` folder that can be served by any static host (Render, Netlify, Vercel, GitHub Pages, etc).

## Notes

- Boards are saved in the browser's `localStorage` — per browser, per device. There is no server/database, so boards made on one device/browser won't show up on another.
- Uploaded clue images are stored as base64 inside `localStorage`, which most browsers cap around 5–10MB total. Prefer pasting an image link over uploading for large images.
