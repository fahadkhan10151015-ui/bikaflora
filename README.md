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
| WhatsApp number, email, cut-off time, hero video | `lib/site.ts` |
| Delivery methods (Same-day Express / Scheduled) | `lib/site.ts` → `deliveryMethods` |
| WhatsApp message choices (order, question, custom, delivery) | `lib/whatsapp.ts` |
| Products (name, price, sizes, photos, description) | `data/products.ts` |
| Categories + SEO text | `data/categories.ts` |
| Delivery areas (32 SEO pages) | `data/locations.ts` |
| Reviews (replace samples, then set `reviewsAreSamples: false`) | `data/reviews.ts` |
| FAQ / Blog | `data/faqs.ts`, `data/posts.ts` |
| Site-wide photos (hero, KL skyline) | `lib/images.ts` |
| Colours, fonts, effects | `app/globals.css` |

**Product photos:** put your photos in `public/images/products/` and use `"/images/products/your-photo.jpg"` in `data/products.ts`. Sample photos come free from Unsplash and Pexels.

### Project structure

```
app/                 pages (one folder per URL)
components/
  auth/              login, signup, forgot password, account
  layout/            header, footer, logo
  product/           product card, gallery, order panel
  sections/          hero, reviews, FAQ, call-to-action blocks
  ui/                small shared pieces (photo, breadcrumbs, JSON-LD)
  whatsapp/          WhatsApp button + message chooser
data/                products, categories, areas, reviews, FAQ, blog
lib/                 settings, WhatsApp messages, SEO, images, Supabase
```

## 3. Login / Sign up (Supabase)

Accounts use **Supabase** (free). Your keys are in `.env.local`. Do these steps once in the Supabase dashboard (https://supabase.com/dashboard → project **bikaflora**):

1. **Authentication → URL Configuration**
   - Site URL: your live address, e.g. `https://bikaflora.vercel.app`
   - Redirect URLs: add `https://bikaflora.vercel.app/**` and `http://localhost:3000/**`
2. **Authentication → Emails → Templates** (so customers get a 6-digit **code**):
   - *Confirm signup*: add the line `Your code is: {{ .Token }}`
   - *Reset password*: add the line `Your password reset code is: {{ .Token }}`
3. **Recommended for real customers:** Supabase's built-in email sender is limited to a few emails per hour. Go to **Authentication → Emails → SMTP Settings** and connect a free sender such as Resend or Brevo, using your business email as the sender.

## 4. Live site & updates

The site is on GitHub (`fahadkhan10151015-ui/bikaflora`) and linked to Vercel. Every time you push a change to the `main` branch, Vercel puts it live automatically:

```bash
git add -A
git commit -m "my change"
git push
```

Environment variables (already set in Vercel → bikaflora → Settings → Environment Variables):

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 5. SEO checklist after going live

- Set `NEXT_PUBLIC_SITE_URL` to your real domain once you connect one.
- Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.
- Create a Google Business Profile and link it in `lib/site.ts → social`.
- Replace the sample products, photos and reviews with your own.


## Adding or changing products

1. Put the photos in `public/products/<product-name>/` named `01.jpg`, `02.jpg`, …
   Order: person holding the bouquet first, then the bouquet alone, other angles, and the details card last.
   For colours, use one folder per colour (e.g. `…/pink/`, `…/red/`).
2. Open `data/products.ts`, copy one product block and change the text, price, `compareAt` (crossed-out price), size and category.
3. Categories with no products are hidden automatically. Add a product with that category slug and the category appears in the menu, home page and shop.
