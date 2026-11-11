# BikaFlora — Florist website (Next.js)

Light-theme florist website for Kuala Lumpur & Selangor with WhatsApp ordering, customer accounts (sign up / login / forgot-password code by email), and SEO pages for 32 delivery areas.

## 1. Open on your Mac

1. Install **Node.js 20 or newer** from https://nodejs.org (LTS button).
2. Unzip `bikaflora.zip` and open the `bikaflora` folder in **VS Code** (File → Open Folder).
3. Open the terminal in VS Code (View → Terminal) and run:

```bash
npm install
npm run dev
```

4. Open http://localhost:3000 in your browser.

## 2. Where to change things

| What | File |
|---|---|
| WhatsApp number, email, cut-off time, opening hours | `lib/site.ts` |
| Products (name, price, sizes, photos, description) | `data/products.ts` |
| Categories + SEO text | `data/categories.ts` |
| Delivery areas (32 SEO pages) | `data/locations.ts` |
| Reviews (**replace the samples with real ones**, then set `reviewsAreSamples: false` in `lib/site.ts`) | `data/reviews.ts` |
| FAQ | `data/faqs.ts` |
| Blog posts | `data/posts.ts` |
| Colours & fonts | `app/globals.css` |
| Hero video | put `hero.mp4` in `public/video/` and set `heroVideo: "/video/hero.mp4"` in `lib/site.ts` (a sample video is included) |

**Product photos:** put them in `public/images/products/` (JPG or WebP, ideally 1000×1250 px) and use the path in `data/products.ts`, e.g. `"/images/products/red-roses.jpg"`.

**WhatsApp number format:** digits only with the country code, no `+` or spaces. A Malaysian number like 012-345 6789 becomes `60123456789`.

## 3. Login / Sign up (Supabase)

Accounts use **Supabase** (free). Your keys are in `.env.local`. Do these steps once in the Supabase dashboard (https://supabase.com/dashboard → project **bikaflora**):

1. **Authentication → URL Configuration**
   - Site URL: your live address, e.g. `https://bikaflora.vercel.app`
   - Redirect URLs: add `https://bikaflora.vercel.app/**` and `http://localhost:3000/**`
2. **Authentication → Emails → Templates** (so customers get a 6-digit **code**):
   - *Confirm signup*: add the line `Your code is: {{ .Token }}`
   - *Reset password*: add the line `Your password reset code is: {{ .Token }}`
3. **Recommended for real customers:** Supabase's built-in email sender is limited to a few emails per hour. Go to **Authentication → Emails → SMTP Settings** and connect a free sender such as Resend or Brevo, using your business email as the sender.

## 4. Put the site live on Vercel (one command)

A Vercel project called **bikaflora** is already created, with the Supabase keys saved in it, and this folder is already linked to it (`.vercel/project.json`). In the VS Code terminal run:

```bash
npx vercel --prod
```

The first time it opens your browser so you can log in to the Vercel account that owns the **bikaflora** project. After that it uploads and builds the site, then prints your live link (normally `https://bikaflora.vercel.app`). Run the same command again whenever you change something.

**Better long-term:** push this folder to a GitHub repo, then in Vercel → bikaflora → Settings → Git connect that repo. After that, every change you push goes live automatically.

## 5. SEO checklist after going live

- Set `NEXT_PUBLIC_SITE_URL` to your real domain once you connect one.
- Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.
- Create a Google Business Profile and link it in `lib/site.ts → social`.
- Replace the sample products, photos and reviews with your own.
