# Village Unhu

A Vite + React site for the Village Unhu contemporary art village.

## Forms setup

This project sends form submissions through Web3Forms.

1. Sign up at https://web3forms.com and create an access key.
2. Copy `.env.example` to `.env.local` and add your key:
   `VITE_WEB3FORMS_KEY=your_access_key_here`
3. For local development, keep the key in `.env.local` and do not commit it.
4. On Vercel, add the same variable in Project Settings → Environment Variables as `VITE_WEB3FORMS_KEY`.

The contact, residency, and newsletter forms all use the same Web3Forms endpoint and subject prefixes so you can filter replies in your inbox.
