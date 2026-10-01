'use client';

import { usePathname } from 'next/navigation';

// Hides the public site's nav bar and footer on /admin and /team, which have their own
// headers, and on the sales team's NFC lead form.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (/^\/[a-z]{2}\/(admin|team|nfc-lead)(\/|$)/.test(pathname)) return null;
  return <>{children}</>;
}
