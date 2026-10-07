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

export default function middleware(req: NextRequest) {
  if (CARD_ROUTES.test(req.nextUrl.pathname)) return NextResponse.next();
  return intl(req);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|txt|xml)).*)',
  ],
};
