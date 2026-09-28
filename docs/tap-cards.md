# N°1 Tap Cards

Customer landing pages for NFC cards (like Linktree/Dot/Popl), with Free / Pro / Business plans.

## Routes

| URL | What it is |
|---|---|
| `/t/<CARD_ID>` | Written to the chip. Logs the tap, then goes to the owner's page, the claim screen, or an admin-set redirect. Add `?src=qr` for printed QR codes. |
| `/c/<slug>` | The customer's public page. `/c/<slug>/vcard` downloads their contact. |
| `/card` | Owner sign-in (email magic link, shared with Academy accounts). |
| `/card/claim/<CARD_ID>` | First tap on a new card: sign in, name the page, card is linked. |
| `/card/edit` | Owner editor: Page, Look, Stats, Contacts, Cards & QR, Plan. `?demo=pizza|realtor|free` runs it with sample data, no login. |
| `/en/admin` → **Tap Cards** tab | Admin CRM (profiles.role = 'admin'): mint card IDs, see claims, switch cards off, set plans by hand. `/card/admin` and `/en/admin?tab=cards` open it directly. |
| `/en/cards` | Sales and pricing page. |
| `/c/demo-pizza`, `/c/demo-realtor`, `/c/demo-free` | Sample pages for sales demos. |

## Go live

1. **Database:** Supabase → SQL Editor → paste `supabase/cards.sql` → Run. It's safe to re-run.
2. **Service role key** (for lead emails and the Stripe webhook): Supabase → Project Settings → API → `service_role`.
   Add it to Vercel as `SUPABASE_SERVICE_ROLE_KEY`. Never expose it in the browser.
3. **Lead email sender:** `CARD_EMAIL_FROM` (optional). Defaults to `N°1 Tap Cards <cards@number1digitalmarketing.com>`,
   which works because the domain is verified in Resend.
4. **Stripe** (optional until you want self-serve upgrades). Without these, the Upgrade button asks people to text/call.
   - Create products "Tap Cards Pro" ($10/mo, $100/yr) and "Tap Cards Business" ($30/mo, $300/yr).
   - Env vars: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO_MONTH`, `STRIPE_PRICE_PRO_YEAR`,
     `STRIPE_PRICE_BUSINESS_MONTH`, `STRIPE_PRICE_BUSINESS_YEAR`, `STRIPE_WEBHOOK_SECRET`.
   - Webhook endpoint: `https://number1digitalmarketing.com/api/cards/stripe-webhook`, events
     `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   - Turn on the Customer Portal in Stripe (Settings → Billing → Customer portal).
5. **Making cards:** `/en/admin` → Tap Cards tab → Create N cards → copy the URLs → write each to a chip with the NFC Tools app
   (Write → Add a record → URL). NTAG213 or better is plenty. Put the matching `?src=qr` URL on the back as a QR code.

## How plans are enforced

- `card_pages.plan` can only be changed by an admin, the Stripe webhook, or the SQL editor (trigger `card_pages_guard`).
- The public page hides Pro/Business features on lower plans (`lib/cards/plans.ts`, `resolveTheme`), and
  `submit_card_lead()` refuses contact exchange / feedback the plan doesn't include.
- Downgrading never deletes settings. They reappear if the customer upgrades again.

## Review flow and Google's policy

Google doesn't allow "review gating" (only sending happy customers to Google). The Business star-rating step
shows the Google review button to everyone. Low ratings also get a private feedback form.
