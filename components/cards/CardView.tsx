'use client';

import { useState } from 'react';
import { Download, Phone, MessageSquare, Mail, Share2, Star, Tag, UserPlus, Check, X } from 'lucide-react';
import type { CardLink, PublicPage } from '@/lib/cards/types';
import { resolveTheme } from '@/lib/cards/themes';
import { LINK_TYPES, groupLinks, isIconLink, linkHref } from '@/lib/cards/links';
import { cardStrings } from '@/lib/cards/strings';
import { can } from '@/lib/cards/plans';
import LinkIcon from './LinkIcon';

type Props = {
  page: PublicPage;
  // Editor preview: no tracking, no navigation, no network.
  preview?: boolean;
  // Editor preview: what's being edited (a link id, or 'profile' | 'contact' | 'special' | 'review' | 'leads').
  // Everything else dims so the owner can see where it lands.
  focusId?: string | null;
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

export default function CardView({ page, preview, focusId }: Props) {
  const t = cardStrings(page.lang);
  const theme = resolveTheme(page.theme ?? {}, page.plan, page.avatar_url);
  const [toast, setToast] = useState('');

  const focusing = !!preview && !!focusId;
  // A link being edited shows in the preview even before it has a URL.
  const shown = (l: CardLink) => (l.enabled && l.url.trim()) || (focusing && l.id === focusId);
  const { loose, groups: allGroups } = groupLinks(page.links ?? []);
  const buttons = loose.filter(shown).filter((l) => !isIconLink(l));
  const socials = loose.filter(shown).filter(isIconLink);
  // A hidden section hides its links too; an empty one only shows while it's being edited.
  const groups = allGroups
    .map((g) => ({ section: g.section, links: g.section.enabled || (focusing && g.section.id === focusId) ? g.links.filter(shown) : [] }))
    .filter((g) => g.links.length > 0 || (focusing && g.section.id === focusId));
  const c = page.contact ?? {};
  const showReview = can(page.plan, 'reviewButton') && !!page.review?.url;
  const showFunnel = showReview && can(page.plan, 'reviewFunnel') && !!page.review?.funnel;
  const showSpecial = can(page.plan, 'special') && page.special?.enabled && page.special?.title;
  const showLeads = can(page.plan, 'leadCapture') && page.lead_capture;

  const zone = (id: string) =>
    !focusing
      ? {}
      : id === focusId
        ? { 'data-preview-focus': true, style: { outline: `2px solid ${theme.accent}`, outlineOffset: 3, transition: 'opacity .2s' } }
        : { style: { opacity: 0.25, transition: 'opacity .2s' } };
  const zoneStyle = (id: string) => (zone(id) as { style?: React.CSSProperties }).style;
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

  const btnStyle: React.CSSProperties = { ...theme.button, borderRadius: theme.radius };
  const boxRadius = theme.radiusId === 'full' ? '24px' : theme.radius;
  const boxStyle: React.CSSProperties = { ...theme.box, borderRadius: boxRadius };
  const accentStyle: React.CSSProperties = {
    background: theme.accent,
    color: theme.accentText,
    borderRadius: theme.radius,
    boxShadow: theme.shadow === 'none' ? undefined : theme.button.boxShadow,
    border: theme.shadow === 'hard' ? `2px solid ${theme.text}` : undefined,
  };

  const quick = [
    c.phone && { key: 'call', icon: <Phone size={18} />, label: t.call, href: `tel:${c.phone.replace(/[^\d+]/g, '')}` },
    c.phone && { key: 'text', icon: <MessageSquare size={18} />, label: t.text, href: `sms:${c.phone.replace(/[^\d+]/g, '')}` },
    c.email && { key: 'email', icon: <Mail size={18} />, label: t.email, href: `mailto:${c.email}` },
  ].filter(Boolean) as { key: string; icon: React.ReactNode; label: string; href: string }[];

  const title = theme.logo ? (
    <h1 className={theme.hero ? 'mt-0' : 'mt-4'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={theme.logo} alt={page.display_name} className="mx-auto w-auto max-w-[260px] object-contain" style={{ height: page.theme?.titleSize === 'large' ? 84 : 56 }} />
    </h1>
  ) : (
    <h1
      className={`${theme.hero ? 'mt-0' : 'mt-4'} leading-tight`}
      style={{
        fontFamily: theme.titleFont.heading,
        fontWeight: 700,
        fontSize: theme.titleSize,
        color: theme.titleColor,
        textTransform: theme.titleFont.upper ? 'uppercase' : undefined,
        letterSpacing: theme.titleFont.upper ? '0.01em' : undefined,
      }}
    >
      {page.display_name || 'Your name'}
    </h1>
  );

  return (
    <div
      className={`relative isolate w-full ${preview ? 'min-h-full' : 'min-h-[100dvh]'}`}
      style={{ background: theme.media ? theme.base : theme.background, color: theme.text, fontFamily: theme.font.css }}
    >
      {theme.media && <WallpaperMedia kind={theme.wallpaper} url={theme.media} tint={theme.tint} preview={preview} />}
      <div className="mx-auto w-full max-w-[440px] pb-10">
        {theme.hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.avatar_url!}
            alt={page.display_name}
            className="h-[380px] w-full object-cover"
            style={{ maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)' }}
          />
        ) : page.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={page.cover_url} alt="" className="h-40 w-full object-cover" />
        ) : (
          <div className="h-16" />
        )}

        <div className="px-5">
          <div {...zone('profile')} className={`relative flex flex-col items-center text-center ${theme.hero ? '-mt-20' : page.cover_url ? '-mt-12' : 'mt-2'}`}>
            {theme.hero ? null : page.avatar_url ? (
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
            {title}
            {page.headline && <p className="mt-1 text-sm" style={{ color: theme.muted }}>{page.headline}</p>}
            {page.bio && <p className="mt-3 text-[15px] leading-relaxed">{page.bio}</p>}
          </div>

          <div {...zone('contact')} className="mt-6 space-y-3">
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
              {...zone('special')}
              className="mt-5 p-4"
              style={{ border: `1.5px dashed ${theme.accent}`, borderRadius: boxRadius, background: theme.surface, ...zoneStyle('special') }}
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
            <div {...zone('review')}>
              <ReviewBlock page={page} preview={preview} funnel={showFunnel} theme={theme} btnStyle={btnStyle} boxStyle={boxStyle} accentStyle={accentStyle} />
            </div>
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
                  {...zone(l.id)}
                  className="relative flex w-full items-center justify-center px-12 py-3.5 text-[15px] font-medium transition-transform active:scale-[0.99]"
                  style={{ ...btnStyle, ...zoneStyle(l.id) }}
                >
                  <span className="absolute left-4 opacity-80"><LinkIcon type={l.type} /></span>
                  {l.label || LINK_TYPES[l.type]?.name}
                </a>
              ))}
            </div>
          )}

          {groups.map(({ section, links: items }) => {
            // Editing a link inside the box: keep the box lit so the link isn't dimmed with it.
            const inside = focusing && items.some((l) => l.id === focusId);
            return (
              <div
                key={section.id}
                {...(inside ? {} : zone(section.id))}
                className="mt-5 p-4"
                style={{ ...boxStyle, ...(inside ? {} : zoneStyle(section.id)) }}
              >
                <div className="flex items-center gap-3">
                  {section.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={section.image} alt="" className="h-10 w-10 shrink-0 object-cover" style={{ borderRadius: `calc(${boxRadius} * 0.5)` }} />
                  )}
                  <p className="min-w-0 truncate text-[15px] font-semibold">{section.label || 'Section'}</p>
                </div>
                {items.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {items.map((l, i) => (
                      <a
                        key={l.id}
                        href={linkHref(l)}
                        target={['phone', 'sms', 'email'].includes(l.type) ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        onClick={(e) => { guard(e); track(page, preview, { kind: 'click', link_id: l.id }); }}
                        {...zone(l.id)}
                        className={`flex min-w-0 items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-transform active:scale-[0.99] ${i === items.length - 1 && i % 2 === 0 ? 'col-span-2' : ''}`}
                        style={{ ...btnStyle, ...zoneStyle(l.id) }}
                      >
                        <span className="shrink-0 opacity-80"><LinkIcon type={l.type} size={16} /></span>
                        <span className="truncate">{l.label || LINK_TYPES[l.type]?.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

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
                  {...zone(l.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ ...btnStyle, borderRadius: '999px', ...zoneStyle(l.id) }}
                >
                  <LinkIcon type={l.type} size={19} />
                </a>
              ))}
            </div>
          )}

          {showLeads && (
            <div {...zone('leads')}>
              <LeadForm page={page} preview={preview} theme={theme} btnStyle={btnStyle} boxStyle={boxStyle} accentStyle={accentStyle} forceOpen={focusing && focusId === 'leads'} />
            </div>
          )}

          {showBadge && (
            <a
              href={`/en/cards?ref=${encodeURIComponent(page.slug)}`}
              onClick={guard}
              className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.muted }}
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

// Photo, video or blurred-profile wallpaper. Fixed behind the page on the live site;
// inside the editor's phone frame it fills the page instead, so it can't cover the editor.
function WallpaperMedia({ kind, url, tint, preview }: { kind: string; url: string; tint: string; preview?: boolean }) {
  const layer = `${preview ? 'absolute' : 'fixed'} inset-0 -z-10 overflow-hidden`;
  return (
    <div className={layer} aria-hidden>
      {kind === 'video' ? (
        <video src={url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
      ) : (
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${url}")`, ...(kind === 'blur' ? { filter: 'blur(40px) saturate(1.3)', transform: 'scale(1.25)' } : {}) }}
        />
      )}
      <div className="absolute inset-0" style={{ background: tint }} />
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
  page, preview, theme, btnStyle, boxStyle, accentStyle, feedbackRating, inline, forceOpen,
}: BlockProps & { feedbackRating?: number; inline?: boolean; forceOpen?: boolean }) {
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

  if (!open && !forceOpen) {
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
