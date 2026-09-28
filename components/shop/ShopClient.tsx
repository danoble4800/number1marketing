'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Minus, Plus, Lock, Loader2 } from 'lucide-react';
import ProductArt from './ProductArt';
import {
  PRODUCTS,
  TAP_TARGETS,
  FREE_SHIPPING_CENTS,
  cartLines,
  cartSubtotal,
  shippingFor,
  formatUsd,
  type Cart,
  type ProductId,
  type TapTarget,
} from '@/lib/shop/products';

type Details = {
  business: string;
  contactName: string;
  phone: string;
  email: string;
  tapTarget: TapTarget;
  link: string;
  notes: string;
  smsConsent: boolean;
};

const initialDetails: Details = {
  business: '',
  contactName: '',
  phone: '',
  email: '',
  tapTarget: 'googleReview',
  link: '',
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
  const [details, setDetails] = useState<Details>(initialDetails);
  const [errors, setErrors] = useState<Partial<Record<keyof Details | 'cart', boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'closed'>('idle');

  const lines = cartLines(cart);
  const subtotal = cartSubtotal(cart);
  const shipping = shippingFor(subtotal);

  const setQty = (id: ProductId, qty: number) => {
    const max = PRODUCTS.find((p) => p.id === id)!.maxQty;
    setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(max, qty)) }));
    setErrors((e) => ({ ...e, cart: false }));
  };

  const set = <K extends keyof Details>(key: K, value: Details[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const checkout = async () => {
    const e: typeof errors = {
      cart: lines.length === 0,
      business: !details.business.trim(),
      contactName: !details.contactName.trim(),
      phone: details.phone.replace(/\D/g, '').length < 10,
      email: !/^\S+@\S+\.\S+$/.test(details.email),
      link: (details.tapTarget === 'website' || details.tapTarget === 'instagram') && !details.link.trim(),
    };
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, cart, locale }),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PRODUCTS.map((p) => {
          const qty = cart[p.id] ?? 0;
          const features = t.raw(`products.${p.id}.features`) as string[];
          return (
            <div
              key={p.id}
              className={`flex flex-col bg-brand-dark1 border ${
                qty ? 'border-brand-light2' : 'border-brand-dark2'
              } transition-colors`}
            >
              <div className="relative border-b border-brand-dark2">
                <ProductArt art={p.art} />
                {p.compareAt && (
                  <span className="absolute top-3 left-3 bg-brand-white text-brand-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                    {t('save', { amount: formatUsd(p.compareAt - p.price) })}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display uppercase text-2xl text-brand-white tracking-tight">
                    {t(`products.${p.id}.name`)}
                  </h3>
                  <p className="text-brand-white font-semibold whitespace-nowrap">
                    {p.compareAt && (
                      <span className="text-brand-mid line-through font-normal mr-2">{formatUsd(p.compareAt)}</span>
                    )}
                    {formatUsd(p.price)}
                  </p>
                </div>
                <p className="mt-2 text-brand-light1 text-sm leading-relaxed">{t(`products.${p.id}.desc`)}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-brand-light2 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand-mid">—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between gap-4">
                  {qty === 0 ? (
                    <button
                      onClick={() => setQty(p.id, 1)}
                      className="w-full border border-brand-white bg-brand-white text-brand-black hover:bg-brand-offwhite px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors"
                    >
                      {t('add')}
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center border border-brand-dark2">
                        <button
                          onClick={() => setQty(p.id, qty - 1)}
                          className="p-3 text-brand-light2 hover:text-brand-white"
                          aria-label={t('less')}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-brand-white font-semibold tabular-nums">{qty}</span>
                        <button
                          onClick={() => setQty(p.id, qty + 1)}
                          className="p-3 text-brand-light2 hover:text-brand-white"
                          aria-label={t('more')}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-brand-light1 text-sm tabular-nums">{formatUsd(p.price * qty)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
            <div>
              <label className={labelClass}>{t('form.tapTarget')} *</label>
              <select
                className={inputClass()}
                value={details.tapTarget}
                onChange={(e) => set('tapTarget', e.target.value as TapTarget)}
              >
                {TAP_TARGETS.map((target) => (
                  <option key={target} value={target}>
                    {t(`form.targets.${target}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                {t(`form.linkLabels.${details.tapTarget}`)}
                {(details.tapTarget === 'website' || details.tapTarget === 'instagram') && ' *'}
              </label>
              <input
                className={inputClass(errors.link)}
                value={details.link}
                onChange={(e) => set('link', e.target.value)}
                placeholder={t(`form.linkPlaceholders.${details.tapTarget}`)}
              />
              {details.tapTarget === 'googleReview' && (
                <p className="mt-1.5 text-xs text-brand-mid">{t('form.googleHelp')}</p>
              )}
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
                  <li key={l.product.id} className="flex justify-between gap-4 text-brand-light2">
                    <span>
                      {l.qty}× {t(`products.${l.product.id}.name`)}
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
