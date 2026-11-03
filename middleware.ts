import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const intl = createMiddleware({
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'en',
  localeDetection: true,
  localeCookie: { name: 'NEXT_LOCALE' },
});

// Tap-card routes live outside [locale]: /t/<card id>, /c/<page>, /card/… (owner editor).
const CARD_ROUTES = /^\/(t|c)\/|^\/card(\/|$)/;

// Rep referral links (?ref=jennifer-souza): remember the latest one for 30 days so the
// lead forms can credit the rep. Same names as lib/referrals.ts, which isn't edge-safe.
const REF_COOKIE = 'n1_ref';
const REF_RE = /^[a-z0-9-]{1,60}$/;

export default function middleware(req: NextRequest) {
  if (CARD_ROUTES.test(req.nextUrl.pathname)) return NextResponse.next();
  const res = intl(req);
  const ref = req.nextUrl.searchParams.get('ref')?.trim().toLowerCase() ?? '';
  // /cards?ref=<card page> is a tap-card link, not a rep's.
  if (REF_RE.test(ref) && !/\/cards(\/|$)/.test(req.nextUrl.pathname)) {
    res.cookies.set(REF_COOKIE, ref, { maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'lax' });
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|txt|xml|webmanifest)).*)',
  ],
};
