import { anonClient, getPublicPage, isDemoId, siteUrl } from '@/lib/cards/server';

export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

// "Save contact" — a vCard the phone opens straight into Contacts.
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const page = await getPublicPage(params.slug);
  if (!page) return new Response('Not found', { status: 404 });

  const c = page.contact ?? {};
  const pageUrl = `${siteUrl()}/c/${page.slug}`;
  const [first, ...rest] = page.display_name.trim().split(/\s+/);
  const isBusiness = !!c.company && c.company === page.display_name;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(page.display_name)}`,
    isBusiness ? `N:;;;;` : `N:${esc(rest.join(' '))};${esc(first ?? '')};;;`,
    c.company && `ORG:${esc(c.company)}`,
    c.title && `TITLE:${esc(c.title)}`,
    c.phone && `TEL;TYPE=CELL:${c.phone.replace(/[^\d+]/g, '')}`,
    c.email && `EMAIL;TYPE=INTERNET:${c.email}`,
    c.website && `URL:${/^https?:/.test(c.website) ? c.website : `https://${c.website}`}`,
    `URL:${pageUrl}`,
    c.address && `ADR;TYPE=WORK:;;${esc(c.address)};;;;`,
    page.avatar_url && `PHOTO;VALUE=URI:${page.avatar_url}`,
    page.headline && `NOTE:${esc(page.headline)}`,
    'END:VCARD',
  ].filter(Boolean);

  if (!isDemoId(page.id)) {
    await anonClient()?.rpc('record_card_event', { p_page: page.id, p_kind: 'save_contact' });
  }

  const filename = page.slug.replace(/[^a-z0-9-]/g, '') || 'contact';
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.vcf"`,
      'Cache-Control': 'no-store',
    },
  });
}
