// Web app manifest for /team, so reps can add it to their phone's Home Screen as "N°1 Team".
// Served from /api because the locale middleware skips /api paths.
const MANIFEST = {
  name: 'N°1 Team',
  short_name: 'N°1 Team',
  description: 'Your Number 1 Digital Marketing leads and follow-ups',
  start_url: '/en/team',
  scope: '/en/team',
  display: 'standalone',
  background_color: '#0E0E10',
  theme_color: '#000000',
  icons: [
    { src: '/admin-icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/admin-icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/admin-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};

export function GET() {
  return new Response(JSON.stringify(MANIFEST), {
    headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=3600' },
  });
}
