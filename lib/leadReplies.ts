import { Resend } from 'resend';
import { HISTORY_COL, TABS, getSheets, safeCell, spreadsheetId, todayInNewYork, type Lead, type Source } from '@/lib/crmSheets';

// Automatic emails to new leads, sent from the domain with replies going to the owner's inbox:
//   welcome  – seconds after a website form (free audit or contact) comes in
//   visit    – after a street-team visit is logged with the owner's email
//   nudge    – one reminder 3 days later if nobody has touched the lead (daily cron, /api/lead-replies)
// Each send adds a line to the lead's Contact History, which is also how the nudge knows
// what was sent and when. Wording is fixed on purpose; edit it here.
//
// Written to land in the main inbox: plain look, no images, one link at most, no tracking,
// a text version, a question that invites a reply, and an easy way to opt out.

const FROM = process.env.LEAD_REPLY_FROM || 'N°1 Digital Marketing <hello@number1digitalmarketing.com>';
const PHONE = '781-985-0916';
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://number1digitalmarketing.com').replace(/\/$/, '');
const FREE_AUDIT_URL = `${SITE}/en/free-audit`;

// Contact History markers. The nudge cron looks for these, so keep them stable.
export const SENT_WELCOME = 'Welcome email sent automatically';
export const SENT_VISIT = 'Follow-up email sent automatically after the visit';
export const SENT_NUDGE = 'Reminder email sent automatically';

type Email = { subject: string; paragraphs: string[]; link?: { label: string; url: string } };

const first = (name: string) => name.trim().split(/\s+/)[0] ?? '';
const hi = (name: string) => (first(name) ? `Hi ${first(name)},` : 'Hi there,');
const yours = (business: string) => business.trim() || 'your business';
export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());

function escapeHtml(val: string): string {
  return val.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

// ---- Wording ----

export type Tier = 'HOT' | 'WARM' | 'COLD';

export function freeAuditWelcome(o: { name: string; business: string; tier: Tier }): Email {
  const next = o.tier === 'HOT'
    ? `Since you want to get started soon, we'll call or text you today to set up your free 30-minute audit call. If you'd rather pick the time, just reply with a day and time that works.`
    : `Next step is a free 30-minute call where we go over what we found and what we'd fix first. We'll call or text you within 1 business day to set up a time, or you can reply with a day and time that works.`;
  return {
    subject: `Got your free audit request, ${first(o.name) || 'thanks'}`,
    paragraphs: [
      hi(o.name),
      `Thanks for asking for a free audit${o.business ? ` for ${o.business}` : ''}. We got everything you sent, and we're already taking a look at how ${yours(o.business)} shows up online: your Google listing, website and social pages.`,
      next,
      `One quick question so the call is worth your time: what's the one thing you'd most like to fix right now?`,
    ],
  };
}

export function contactWelcome(o: { name: string; business: string }): Email {
  return {
    subject: `We got your message, ${first(o.name) || 'thanks'}`,
    paragraphs: [
      hi(o.name),
      `Thanks for reaching out${o.business ? ` about ${o.business}` : ''}. A real person on our team reads every message, and we'll get back to you within 1 business day.`,
      `If it's easier to talk, call or text us at ${PHONE}.`,
      `What's the best time of day to reach you?`,
    ],
  };
}

export function visitFollowUp(o: { name: string; business: string; rep: string; talked: boolean }): Email {
  const rep = first(o.rep) || 'our team';
  return {
    subject: o.talked
      ? `Great meeting you today${first(o.name) ? `, ${first(o.name)}` : ''}`
      : `Sorry we missed you at ${yours(o.business)}`,
    paragraphs: [
      hi(o.name),
      o.talked
        ? `Thanks for taking a few minutes with ${rep} at ${yours(o.business)} today.`
        : `${rep} from N°1 Digital Marketing stopped by ${yours(o.business)} today, but we missed you.`,
      `We help local businesses get more calls and customers: a Google listing that brings people in, a website that works, and quick replies to every new customer, even after hours.`,
      `${o.talked ? 'As promised, here' : 'Here'}'s your free audit. It takes about 2 minutes, and we'll show you the easiest ways to bring in more business:`,
    ],
    link: { label: 'Get my free audit', url: FREE_AUDIT_URL },
  };
}

export function nudge(o: { name: string; business: string; inPerson: boolean; rep: string }): Email {
  return {
    subject: o.inPerson ? `Following up on our visit to ${yours(o.business)}` : `Still want to chat, ${first(o.name) || 'there'}?`,
    paragraphs: [
      hi(o.name),
      o.inPerson
        ? `Just following up on ${first(o.rep) || 'our'}${first(o.rep) ? "'s" : ''} visit to ${yours(o.business)}. Your free audit is still here when you have 2 minutes:`
        : `Just checking that you saw our last email. We'd still love to show you a few easy ways to get ${yours(o.business)} more calls and customers.`,
      o.inPerson
        ? `Or if it's easier, reply with a good time and we'll give you a call.`
        : `Reply with a day and time that works and we'll call you, or call or text us at ${PHONE}.`,
    ],
    link: o.inPerson ? { label: 'Get my free audit', url: FREE_AUDIT_URL } : undefined,
  };
}

// ---- Sending ----

function render(email: Email) {
  const address = process.env.LEAD_EMAIL_ADDRESS?.trim();
  const signoff = ['The N°1 Team', `N°1 Digital Marketing · ${PHONE}`];
  const footer = [
    `Not interested? Reply "stop" and we won't email you again.`,
    ...(address ? [address] : []),
  ];
  const e = escapeHtml;
  const p = (t: string) => `<p style="margin:0 0 14px">${e(t)}</p>`;
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#111;max-width:560px">
${email.paragraphs.map(p).join('\n')}
${email.link ? `<p style="margin:0 0 14px"><a href="${e(email.link.url)}" style="color:#111;font-weight:600">${e(email.link.label)}</a></p>` : ''}
<p style="margin:18px 0 0">${signoff.map(e).join('<br>')}</p>
<p style="margin:24px 0 0;font-size:12px;color:#777">${footer.map(e).join('<br>')}</p>
</div>`;
  const text = [
    ...email.paragraphs,
    ...(email.link ? [`${email.link.label}: ${email.link.url}`] : []),
    signoff.join('\n'),
    footer.join('\n'),
  ].join('\n\n');
  return { html, text };
}

// Sends one email to a lead. Returns true only if Resend accepted it. Never throws, so a
// failed email can't fail the form that triggered it. `key` stops repeat sends of the same email.
export async function sendLeadEmail(to: string, email: Email, kind: string, key?: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const replyTo = process.env.LEAD_REPLY_TO || process.env.LEAD_ALERT_EMAIL;
  if (!apiKey || !replyTo) {
    console.warn(`Lead reply skipped: ${!apiKey ? 'RESEND_API_KEY' : 'LEAD_REPLY_TO'} is not set`);
    return false;
  }
  if (!validEmail(to)) {
    console.warn('Lead reply skipped: not a valid email address');
    return false;
  }
  try {
    const { html, text } = render(email);
    const { data, error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to: to.trim(),
      replyTo,
      subject: email.subject,
      html,
      text,
      headers: { 'List-Unsubscribe': `<mailto:${replyTo}?subject=Unsubscribe>` },
      tags: [{ name: 'type', value: kind }],
    }, key ? { idempotencyKey: key } : undefined);
    if (error) {
      console.error(`Lead reply (${kind}) error:`, error);
      return false;
    }
    console.log(`Lead reply (${kind}) sent:`, data?.id);
    return true;
  } catch (err) {
    console.error(`Lead reply (${kind}) error:`, err);
    return false;
  }
}

// Adds "YYYY-MM-DD · <line>" to a lead's Contact History cell. Logged, never thrown.
export async function logHistory(source: Source, row: number, line: string) {
  try {
    const sheets = getSheets();
    const range = `'${TABS[source]}'!${HISTORY_COL[source]}${row}`;
    const id = spreadsheetId(source);
    const current = await sheets.spreadsheets.values.get({ spreadsheetId: id, range });
    const existing = String(current.data.values?.[0]?.[0] ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
    await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[safeCell([...existing, `${todayInNewYork()} · ${line}`].join('\n'))]] },
    });
  } catch (err) {
    console.error(`Couldn't log "${line}" to ${source} row ${row}:`, err);
  }
}

// ---- Reminder ----

const NUDGE_AFTER_DAYS = 3;

function daysBefore(today: string, days: number) {
  const t = new Date(`${today}T12:00:00Z`);
  t.setUTCDate(t.getUTCDate() - days);
  return t.toISOString().slice(0, 10);
}

// A lead gets one reminder when the automatic email is still the last thing in its history,
// it went out 3+ days ago, and the lead is still "New". Any status change or logged contact
// (call, text, a note in the CRM) means someone is on it, so no reminder.
export function needsNudge(l: Lead, today: string) {
  if (l.source !== 'website' && l.source !== 'inperson') return false;
  if (l.status !== 'New' || !validEmail(l.email)) return false;
  const last = l.history[l.history.length - 1] ?? '';
  const [date, what] = last.split(' · ');
  if (what !== SENT_WELCOME && what !== SENT_VISIT) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= daysBefore(today, NUDGE_AFTER_DAYS);
}
