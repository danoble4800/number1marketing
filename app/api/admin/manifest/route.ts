// Web app manifest for /admin, so it can be added to a phone's Home Screen as "N°1 Admin".
// Served from /api because the locale middleware skips /api paths.
const MANIFEST = {
  "name": "N°1 Admin",
  "short_name": "N°1 Admin",
  "description": "Number 1 Digital Marketing leads and follow-ups",
  "start_url": "/en/admin",
  "scope": "/en/admin",
  "display": "standalone",
  "background_color": "#0E0E10",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/admin-icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/admin-icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/admin-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
};

export function GET() {
  return new Response(JSON.stringify(MANIFEST), {
    headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=3600' },
  });
}
