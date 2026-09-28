# NFC shop (/shop)

## Go live

1. Stripe → Developers → API keys: add `STRIPE_SECRET_KEY` in Vercel (Production).
2. Stripe → Developers → Webhooks → Add endpoint
   `https://number1digitalmarketing.com/api/shop/webhook`, events
   `checkout.session.completed` and `checkout.session.expired`. Put its signing secret in
   `STRIPE_WEBHOOK_SECRET`.
3. Optional: set up Stripe Tax for Massachusetts, then set `STRIPE_AUTOMATIC_TAX=1`.
4. Redeploy. Place a test order with a Stripe test key first.

Until step 1 is done, the live page shows but checkout says "not open yet, text us".

## What happens on an order

- Paid: a row goes to the **Shop Orders** tab of the leads sheet (created automatically on
  the first order), the buyer is added to **Website Leads** with Lead Source "NFC Shop", you
  get an email alert (`LEAD_ALERT_EMAIL`), and the buyer gets a confirmation email if
  `LEAD_ALERT_FROM` is a verified Resend sender.
- Checkout started but never paid (Stripe expires it after 24h): the buyer goes to
  **Website Leads** as "NFC Shop (abandoned cart)" so you can follow up.

## Fulfilling an order

1. Status "Paid — send proof": design the card/stand in Canva and text the proof.
2. Find the Google review link if they left it blank (Google Business Profile → Ask for
   reviews, or search the business on Google Maps → Share review link).
3. Write the link to the chips with NFC Tools (iPhone/Android), test with two phones,
   then lock the tag so nobody can rewrite it.
4. Ship, then fill in Shipped / Tracking in the sheet.

Prices, shipping and products are in `lib/shop/products.ts`; copy is in
`messages/*.json` under `shop`.
