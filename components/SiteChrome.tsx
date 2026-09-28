'use client';

import { usePathname } from 'next/navigation';

// Hides the public site's nav bar and footer on /admin, which has its own header.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (/^\/[a-z]{2}\/admin(\/|$)/.test(pathname)) return null;
  return <>{children}</>;
}
