# EcoSpin Dry-Cleaners — website

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Fully static, deploys on Vercel with zero config.

## Pages
`/` home, `/services`, `/pricing` (searchable price list), `/stores` (both stores + maps), `/book` (pickup request sent via WhatsApp), `/about`, `/terms`

## Editing content
Store addresses, phone/WhatsApp numbers, timings, prices and services are all in **`src/data/site.ts`**.
Change it there and every page updates. Photos are in `public/images/`.

## Local development
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # same command Vercel runs
```

## Deploy on Vercel
1. vercel.com → Add New → Project → import `Ajitsingh4362/EcoSpin` → Deploy (Next.js is auto-detected).
2. Settings → Domains → add `ecospindrycleaners.com` and `www.ecospindrycleaners.com`, then add the DNS records Vercel shows at your domain registrar.

Every push to `main` redeploys automatically.

## Counter / admin panel

The store counter panel lives at `/admin` (orders, receipts, WhatsApp, customers).
Architecture, the Supabase connection steps and WhatsApp options are in [docs/ADMIN.md](docs/ADMIN.md);
the database schema is in [supabase/schema.sql](supabase/schema.sql).
