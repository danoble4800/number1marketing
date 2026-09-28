'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Plus, Trash2 } from 'lucide-react';
import type { CardLink, CardPage, LinkType } from '@/lib/cards/types';
import { LINK_TYPES, newLinkId } from '@/lib/cards/links';
import { can, FEATURE_PLAN } from '@/lib/cards/plans';
import { getSupabase } from '@/lib/supabase';
import { slugTyping } from '@/lib/cards/client';
import LinkIcon from '../LinkIcon';
import { Field, Section, Toggle, inputCls } from './ui';

type Props = {
  page: CardPage;
  set: (patch: Partial<CardPage>) => void;
  demo: boolean;
  userId: string | null;
  onUpgrade: () => void;
};

export default function PageTab({ page, set, demo, userId, onUpgrade }: Props) {
  const c = page.contact ?? {};
  const setContact = (k: keyof typeof c, v: string) => set({ contact: { ...c, [k]: v } });
  const lock = (f: keyof typeof FEATURE_PLAN) => (can(page.plan, f) ? null : FEATURE_PLAN[f]);

  return (
    <div className="space-y-5">
      <Section title="Profile" hint="The top of your page.">
        <div className="flex flex-wrap gap-5">
          <ImageInput label="Photo / logo" round value={page.avatar_url} onChange={(v) => set({ avatar_url: v })} demo={demo} userId={userId} pageId={page.id} />
          <ImageInput label="Cover image" value={page.cover_url} onChange={(v) => set({ cover_url: v })} demo={demo} userId={userId} pageId={page.id} />
        </div>
        <div className="mt-5 grid gap-4">
          <Field label="Name or business">
            <input className={inputCls} value={page.display_name} maxLength={60} onChange={(e) => set({ display_name: e.target.value })} />
          </Field>
          <Field label="Headline" hint="e.g. “Realtor® · Harbor & Main” or “Neapolitan pizza · Salem, MA”">
            <input className={inputCls} value={page.headline} maxLength={80} onChange={(e) => set({ headline: e.target.value })} />
          </Field>
          <Field label="Short bio">
            <textarea className={inputCls} rows={3} value={page.bio} maxLength={280} onChange={(e) => set({ bio: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="Contact details" hint="Powers the Call / Text / Email buttons and “Save contact”.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mobile"><input className={inputCls} type="tel" value={c.phone ?? ''} onChange={(e) => setContact('phone', e.target.value)} /></Field>
          <Field label="Email"><input className={inputCls} type="email" value={c.email ?? ''} onChange={(e) => setContact('email', e.target.value)} /></Field>
          <Field label="Company"><input className={inputCls} value={c.company ?? ''} onChange={(e) => setContact('company', e.target.value)} /></Field>
          <Field label="Job title"><input className={inputCls} value={c.title ?? ''} onChange={(e) => setContact('title', e.target.value)} /></Field>
          <Field label="Website"><input className={inputCls} value={c.website ?? ''} onChange={(e) => setContact('website', e.target.value)} /></Field>
          <Field label="Address"><input className={inputCls} value={c.address ?? ''} onChange={(e) => setContact('address', e.target.value)} /></Field>
        </div>
      </Section>

      <LinksEditor links={page.links ?? []} onChange={(links) => set({ links })} />

      <Section
        title="Google reviews"
        hint="A big “Leave us a review” button. Paste your Google review link (Google Business Profile → Ask for reviews)."
        locked={lock('reviewButton')}
        onUpgrade={onUpgrade}
      >
        <div className="space-y-4">
          <Field label="Google review link">
            <input className={inputCls} placeholder="https://g.page/r/…/review" value={page.review?.url ?? ''} onChange={(e) => set({ review: { ...page.review, url: e.target.value } })} />
          </Field>
          <div className={can(page.plan, 'reviewFunnel') ? '' : 'opacity-60'}>
            <Toggle
              label="Star rating first (Business)"
              hint="Visitors tap 1–5 stars. Everyone can still post on Google; unhappy customers also get a private way to tell you what went wrong."
              checked={!!page.review?.funnel}
              disabled={!can(page.plan, 'reviewFunnel')}
              onChange={(v) => set({ review: { ...page.review, funnel: v } })}
            />
            {!can(page.plan, 'reviewFunnel') && (
              <button type="button" onClick={onUpgrade} className="mt-2 text-xs text-brand-white underline">Upgrade to Business</button>
            )}
          </div>
        </div>
      </Section>

      <Section title="Special / coupon" hint="A highlighted offer at the top of your page. Change it weekly." locked={lock('special')} onUpgrade={onUpgrade}>
        <div className="space-y-4">
          <Toggle label="Show special" checked={!!page.special?.enabled} onChange={(v) => set({ special: { ...page.special, enabled: v } })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title"><input className={inputCls} value={page.special?.title ?? ''} placeholder="Tuesday 2-for-1" onChange={(e) => set({ special: { ...page.special, title: e.target.value } })} /></Field>
            <Field label="Code (optional)"><input className={inputCls} value={page.special?.code ?? ''} placeholder="TAP241" onChange={(e) => set({ special: { ...page.special, code: e.target.value.toUpperCase() } })} /></Field>
          </div>
          <Field label="Details"><textarea className={inputCls} rows={2} value={page.special?.body ?? ''} onChange={(e) => set({ special: { ...page.special, body: e.target.value } })} /></Field>
          <Field label="Ends (optional)"><input className={inputCls} value={page.special?.expires ?? ''} placeholder="Oct 31" onChange={(e) => set({ special: { ...page.special, expires: e.target.value } })} /></Field>
        </div>
      </Section>

      <Section title="Contact exchange" hint="Let people share their name, email and phone with you. New contacts are emailed to you." locked={lock('leadCapture')} onUpgrade={onUpgrade}>
        <div className="space-y-4">
          <Toggle label="Show “Share your info” button" checked={page.lead_capture} onChange={(v) => set({ lead_capture: v })} />
          <Field label="Send new contacts to" hint="Leave blank to use your sign-in email.">
            <input className={inputCls} type="email" value={page.lead_notify_email ?? ''} onChange={(e) => set({ lead_notify_email: e.target.value || null })} />
          </Field>
        </div>
      </Section>

      <Section title="Settings">
        <div className="space-y-5">
          <Field label="Page address" hint="Your card keeps working if you change this. Old shared links to /c/… will stop working.">
            <div className="flex items-center border border-brand-dark2 bg-brand-black focus-within:border-brand-light1">
              <span className="pl-3.5 text-sm text-brand-mid">…/c/</span>
              <input
                className="w-full bg-transparent px-1 py-2.5 text-sm text-brand-offwhite focus:outline-none"
                value={page.slug}
                onChange={(e) => set({ slug: slugTyping(e.target.value) })}
              />
            </div>
          </Field>
          <Field label="Page language" hint="For buttons like “Save contact”. Your own text stays as you write it.">
            <select className={inputCls} value={page.lang} onChange={(e) => set({ lang: e.target.value as CardPage['lang'] })}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </Field>
          <Toggle label="Page is live" hint="Turn off to hide your page. Taps show a “page is hidden” message." checked={page.published} onChange={(v) => set({ published: v })} />
        </div>
      </Section>
    </div>
  );
}

function LinksEditor({ links, onChange }: { links: CardLink[]; onChange: (l: CardLink[]) => void }) {
  const [adding, setAdding] = useState(false);
  const update = (i: number, patch: Partial<CardLink>) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= links.length) return;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = (type: LinkType) => {
    onChange([...links, { id: newLinkId(), type, label: LINK_TYPES[type].social ? LINK_TYPES[type].name : '', url: '', enabled: true }]);
    setAdding(false);
  };

  return (
    <Section
      title="Buttons & links"
      hint="Social links show as icons under your buttons."
      right={
        <button type="button" onClick={() => setAdding(!adding)} className="flex items-center gap-1.5 bg-brand-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-black">
          <Plus size={14} /> Add
        </button>
      }
    >
      {adding && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(Object.keys(LINK_TYPES) as LinkType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => add(t)}
              className="flex items-center gap-2 border border-brand-dark2 bg-brand-black px-3 py-2.5 text-left text-sm text-brand-offwhite hover:border-brand-light1"
            >
              <LinkIcon type={t} size={16} /> {LINK_TYPES[t].name}
            </button>
          ))}
        </div>
      )}
      {links.length === 0 && !adding && <p className="text-sm text-brand-mid">No links yet. Tap “Add” to start.</p>}
      <div className="space-y-3">
        {links.map((l, i) => (
          <div key={l.id} className={`border border-brand-dark2 bg-brand-black p-3 ${l.enabled ? '' : 'opacity-50'}`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-light1">
                <LinkIcon type={l.type} size={14} /> {LINK_TYPES[l.type]?.name}
              </span>
              <span className="flex items-center gap-1 text-brand-light1">
                <IconBtn label="Move up" onClick={() => move(i, -1)}><ArrowUp size={15} /></IconBtn>
                <IconBtn label="Move down" onClick={() => move(i, 1)}><ArrowDown size={15} /></IconBtn>
                <IconBtn label={l.enabled ? 'Hide' : 'Show'} onClick={() => update(i, { enabled: !l.enabled })}>
                  {l.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                </IconBtn>
                <IconBtn label="Delete" onClick={() => onChange(links.filter((_, j) => j !== i))}><Trash2 size={15} /></IconBtn>
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-[2fr_3fr]">
              {!LINK_TYPES[l.type]?.social && (
                <input className={inputCls} placeholder={`Button text (${LINK_TYPES[l.type]?.name})`} value={l.label} onChange={(e) => update(i, { label: e.target.value })} />
              )}
              <input
                className={`${inputCls} ${LINK_TYPES[l.type]?.social ? 'sm:col-span-2' : ''}`}
                placeholder={LINK_TYPES[l.type]?.placeholder}
                value={l.url}
                onChange={(e) => update(i, { url: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="p-1.5 hover:text-brand-white">
      {children}
    </button>
  );
}

function ImageInput({
  label, value, onChange, round, demo, userId, pageId,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  round?: boolean;
  demo: boolean;
  userId: string | null;
  pageId: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pick(file: File) {
    setErr('');
    if (file.size > 5 * 1024 * 1024) { setErr('Max 5 MB'); return; }
    if (demo || !userId) { onChange(URL.createObjectURL(file)); return; }
    setBusy(true);
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${userId}/${pageId}/${round ? 'avatar' : 'cover'}-${Date.now()}.${ext}`;
    const supabase = getSupabase();
    const { error } = await supabase.storage.from('card-media').upload(path, file, { contentType: file.type, upsert: true });
    setBusy(false);
    if (error) { setErr('Upload failed'); return; }
    onChange(supabase.storage.from('card-media').getPublicUrl(path).data.publicUrl);
  }

  return (
    <div>
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-mid">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`relative flex items-center justify-center overflow-hidden border border-dashed border-brand-mid bg-brand-black text-brand-light1 hover:border-brand-light1 ${round ? 'h-20 w-20 rounded-full' : 'h-20 w-40'}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={20} />
          )}
          {busy && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs">…</span>}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)} className="text-xs text-brand-light1 underline hover:text-brand-white">Remove</button>
        )}
      </div>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
    </div>
  );
}
