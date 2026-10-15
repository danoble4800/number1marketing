'use client';

import { usePathname } from 'next/navigation';

// Hides the public site's nav bar and footer on /admin and /team, which have their own
// headers, on the sales team's NFC lead form, and on the Instagram free audit landing page.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (/^\/[a-z]{2}\/(admin|team|nfc-lead|free-audit)(\/|$)/.test(pathname)) return null;
  return <>{children}</>;
}
