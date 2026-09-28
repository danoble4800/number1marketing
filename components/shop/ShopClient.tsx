'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Minus, Plus, Lock, Loader2, MessageSquare } from 'lucide-react';
import Button from '@/components/Button';
import ProductArt from './ProductArt';
import {
  PRODUCTS,
  DESIGNS,
  FREE_SHIPPING_CENTS,
  CUSTOM_MIN_QTY,
  REQUIRED_LINKS,
  cartKey,
  cartLines,
  cartSubtotal,
  neededLinks,
  shippingFor,
  formatUsd,
  type Cart,
  type Design,
  type LinkField,
  type ProductId,
} from '@/lib/shop/products';

type Details = {
  business: string;
  contactName: string;
  phone: string;
  email: string;
  notes: string;
  smsConsent: boolean;
};

const initialDetails: Details = {
  business: '',
  contactName: '',
  phone: '',
  email: '',
  notes: '',
  smsConsent: false,
};

const inputClass = (error?: boolean) =>
  `w-full bg-brand-dark2 border ${
    error ? 'border-brand-light1' : 'border-brand-dark2'
  } text-brand-offwhite placeholder:text-brand-mid px-4 py-3 text-sm focus:outline-none focus:border-brand-light2 transition-colors`;
const labelClass = 'block text-xs uppercase tracking-widest text-brand-light1 mb-1.5';

export default function ShopClient({ locale }: { locale: string }) {
  const t = useTranslations('shop');
  const [cart, setCart] = useState<Cart>({});
  const [design, setDesign] = useState<Partial<Record<ProductId, Design>>>({});
  const [details, setDetails] = useState<Details>(initialDetails);
  const [links, setLinks] = useState<Partial<Record<LinkField, string>>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'closed'>('idle');

  const lines = cartLines(cart);
  const subtotal = cartSubtotal(cart);
  const shipping = shippingFor(subtotal);
  const needed = neededLinks(lines);
  const hasWifi = lines.some((l) => l.design === 'wifi');

  const setQty = (key: string, qty: number, max: number) => {
    setCart((c) => ({ ...c, [key]: Math.max(0, Math.min(max, qty)) }));
    setErrors((e) => ({ ...e, cart: false }));
  };

  const set = <K extends keyof Details>(key: K, value: Details[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const setLink = (field: LinkField, value: string) => {
    setLinks((l) => ({ ...l, [field]: value }));
    setErrors((e) => ({ ...e, [`link_${field}`]: false }));
  };

  const checkout = async () => {
    const e: Record<string, boolean> = {
      cart: lines.length === 0,
      business: !details.business.trim(),
      contactName: !details.contactName.trim(),
      phone: details.phone.replace(/\D/g, '').length < 10,
      email: !/^\S+@\S+\.\S+$/.test(details.email),
    };
    for (const f of needed) if (REQUIRED_LINKS.includes(f)) e[`link_${f}`] = !links[f]?.trim();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, links, cart, locale }),
      });
      const data = await res.json();
      if (res.status === 503) return setStatus('closed');
      if (!res.ok || !data.url) throw new Error();
      window.location.href = data.url;
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => {
          const d = p.designs ? design[p.id] ?? 'googleReview' : undefined;
          const key = cartKey(p.id, d);
          const qty = cart[key] ?? 0;
          const inCart = lines.filter((l) => l.product.id === p.id).reduce((n, l) => n + l.qty, 0);
          const features = t.raw(`products.${p.id}.features`) as string[];
          return (
            <div
              key={p.id}
              className={`flex flex-col bg-brand-white border ${
                inCart ? 'border-brand-white ring-2 ring-brand-light2' : 'border-brand-dark2'
              } transition-shadow`}
            >
              <div className="relative">
                <ProductArt art={p.art} design={d} />
                {p.compareAt && (
                  <span className="absolute top-3 left-3 bg-brand-white text-brand-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                    {t('save', { amount: formatUsd(p.compareAt - p.price) })}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 p-6 text-brand-black">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display uppercase text-2xl tracking-tight">{t(`products.${p.id}.name`)}</h3>
                  <p className="font-semibold whitespace-nowrap">
                    {p.compareAt && (
                      <span className="text-brand-light1 line-through font-normal mr-2">{formatUsd(p.compareAt)}</span>
                    )}
                    {formatUsd(p.price)}
                  </p>
                </div>
                <p className="mt-2 text-brand-mid text-sm leading-relaxed">{t(`products.${p.id}.desc`)}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-brand-dark2 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand-light1">—</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {p.designs && (
                  <div className="mt-5">
                    <p className="text-[10px] uppercase tracking-widest text-brand-mid font-semibold mb-2">
                      {t('designLabel')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DESIGNS.map((option) => {
                        const n = cart[cartKey(p.id, option)] ?? 0;
                        return (
                          <button
                            key={option}
                            onClick={() => setDesign((s) => ({ ...s, [p.id]: option }))}
                            className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                              d === option
                                ? 'bg-brand-black text-brand-white border-brand-black'
                                : 'bg-brand-white text-brand-dark2 border-brand-light2 hover:border-brand-black'
                            }`}
                          >
                            {t(`designs.${option}`)}
                            {n > 0 && <span className="ml-1.5 opacity-70">· {n}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-4">
                  {qty === 0 ? (
                    <button
                      onClick={() => setQty(key, 1, p.maxQty)}
                      className="w-full border border-brand-black bg-brand-black text-brand-white hover:bg-brand-dark1 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors"
                    >
                      {p.designs ? t('addDesign', { design: t(`designs.${d}`) }) : t('add')}
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center border border-brand-light2">
                        <button
                          onClick={() => setQty(key, qty - 1, p.maxQty)}
                          className="p-3 text-brand-mid hover:text-brand-black"
                          aria-label={t('less')}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-semibold tabular-nums">{qty}</span>
                        <button
                          onClick={() => setQty(key, qty + 1, p.maxQty)}
                          className="p-3 text-brand-mid hover:text-brand-black"
                          aria-label={t('more')}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-brand-mid text-sm tabular-nums">{formatUsd(p.price * qty)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom printing */}
        <div className="flex flex-col justify-between border border-brand-dark2 p-6 sm:p-8 bg-brand-dark1">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-light1 font-semibold mb-3">{t('custom.eyebrow')}</p>
            <h3 className="font-display uppercase text-3xl text-brand-white tracking-tight">{t('custom.heading')}</h3>
            <p className="mt-3 text-brand-light1 text-sm leading-relaxed">
              {t('custom.text', { min: CUSTOM_MIN_QTY })}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button href={`/${locale}/contact`} variant="primary" className="w-full text-xs">
              {t('custom.quote')}
            </Button>
            <a
              href="sms:+17819850916"
              className="inline-flex items-center justify-center gap-2 border border-brand-dark2 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-brand-light2 hover:border-brand-light1 hover:text-brand-white transition-colors"
            >
              <MessageSquare size={14} />
              {t('custom.text2')}
            </a>
          </div>
        </div>
      </div>

      {/* Order details + summary */}
      <div id="order" className="scroll-mt-24 mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-brand-dark1 border border-brand-dark2 p-6 sm:p-8">
          <h2 className="font-display uppercase text-2xl sm:text-3xl text-brand-white tracking-tight">
            {t('form.heading')}
          </h2>
          <p className="mt-2 mb-6 text-brand-light1 text-sm">{t('form.subheading')}</p>

          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>{t('form.business')} *</label>
              <input
                className={inputClass(errors.business)}
                value={details.business}
                onChange={(e) => set('business', e.target.value)}
                placeholder={t('form.businessPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('form.contactName')} *</label>
                <input
                  className={inputClass(errors.contactName)}
                  value={details.contactName}
                  onChange={(e) => set('contactName', e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className={labelClass}>{t('form.phone')} *</label>
                <input
                  className={inputClass(errors.phone)}
                  value={details.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  type="tel"
                  autoComplete="tel"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('form.email')} *</label>
              <input
                className={inputClass(errors.email)}
                value={details.email}
                onChange={(e) => set('email', e.target.value)}
                type="email"
                autoComplete="email"
              />
            </div>

            {/* Links, based on the designs in the cart */}
            <div className="border-t border-brand-dark2 pt-5 flex flex-col gap-5">
              <p className="text-xs uppercase tracking-widest text-brand-light2 font-semibold">{t('form.linksHeading')}</p>
              {lines.length === 0 && <p className="text-sm text-brand-mid -mt-2">{t('form.linksEmpty')}</p>}
              {needed.map((f) => (
                <div key={f}>
                  <label className={labelClass}>
                    {t(`form.links.${f}.label`)}
                    {REQUIRED_LINKS.includes(f) && ' *'}
                  </label>
                  <input
                    className={inputClass(errors[`link_${f}`])}
                    value={links[f] ?? ''}
                    onChange={(e) => setLink(f, e.target.value)}
                    placeholder={t(`form.links.${f}.placeholder`)}
                  />
                  {t.has(`form.links.${f}.help`) && (
                    <p className="mt-1.5 text-xs text-brand-mid">{t(`form.links.${f}.help`)}</p>
                  )}
                </div>
              ))}
              {hasWifi && <p className="text-sm text-brand-light1">{t('form.wifiNote')}</p>}
            </div>

            <div>
              <label className={labelClass}>{t('form.notes')}</label>
              <textarea
                className={`${inputClass()} min-h-[88px]`}
                value={details.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder={t('form.notesPlaceholder')}
                maxLength={480}
              />
            </div>
            <label className="flex items-start gap-3 text-sm text-brand-light1 cursor-pointer">
              <input
                type="checkbox"
                checked={details.smsConsent}
                onChange={() => set('smsConsent', !details.smsConsent)}
                className="mt-1 accent-white"
              />
              <span>{t('form.smsConsent')}</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 bg-brand-near-black border border-brand-dark2 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-widest text-brand-light1 font-semibold mb-4">
              {t('summary.heading')}
            </p>
            {lines.length === 0 ? (
              <p className={`text-sm ${errors.cart ? 'text-brand-white' : 'text-brand-mid'}`}>{t('summary.empty')}</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {lines.map((l) => (
                  <li key={l.key} className="flex justify-between gap-4 text-brand-light2">
                    <span>
                      {l.qty}× {t(`products.${l.product.id}.name`)}
                      {l.design && <span className="text-brand-mid"> · {t(`designs.${l.design}`)}</span>}
                    </span>
                    <span className="tabular-nums">{formatUsd(l.product.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 pt-4 border-t border-brand-dark2 space-y-2 text-sm">
              <div className="flex justify-between text-brand-light1">
                <span>{t('summary.setup')}</span>
                <span>{t('summary.included')}</span>
              </div>
              <div className="flex justify-between text-brand-light1">
                <span>{t('summary.shipping')}</span>
                <span className="tabular-nums">{shipping ? formatUsd(shipping) : t('summary.free')}</span>
              </div>
              {subtotal > 0 && shipping > 0 && (
                <p className="text-xs text-brand-mid">
                  {t('summary.freeShippingAt', { amount: formatUsd(FREE_SHIPPING_CENTS - subtotal) })}
                </p>
              )}
              <div className="flex justify-between text-brand-white font-semibold text-base pt-2">
                <span>{t('summary.total')}</span>
                <span className="tabular-nums">{formatUsd(subtotal + shipping)}</span>
              </div>
              <p className="text-xs text-brand-mid">{t('summary.taxNote')}</p>
            </div>

            <button
              onClick={checkout}
              disabled={status === 'loading'}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-brand-white text-brand-black border border-brand-white hover:bg-brand-offwhite px-6 py-4 text-sm font-semibold tracking-widest uppercase transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
              {t('summary.checkout')}
            </button>
            {Object.values(errors).some(Boolean) && (
              <p className="mt-3 text-xs text-brand-light2">{t('summary.fixErrors')}</p>
            )}
            {status === 'error' && <p className="mt-3 text-xs text-brand-light2">{t('summary.error')}</p>}
            {status === 'closed' && <p className="mt-3 text-xs text-brand-light2">{t('summary.closed')}</p>}
            <p className="mt-4 text-xs text-brand-mid leading-relaxed">{t('summary.secure')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
