import { Resend } from 'resend';
import { ASSISTANT_PLANS, COMMISSION_RATE, isAssistantPlan, orderIdFor } from '@/lib/macAssistant';
import { appendAssistantSale, nowNewYork, safeCell } from '@/lib/shop/sheets';
import { appendToSheet } from '@/lib/websiteLeads';

// Called by the Stripe webhook (/api/shop/webhook) for Mac Assistant sessions.
// Paid: a row in "Mac Assistant Sales" (with the rep's commission), the buyer in Website
// Leads as a Client (credited to the rep, so it shows on their dashboard), an alert to the
// owner and the download email to the buyer. Expired: the buyer as a New lead.

export type AssistantSession = {
  id: string;
  payment_status: string;
  amount_total: number | null;
  customer_email: string | null;
  customer_details?: { email?: string | null; name?: string | null };
  metadata: Record<string, string>;
};

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com').replace(/\/$/, '');
const FROM = process.env.LEAD_REPLY_FROM || 'N°1 Digital Marketing <hello@number1digitalmarketing.com>';

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

function escapeHtml(val: string): string {
  return val.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function splitName(full: string) {
  const [first, ...rest] = full.trim().split(/\s+/);
  return [first ?? '', rest.join(' ')];
}

export const downloadUrl = (sessionId: string, file: 'zip' | 'guide') =>
  `${SITE}/api/mac-assistant/download?session_id=${sessionId}&file=${file}`;

export async function handleAssistantSession(type: string, s: AssistantSession) {
  const m = s.metadata;
  const plan = isAssistantPlan(m.plan) ? m.plan : 'diy';
  const email = s.customer_details?.email ?? s.customer_email ?? '';
  const name = m.contact_name || s.customer_details?.name || '';
  const [first, last] = splitName(name);
  const rep = m.referred_by ?? '';
  const planLabel = plan === 'setup' ? 'Template + setup' : 'Template only';

  if (type === 'checkout.session.completed' && s.payment_status === 'paid') {
    const orderId = orderIdFor(s.id);
    const paid = s.amount_total ?? ASSISTANT_PLANS[plan].price;
    // Commission on the product price, not on any sales tax Stripe added.
    const commission = rep ? Math.round(Math.min(paid, ASSISTANT_PLANS[plan].price) * COMMISSION_RATE) : 0;

    await appendAssistantSale([
      nowNewYork(),
      orderId,
      planLabel,
      safeCell(name),
      safeCell(m.phone ?? ''),
      safeCell(email),
      usd(paid),
      safeCell(rep),
      rep ? usd(commission) : '',
      '',
      plan === 'setup' ? 'No' : '',
      s.id,
    ]);
    await appendToSheet(
      [
        nowNewYork(), 'Client', safeCell(first), safeCell(last), '', '', '',
        safeCell(m.phone ?? ''), safeCell(email),
        `Mac Assistant ${orderId}: ${planLabel} (${usd(paid)} paid)${plan === 'setup' ? ' · schedule the setup call' : ''}`,
        'Mac Assistant', 'No',
      ],
      rep
    );
    await sendEmails({ s, orderId, plan, name, email, rep, paid, commission });
  } else if (type === 'checkout.session.expired') {
    // Started checkout but never paid: still a warm lead.
    await appendToSheet(
      [
        nowNewYork(), 'New', safeCell(first), safeCell(last), '', '', '',
        safeCell(m.phone ?? ''), safeCell(email),
        `Started Mac Assistant checkout (${planLabel}), didn't pay`, 'Mac Assistant (abandoned checkout)', 'No',
      ],
      rep
    );
  }
}

async function sendEmails(o: {
  s: AssistantSession;
  orderId: string;
  plan: 'diy' | 'setup';
  name: string;
  email: string;
  rep: string;
  paid: number;
  commission: number;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const e = escapeHtml;
  const m = o.s.metadata;

  if (process.env.LEAD_ALERT_EMAIL) {
    const row = (label: string, value: string) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111">${value}</td></tr>`;
    try {
      await resend.emails.send({
        from: process.env.LEAD_ALERT_FROM || 'Number 1 Leads <onboarding@resend.dev>',
        to: process.env.LEAD_ALERT_EMAIL,
        replyTo: o.email || undefined,
        subject: `💻 Mac Assistant sold ${o.orderId}: ${o.name} — ${usd(o.paid)}${o.plan === 'setup' ? ' (setup)' : ''}`,
        html: `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px">
  <h2 style="margin:0 0 4px">Mac Assistant sold: ${e(o.name)}</h2>
  <p style="margin:0 0 16px;color:#6b6b6b">${usd(o.paid)} paid${o.plan === 'setup' ? ' · text them to book the setup screen share' : ' · download sent automatically'}</p>
  <table style="border-collapse:collapse;font-size:15px">
    ${row('Plan', o.plan === 'setup' ? 'Template + done-for-you setup' : 'Template only')}
    ${row('Phone', `<a href="tel:${e((m.phone ?? '').replace(/[^\d+]/g, ''))}">${e(m.phone || '—')}</a>`)}
    ${row('Email', `<a href="mailto:${e(o.email)}">${e(o.email)}</a>`)}
    ${row('Referred by', o.rep ? `${e(o.rep)} · ${usd(o.commission)} commission` : '—')}
  </table>
</div>`,
      });
    } catch (err) {
      console.error('Mac Assistant alert email error:', err);
    }
  }

  if (!o.email) return;
  const es = m.locale === 'es';
  const pt = m.locale === 'pt';
  const first = o.name.trim().split(/\s+/)[0] ?? '';
  const words = es
    ? {
        subject: `Tu N°1 Mac Assistant está listo (${o.orderId})`,
        hi: first ? `Hola ${first}:` : 'Hola:',
        thanks: 'Gracias por tu compra. Aquí tienes tus archivos:',
        zip: 'Descargar la plantilla (.zip)',
        guide: 'Descargar la guía paso a paso (PDF)',
        setup: 'Como elegiste la instalación, te escribiremos en 1 día hábil para agendar una videollamada. Nosotros lo instalamos contigo.',
        diy: 'Empieza por la guía: en unos 30 minutos tendrás tu asistente funcionando.',
        help: 'Los enlaces siempre funcionan. ¿Dudas? Responde a este correo.',
      }
    : pt
    ? {
        subject: `Seu N°1 Mac Assistant está pronto (${o.orderId})`,
        hi: first ? `Olá ${first},` : 'Olá,',
        thanks: 'Obrigado pela compra. Aqui estão seus arquivos:',
        zip: 'Baixar o modelo (.zip)',
        guide: 'Baixar o guia passo a passo (PDF)',
        setup: 'Como você escolheu a instalação, vamos mandar uma mensagem em 1 dia útil para agendar uma chamada de vídeo. Nós instalamos com você.',
        diy: 'Comece pelo guia: em uns 30 minutos seu assistente estará funcionando.',
        help: 'Os links continuam funcionando. Dúvidas? Responda este e-mail.',
      }
    : {
        subject: `Your N°1 Mac Assistant is ready (${o.orderId})`,
        hi: first ? `Hi ${first},` : 'Hi there,',
        thanks: 'Thanks for your order. Here are your files:',
        zip: 'Download the template (.zip)',
        guide: 'Download the step-by-step guide (PDF)',
        setup: "Since you chose setup, we'll text you within 1 business day to book a screen share. We'll set it up with you.",
        diy: "Start with the guide: in about 30 minutes you'll be texting your Mac.",
        help: 'These links keep working. Questions? Just reply to this email.',
      };
  const zipUrl = downloadUrl(o.s.id, 'zip');
  const guideUrl = downloadUrl(o.s.id, 'guide');
  const next = o.plan === 'setup' ? words.setup : words.diy;

  try {
    await resend.emails.send({
      from: FROM,
      to: o.email,
      replyTo: process.env.LEAD_REPLY_TO || process.env.LEAD_ALERT_EMAIL || undefined,
      subject: words.subject,
      html: `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px;color:#111;line-height:1.5">
  <p>${e(words.hi)}</p>
  <p>${e(words.thanks)}</p>
  <p><a href="${zipUrl}">${e(words.zip)}</a><br><a href="${guideUrl}">${e(words.guide)}</a></p>
  <p>${e(next)}</p>
  <p>${e(words.help)}</p>
  <p style="color:#6b6b6b;font-size:13px">N°1 Digital Marketing · ${e(o.orderId)}</p>
</div>`,
      text: [words.hi, '', words.thanks, `${words.zip}: ${zipUrl}`, `${words.guide}: ${guideUrl}`, '', next, '', words.help, '', `N°1 Digital Marketing · ${o.orderId}`].join('\n'),
    });
  } catch (err) {
    console.error('Mac Assistant buyer email error:', err);
  }
}
