# Village Unhu

A Vite + React site for the Village Unhu contemporary art village.

## Forms setup

This project sends form submissions through Web3Forms.

1. Sign up at https://web3forms.com and create an access key.
2. Copy `.env.example` to `.env.local` and add your key:
   `VITE_WEB3FORMS_KEY=your_access_key_here`
3. For local development, keep the key in `.env.local` and do not commit it.
4. On Vercel, add the same variable in Project Settings → Environment Variables as `VITE_WEB3FORMS_KEY`.
5. For hCaptcha spam protection, use the Web3Forms-supported site key:
   `50b2fe65-b00b-4b9e-ad62-3ba471098be2`

The contact, residency, and newsletter forms all use the same Web3Forms endpoint and subject prefixes so you can filter replies in your inbox.

## Spam protection and hCaptcha

The forms use a layered anti-spam approach:

- hidden honeypot input to catch obvious bots
- hCaptcha with `sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"`
- `reCaptchaCompat={false}` per the Web3Forms integration example
- required `h-captcha-response` field in every Web3Forms payload
- local cooldown and rate-limit checks using `localStorage`
- stronger validation for disposable email domains and malformed input

This follows the Web3Forms hCaptcha guidance and keeps the site protected without storing secrets in the frontend.

> Note: the free Web3Forms plan uses the shared site key above; domain restriction is not available on the free tier.
