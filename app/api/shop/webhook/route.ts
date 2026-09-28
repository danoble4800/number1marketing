import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { appendOrder, appendWebsiteLead, nowNewYork, safeCell } from '@/lib/shop/sheets';
import { verifyStripeSignature } from '@/lib/shop/stripe';

// Stripe webhook: add this endpoint in Stripe → Developers → Webhooks with the events
// checkout.session.completed and checkout.session.expired.

type Address = { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string };
type Shipping = { name?: string; address?: Address };
type Session = {
  id: string;
  payment_status: string;
  amount_total: number | null;
  customer_email: string | null;
  customer_details?: { email?: string | null };
  shipping_details?: Shipping | null;
  collected_information?: { shipping_details?: Shipping | null } | null;
  metadata: Record<string, string>;
};

function escapeHtml(val: string): string {
  return val.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function splitName(full: string) {
  const [first, ...rest] = full.trim().split(/\s+/);
  return [first ?? '', rest.join(' ')];
}

function shipTo(s: Session) {
  const ship = s.collected_information?.shipping_details ?? s.shipping_details;
  const a = ship?.address;
  if (!a) return '';
  return [ship?.name, a.line1, a.line2, `${a.city ?? ''}, ${a.state ?? ''} ${a.postal_code ?? ''}`.trim()]
    .filter(Boolean)
    .join(', ');
}

async function sendOrderEmails(s: Session, orderId: string, total: string, address: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const m = s.metadata;
  const e = escapeHtml;
  const email = s.customer_details?.email ?? s.customer_email ?? '';
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit`;
  const from = process.env.LEAD_ALERT_FROM;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111">${value}</td></tr>`;

  if (process.env.LEAD_ALERT_EMAIL) {
    try {
      await resend.emails.send({
        from: from || 'Number 1 Leads <onboarding@resend.dev>',
        to: process.env.LEAD_ALERT_EMAIL,
        replyTo: email || undefined,
        subject: `🛒 New NFC order ${orderId}: ${m.business} — ${total}`,
        html: `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px">
  <h2 style="margin:0 0 4px">New order ${e(orderId)}: ${e(m.business ?? '')}</h2>
  <p style="margin:0 0 16px;color:#6b6b6b">${e(total)} paid · confirm the links, then program and ship</p>
  <table style="border-collapse:collapse;font-size:15px">
    ${row('Items', e(m.items ?? ''))}
    ${row('Contact', e(m.contact_name ?? ''))}
    ${row('Phone', `<a href="tel:${e((m.phone ?? '').replace(/[^\d+]/g, ''))}">${e(m.phone ?? '')}</a>`)}
    ${row('Email', `<a href="mailto:${e(email)}">${e(email)}</a>`)}
    ${row('Designs', e(m.designs || '—'))}
    ${row('Links', e(m.links || '—'))}
    ${row('Notes', e(m.notes || '—'))}
    ${row('Ship to', e(address || '—'))}
  </table>
  <p style="margin:20px 0 0"><a href="${sheetUrl}" style="background:#0e0e10;color:#fff;padding:10px 16px;text-decoration:none;font-weight:600">Open Orders Sheet</a></p>
</div>`,
      });
    } catch (err) {
      console.error('Order alert email error:', err);
    }
  }

  // Customer confirmation needs a verified sending domain (LEAD_ALERT_FROM).
  if (from && email) {
    const es = m.locale === 'es';
    const pt = m.locale === 'pt';
    const hi = es ? '¡Gracias por tu pedido!' : pt ? 'Obrigado pelo seu pedido!' : 'Thanks for your order!';
    const next = es
      ? 'En 1 día hábil te escribiremos para confirmar tus enlaces (y los datos del Wi-Fi, si aplica). Luego programamos, probamos y enviamos tu pedido (5–10 días hábiles).'
      : pt
      ? 'Em 1 dia útil mandaremos uma mensagem para confirmar seus links (e os dados do Wi-Fi, se for o caso). Depois programamos, testamos e enviamos seu pedido (5–10 dias úteis).'
      : "Within 1 business day we'll text you to confirm your links (and Wi-Fi details, if you ordered Wi-Fi). Then we program, test and ship your order (5–10 business days).";
    try {
      await resend.emails.send({
        from,
        to: email,
        replyTo: process.env.LEAD_ALERT_EMAIL || undefined,
        subject: `${hi} (${orderId})`,
        html: `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px;color:#111">
  <h2 style="margin:0 0 12px">${hi}</h2>
  <p style="margin:0 0 16px;line-height:1.5">${next}</p>
  <table style="border-collapse:collapse;font-size:15px">
    ${row(es ? 'Pedido' : pt ? 'Pedido' : 'Order', e(orderId))}
    ${row(es ? 'Productos' : pt ? 'Produtos' : 'Items', e(m.items ?? ''))}
    ${row('Total', e(total))}
  </table>
  <p style="margin:20px 0 0;color:#6b6b6b;font-size:13px">Number 1 Digital Marketing · number1digitalmarketing.com</p>
</div>`,
      });
    } catch (err) {
      console.error('Order confirmation email error:', err);
    }
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await req.text();
  if (!secret || !verifyStripeSignature(payload, req.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'bad signature' }, { status: 400 });
  }

  const event = JSON.parse(payload) as { type: string; data: { object: Session } };
  const s = event.data.object;
  const m = s.metadata ?? {};
  // Only sessions created by /api/shop/checkout carry these fields.
  if (!m.business) return NextResponse.json({ received: true });

  const email = s.customer_details?.email ?? s.customer_email ?? '';
  const [first, last] = splitName(m.contact_name ?? '');
  const orderId = `N1-${s.id.slice(-6).toUpperCase()}`;
  const total = `$${((s.amount_total ?? 0) / 100).toFixed(2)}`;

  try {
    if (event.type === 'checkout.session.completed' && s.payment_status === 'paid') {
      const address = shipTo(s);
      await appendOrder([
        nowNewYork(),
        'Paid — confirm links',
        orderId,
        safeCell(m.business),
        safeCell(m.contact_name ?? ''),
        safeCell(m.phone ?? ''),
        safeCell(email),
        safeCell(m.items ?? ''),
        total,
        safeCell(m.designs ?? ''),
        safeCell(m.links ?? ''),
        safeCell(m.notes ?? ''),
        safeCell(address),
        s.id,
      ]);
      await appendWebsiteLead([
        nowNewYork(), 'New', safeCell(first), safeCell(last), safeCell(m.business), '', '',
        safeCell(m.phone ?? ''), safeCell(email), `NFC order ${orderId}: ${m.items ?? ''}`, 'NFC Shop',
        m.sms_consent ?? 'No',
      ]);
      await sendOrderEmails(s, orderId, total, address);
    } else if (event.type === 'checkout.session.expired') {
      // Started checkout but never paid: still a warm lead.
      await appendWebsiteLead([
        nowNewYork(), 'New', safeCell(first), safeCell(last), safeCell(m.business), '', '',
        safeCell(m.phone ?? ''), safeCell(email), `Abandoned NFC cart: ${m.items ?? ''}`,
        'NFC Shop (abandoned cart)', m.sms_consent ?? 'No',
      ]);
    }
  } catch (err) {
    // 500 makes Stripe retry later.
    console.error('Shop webhook error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
