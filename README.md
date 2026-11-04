# Schiketanz Real Estate

Notes for M. Schiketanz Real Estate Inc. (Kitchener-Waterloo property management). Client edits content themselves, so pull before touching anything.

## Stack

- **Astro 5**, fully static (`output: 'static'` in `astro.config.mjs`). Every page is prerendered at build time.
- **Netlify** hosts it (`@astrojs/netlify` adapter). Pushing to `main` on GitHub triggers a deploy.
- **Keystatic (cloud mode)** is the CMS the client uses at `schiketanz.ca/keystatic`. Cloud project: `schiketanz/schiketanz` (set in `keystatic.config.ts`). When they save, Keystatic commits straight to `main` on GitHub (that's what all the "Update src/content/rentals/..." commits are), and Netlify rebuilds. The Keystatic admin routes are the only server-rendered part of the site; the Netlify adapter handles them.
- **Tailwind CSS v4** through the Vite plugin. There's no `tailwind.config`; theme colours and fonts live in the `@theme` block in `src/styles/global.css`. `@tailwindcss/typography` styles the `.prose` wrappers around MDX/Keystatic content (enabled with `@plugin` in `global.css`).
- **Netlify Forms** for maintenance requests. No backend of my own.

## Working on it

```
git pull                 # ALWAYS first — the client may have committed through Keystatic
npm install
npm run dev              # localhost:4321, Keystatic admin at localhost:4321/keystatic
npm run dev -- --force   # if Vite gets weird/stale, this clears its dependency cache
npm run build            # what Netlify runs; check it passes before pushing
```

Files are CRLF on disk (Windows) and `.gitattributes` normalizes them — expect harmless line-ending warnings.

## Where things live

| What | Where |
|---|---|
| Page shell, `<head>`, SEO/OG tags, business JSON-LD, mobile menu script | `src/layouts/Layout.astro` |
| Nav links | `src/components/Navbar.astro` |
| Logo (text, set in Century Gothic) | `src/components/Logo.astro` |
| Page title + breadcrumbs (+ breadcrumb JSON-LD) | `src/components/PageHeader.astro` |
| Image carousel (rentals + commercial) | `src/components/PropertyGallery.astro` |
| Colours, fonts, Tailwind plugins | `src/styles/global.css` |
| Rental listings (one folder per building: `index.mdx`, `coverImage`, `gallery/`) | `src/content/rentals/<slug>/` |
| News & notices (show on the home page, newest 3) | `src/content/news/` |
| Content schema (Astro side) | `src/content/config.ts` |
| CMS schema (Keystatic side) | `keystatic.config.ts` |
| Rental detail page template | `src/pages/rentals/[id].astro` |
| Commercial photos (Forest Hill) — not in the CMS, drop files in the folder | `src/assets/commercial/forest-hill/` |
| Downloadable PDFs (application, PAD form) | `public/forms/` |
| Newsletter PDFs (linked from news posts) | `public/newsletters/` |
| Fonts (Century Gothic, client-supplied) | `public/fonts/` |

**If I change a rental field, change it in both `keystatic.config.ts` and `src/content/config.ts`** — the two schemas have to agree or the build fails (or Keystatic writes data Astro rejects).

Content collections use Astro's legacy style (`type: 'content'`, `src/content/config.ts`, `rental.slug`). Fine on Astro 5; Astro 6+ drops it, so upgrading (7.x is current) means moving to the `glob()` loader / `content.config.ts` / `entry.id`.

## Rentals

- Vacancy is a Keystatic conditional field: `vacancyStatus.discriminant` is `occupied` or `vacant`; when vacant, `value` is the list of unit types and prices. The rentals page sorts vacant buildings first.
- The rental page gallery is `gallery` images then the `coverImage`.
- The prices/text are the client's to maintain — don't "fix" their numbers without asking.
- `import-gallery.mjs` bulk-pulls photos from an iGuide tour into a building's `gallery/` as 1920px WebP and rewrites the `gallery:` list in its frontmatter:
  `node import-gallery.mjs https://youriguide.com/<tourId> <building-slug>`
  (Uses `sharp`, which comes in with Astro.)

## Maintenance form (`src/pages/maintenance.astro`)

- Two separate Netlify forms, `maintenance-group-1` and `maintenance-group-2`. Each building is assigned a group in the hand-written `buildings` list at the top of the file; picking a building shows that group's form and stamps the building name into a hidden `building_name` field. The split exists so each group's submissions can be routed to different people — the email notifications are set per form in the Netlify dashboard (Forms → form → notifications), not in code.
- **That building list is NOT pulled from the rentals collection.** A new building added in Keystatic must also be added here by hand.
- Netlify finds the forms by scanning the built HTML at deploy, which works because every page is prerendered. Don't make this page server-rendered. Honeypot field: `bot-field`.
- On submit Netlify serves `/success` (set to `noindex` and kept out of the sitemap).
- Photos upload with the form; Netlify caps a submission at 8 MB.
- The privacy page (section 4) mentions that form data is stored by Netlify, possibly outside Canada. Keep that true if the form setup changes.

## SEO bits

- `site` in `astro.config.mjs` is the canonical domain; canonical/OG URLs and the sitemap are built from it.
- Sitemap: `@astrojs/sitemap` → `/sitemap-index.xml`, referenced from `public/robots.txt`.
- JSON-LD: `RealEstateAgency` on every page (Layout), `ApartmentComplex` on rental pages, `BreadcrumbList` from PageHeader. Office address, phone and hours in the Layout schema are hard-coded — keep them in sync with `contact.astro` if they change.
- Pages can pass `noindex` to Layout.
- Internal links end in a trailing slash (`/about/`). Netlify serves pages at `/page/` and 301-redirects `/page` there, so slash-less links cost a redirect. Keep new links in that form. `www.schiketanz.ca` redirects to `schiketanz.ca` (set in Netlify domain settings).

## Gotchas

- Century Gothic is used for the logo and most headings (`font-century`). Only the regular file is wired to `font-century`, so `font-bold` is the browser-synthesised bold. That's deliberate: the client prefers that look (the real bold file is noticeably wider). The bold file is registered as "Century Gothic Bold" / `font-centurybold` but unused. `font-display: block` hides text briefly while the fonts load.
- Open Sans loads only the 400 weight (`@fontsource/open-sans/index.css`), so its bold/italic are browser-synthesised too, also deliberately, to keep the current look.
- Scripts run on `astro:page-load` because of the `<ClientRouter />` view transitions. Forms use `data-astro-reload` so they do a real POST.
- `@astrojs/node` and `@astrojs/markdoc` are in `package.json` but unused (Netlify adapter is the one in use, and content is MDX).
- Skip `--host` on `npm run dev` unless testing on a phone — it exposes the dev server to the network, and several dev-server advisories apply on Windows.
- Maintenance dropdown names should match the rental titles exactly.
