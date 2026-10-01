// Next.js 14 keeps server-side fetch() results in its Data Cache, even on force-dynamic
// pages. Give this to Supabase clients on the server (global.fetch) so they always read
// fresh data: saved card edits, role changes, certificates.
export const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' });
