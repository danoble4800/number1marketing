'use client';

import { useState } from 'react';
import { Download, Phone, MessageSquare, Mail, Share2, Star, Tag, UserPlus, Check, X } from 'lucide-react';
import type { PublicPage } from '@/lib/cards/types';
import { resolveTheme } from '@/lib/cards/themes';
import { LINK_TYPES, linkHref } from '@/lib/cards/links';
import { cardStrings } from '@/lib/cards/strings';
import { can } from '@/lib/cards/plans';
import LinkIcon from './LinkIcon';

type Props = {
  page: PublicPage;
  // Editor preview: no tracking, no navigation, no network.
  preview?: boolean;
};

function track(page: PublicPage, preview: boolean | undefined, body: Record<string, unknown>) {
  if (preview) return;
  try {
    const blob = new Blob([JSON.stringify({ page_id: page.id, ...body })], { type: 'application/json' });
    navigator.sendBeacon('/api/cards/event', blob);
  } catch {
    // tracking is best effort
  }
}

export default function CardView({ page, preview }: Props) {
  const t = cardStrings(page.lang);
  const theme = resolveTheme(page.theme ?? {}, page.plan);
  const [toast, setToast] = useState('');

  const links = (page.links ?? []).filter((l) => l.enabled && l.url.trim());
  const buttons = links.filter((l) => !LINK_TYPES[l.type]?.social);
  const socials = links.filter((l) => LINK_TYPES[l.type]?.social);
  const c = page.contact ?? {};
  const showReview = can(page.plan, 'reviewButton') && !!page.review?.url;
  const showFunnel = showReview && can(page.plan, 'reviewFunnel') && !!page.review?.funnel;
  const showSpecial = can(page.plan, 'special') && page.special?.enabled && page.special?.title;
  const showLeads = can(page.plan, 'leadCapture') && page.lead_capture;
  const showBadge = !(can(page.plan, 'hideBadge') && page.hide_badge);

  const initials = page.display_name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '·';

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }

  function guard(e: React.MouseEvent) {
    if (preview) e.preventDefault();
  }

  async function share(e: React.MouseEvent) {
    e.preventDefault();
    if (preview) return;
    const url = `${window.location.origin}/c/${page.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: page.display_name, url });
      else {
        await navigator.clipboard.writeText(url);
        flash(t.copied);
      }
    } catch {
      // share sheet dismissed
    }
  }

  const btnStyle: React.CSSProperties = {
    background: theme.button,
    color: theme.buttonText,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius,
  };
  const boxRadius = page.theme?.shape === 'pill' && can(page.plan, 'customStyle') ? '24px' : theme.radius;
  const boxStyle: React.CSSProperties = { ...btnStyle, borderRadius: boxRadius };
  const accentStyle: React.CSSProperties = {
    background: theme.accent,
    color: theme.accentText,
    borderRadius: theme.radius,
  };

  const quick = [
    c.phone && { key: 'call', icon: <Phone size={18} />, label: t.call, href: `tel:${c.phone.replace(/[^\d+]/g, '')}` },
    c.phone && { key: 'text', icon: <MessageSquare size={18} />, label: t.text, href: `sms:${c.phone.replace(/[^\d+]/g, '')}` },
    c.email && { key: 'email', icon: <Mail size={18} />, label: t.email, href: `mailto:${c.email}` },
  ].filter(Boolean) as { key: string; icon: React.ReactNode; label: string; href: string }[];

  return (
    <div
      className={`w-full ${preview ? 'min-h-full' : 'min-h-[100dvh]'}`}
      style={{ background: theme.background, color: theme.text, fontFamily: theme.font.css }}
    >
      <div className="mx-auto w-full max-w-[440px] pb-10">
        {page.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={page.cover_url} alt="" className="h-40 w-full object-cover" />
        ) : (
          <div className="h-16" />
        )}

        <div className="px-5">
          <div className={`flex flex-col items-center text-center ${page.cover_url ? '-mt-12' : 'mt-2'}`}>
            {page.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.avatar_url}
                alt={page.display_name}
                className="h-24 w-24 rounded-full object-cover"
                style={{ boxShadow: `0 0 0 4px ${theme.border}` }}
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold"
                style={{ background: theme.accent, color: theme.accentText, boxShadow: `0 0 0 4px ${theme.border}` }}
              >
                {initials}
              </div>
            )}
            <h1
              className="mt-4 text-[26px] leading-tight"
              style={{
                fontFamily: theme.font.heading,
                fontWeight: 700,
                textTransform: page.theme?.font === 'display' && can(page.plan, 'customStyle') ? 'uppercase' : undefined,
                letterSpacing: page.theme?.font === 'display' && can(page.plan, 'customStyle') ? '0.01em' : undefined,
              }}
            >
              {page.display_name || 'Your name'}
            </h1>
            {page.headline && <p className="mt-1 text-sm" style={{ color: theme.muted }}>{page.headline}</p>}
            {page.bio && <p className="mt-3 text-[15px] leading-relaxed">{page.bio}</p>}
          </div>

          <div className="mt-6 space-y-3">
            <a
              href={`/c/${page.slug}/vcard`}
              onClick={guard}
              className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-90"
              style={accentStyle}
            >
              <Download size={18} /> {t.saveContact}
            </a>

            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${quick.length + 1}, minmax(0, 1fr))` }}>
                {quick.map((q) => (
                  <a
                    key={q.key}
                    href={q.href}
                    onClick={(e) => { guard(e); track(page, preview, { kind: 'click', link_id: `quick-${q.key}` }); }}
                    className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium"
                    style={btnStyle}
                  >
                    {q.icon}
                    {q.label}
                  </a>
                ))}
                <a href="#" onClick={share} className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium" style={btnStyle}>
                  <Share2 size={18} />
                  {t.share}
                </a>
              </div>
          </div>

          {showSpecial && (
            <div
              className="mt-5 p-4"
              style={{ border: `1.5px dashed ${theme.accent}`, borderRadius: boxRadius, background: theme.button }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: theme.accent }}>
                <Tag size={16} /> {page.special.title}
              </div>
              {page.special.body && <p className="mt-1.5 text-sm leading-relaxed">{page.special.body}</p>}
              {(page.special.code || page.special.expires) && (
                <div className="mt-2 flex flex-wrap gap-x-4 text-xs" style={{ color: theme.muted }}>
                  {page.special.code && (
                    <span>
                      {t.code}: <strong className="tracking-wider" style={{ color: theme.text }}>{page.special.code}</strong>
                    </span>
                  )}
                  {page.special.expires && <span>{t.expires} {page.special.expires}</span>}
                </div>
              )}
            </div>
          )}

          {showReview && (
            <ReviewBlock page={page} preview={preview} funnel={showFunnel} theme={theme} btnStyle={btnStyle} boxStyle={boxStyle} accentStyle={accentStyle} />
          )}

          {buttons.length > 0 && (
            <div className="mt-5 space-y-3">
              {buttons.map((l) => (
                <a
                  key={l.id}
                  href={linkHref(l)}
                  target={['phone', 'sms', 'email'].includes(l.type) ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  onClick={(e) => { guard(e); track(page, preview, { kind: 'click', link_id: l.id }); }}
                  className="relative flex w-full items-center justify-center px-12 py-3.5 text-[15px] font-medium transition-transform active:scale-[0.99]"
                  style={btnStyle}
                >
                  <span className="absolute left-4 opacity-80"><LinkIcon type={l.type} /></span>
                  {l.label || LINK_TYPES[l.type]?.name}
                </a>
              ))}
            </div>
          )}

          {socials.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {socials.map((l) => (
                <a
                  key={l.id}
                  href={linkHref(l)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label || LINK_TYPES[l.type]?.name}
                  onClick={(e) => { guard(e); track(page, preview, { kind: 'click', link_id: l.id }); }}
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: theme.button, border: `1px solid ${theme.border}`, color: theme.buttonText }}
                >
                  <LinkIcon type={l.type} size={19} />
                </a>
              ))}
            </div>
          )}

          {showLeads && <LeadForm page={page} preview={preview} theme={theme} btnStyle={btnStyle} boxStyle={boxStyle} accentStyle={accentStyle} />}

          {showBadge && (
            <a
              href={`/en/cards?ref=${encodeURIComponent(page.slug)}`}
              onClick={guard}
              className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{ background: theme.button, border: `1px solid ${theme.border}`, color: theme.muted }}
            >
              <span className="font-bold" style={{ color: theme.text }}>N°1</span>
              {t.badge}
            </a>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/85 px-4 py-2 text-sm text-white">{toast}</div>
      )}
    </div>
  );
}

type BlockProps = {
  page: PublicPage;
  preview?: boolean;
  theme: ReturnType<typeof resolveTheme>;
  btnStyle: React.CSSProperties;
  boxStyle: React.CSSProperties;
  accentStyle: React.CSSProperties;
};

// Everyone who taps a star is shown the Google review link. Low ratings also get a
// private feedback option — never *instead of* the public one, per Google's review policy.
function ReviewBlock({ page, preview, funnel, theme, btnStyle, boxStyle, accentStyle }: BlockProps & { funnel: boolean }) {
  const t = cardStrings(page.lang);
  const [rating, setRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const url = page.review.url!;

  const reviewLink = (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => { if (preview) e.preventDefault(); track(page, preview, { kind: 'click', link_id: 'review' }); }}
      className="flex w-full items-center justify-center gap-2 px-4 py-3 text-[15px] font-semibold"
      style={accentStyle}
    >
      <Star size={17} fill="currentColor" /> {t.reviewCta}
    </a>
  );

  return (
    <div className="mt-5 p-4" style={boxStyle}>
      <p className="text-center text-sm font-semibold">{funnel ? t.reviewAsk : t.reviewTitle}</p>
      {funnel && (
        <div className="mt-3 flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => { setRating(n); track(page, preview, { kind: 'review', rating: n }); }}
              className="p-1"
              style={{ color: n <= rating ? theme.accent : theme.muted }}
            >
              <Star size={30} fill={n <= rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      )}
      {(!funnel || rating >= 4) && (
        <div className="mt-3">
          {funnel && <p className="mb-3 text-center text-sm" style={{ color: theme.muted }}>{t.reviewThanks}</p>}
          {reviewLink}
        </div>
      )}
      {funnel && rating > 0 && rating <= 3 && (
        <div className="mt-3 space-y-3">
          <p className="text-center text-sm" style={{ color: theme.muted }}>{t.reviewSorry}</p>
          {showForm ? (
            <LeadForm page={page} preview={preview} theme={theme} btnStyle={btnStyle} boxStyle={boxStyle} accentStyle={accentStyle} feedbackRating={rating} inline />
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full px-4 py-3 text-[15px] font-semibold"
              style={accentStyle}
            >
              {t.reviewPrivate}
            </button>
          )}
          <p className="text-center text-xs" style={{ color: theme.muted }}>{t.reviewOr}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (preview) e.preventDefault(); track(page, preview, { kind: 'click', link_id: 'review' }); }}
            className="block text-center text-sm underline"
          >
            {t.reviewCta}
          </a>
        </div>
      )}
    </div>
  );
}

function LeadForm({
  page, preview, theme, btnStyle, boxStyle, accentStyle, feedbackRating, inline,
}: BlockProps & { feedbackRating?: number; inline?: boolean }) {
  const t = cardStrings(page.lang);
  const [open, setOpen] = useState(!!inline);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const feedback = feedbackRating !== undefined;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) { setState('sent'); return; }
    setState('sending');
    try {
      const res = await fetch('/api/cards/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_id: page.id, kind: feedback ? 'feedback' : 'lead', rating: feedbackRating, ...form }),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  const input: React.CSSProperties = {
    background: 'transparent',
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: `calc(${theme.radius} * 0.6)`,
  };

  if (state === 'sent') {
    return (
      <div className={`${inline ? '' : 'mt-5'} flex items-center justify-center gap-2 p-4 text-sm font-medium`} style={boxStyle}>
        <Check size={17} /> {t.sent}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 px-4 py-3.5 text-[15px] font-medium"
        style={{ ...btnStyle, borderStyle: 'dashed' }}
      >
        <UserPlus size={18} /> {t.shareBack}
      </button>
    );
  }

  return (
    <form onSubmit={submit} className={`${inline ? '' : 'mt-5 p-4'} space-y-2.5`} style={inline ? undefined : boxStyle}>
      {!inline && (
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold">{t.shareBackWith(page.display_name.split(' ')[0] || page.display_name)}</p>
          <button type="button" aria-label="Close" onClick={() => setOpen(false)} style={{ color: theme.muted }}><X size={18} /></button>
        </div>
      )}
      <input className="w-full px-3 py-2.5 text-[15px] outline-none placeholder:opacity-60" style={input}
        placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required={!feedback} />
      <input className="w-full px-3 py-2.5 text-[15px] outline-none placeholder:opacity-60" style={input} type="email"
        placeholder={t.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full px-3 py-2.5 text-[15px] outline-none placeholder:opacity-60" style={input} type="tel"
        placeholder={t.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <textarea className="w-full px-3 py-2.5 text-[15px] outline-none placeholder:opacity-60" style={input} rows={feedback ? 3 : 2}
        placeholder={t.note} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} required={feedback} />
      {state === 'error' && <p className="text-sm" style={{ color: '#ff6b6b' }}>{t.error}</p>}
      <button type="submit" disabled={state === 'sending'} className="w-full px-4 py-3 text-[15px] font-semibold disabled:opacity-60" style={accentStyle}>
        {state === 'sending' ? '…' : t.send}
      </button>
    </form>
  );
}
