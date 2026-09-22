# Landing page template

Static landing page (hero, shareable highlights, 4 feature panels, Inside SEE,
How it works, For clubs, FAQs, footer), originally built for See Padel and
repainted to use BizQwik's foundation design tokens as a reusable base.

## Files
- `index.html` — the landing page
- `privacy.html` — Privacy Policy & Terms of Use (linked from the footer)
- `styles.css` — theme + responsive rules
- `app.js` — scroll/interaction behaviour (hero-hand parallax, floating menu,
  highlight scale-in, scrubbed "how it works" steps, FAQ accordion, wordmark fit,
  mobile menu)
- `assets/` — images referenced by the page
- `assets/foundation-tokens.css` — BizQwik's foundation design tokens (colors,
  radii, fonts, shadows), ported from `github.com/Sherifawad-crtv/bizqwik`'s
  `src/index.css`. Linked in `<head>` alongside `styles.css` and used
  throughout the page's colors, type, and radii.

## Run
```
python3 -m http.server 4173
```
then open http://localhost:4173

## Palette & type
Every color and font in `index.html`, `privacy.html`, `styles.css`, and
`app.js` reads from `assets/foundation-tokens.css`'s custom properties
(`--primary`, `--ink`, `--paper`, `--surface`, `--ink-muted`, `--line`,
`--settled-fg`/`--settled-bg`, `--r-tile`/`--r-button`/`--r-card`, etc.) —
no hardcoded brand hex values remain. To reskin this template for a new
brand, edit the token values in that one file; nothing else needs to change.
Typography is Urbanist (headings/body) and Space Mono (numeric labels), both
loaded from Google Fonts.

Two deliberate departures from a literal token swap, since the original
design used two saturated brand hues (blue + orange) but BizQwik has one
(purple):
- Buttons that used to sit as a solid accent color on top of a
  primary-colored panel (Sign In, Get Early Access, Partner With SEE) now
  invert to a light `--surface`/`--ink` pill instead, so they still read as
  a distinct, clickable element against the primary background.
- The "For clubs" panel (formerly solid orange) uses `--primary-pressed`
  instead of `--primary`, so it still reads as a distinct "beat" from the
  hero/footer/Inside SEE sections that share `--primary`.

All body text is single-color: `var(--ink)` on the light `--paper` sections,
plain white on the saturated `--primary`/`--primary-pressed` panels (hero,
highlights, Inside SEE, For clubs, footer, privacy hero/contact-card) — text
color there can't be forced black without going unreadable, so white is kept
as the one exception. There's no more accent-purple text anywhere; `--primary`
is now used only for backgrounds, borders, and the small decorative eyebrow
dots. Every "subtitle" element — eyebrow/kicker labels, the tagline under each
heading, FAQ answers, footer labels/copyright, and privacy-page body copy —
uses `--font-mono` (Space Mono), matching how BizQwik's own components use
mono for secondary/label text; headings (h1/h2/h3) and nav/button labels stay
on `--font-body` (Urbanist).

## Notes on the port
- The prototype's `x-dc` framework, `{{ }}` bindings and `style-hover` attributes
  were converted to plain HTML/CSS/JS.
- The `<image-slot>` in the "For clubs" panel is replaced with the image the user
  had dropped into it (extracted from `.image-slots.state.json` →
  `assets/cta-mockup.webp`), with the saved crop applied.
- Feature/step artwork uses the `-sm` (downscaled) asset variants, matching the
  prototype. Swap in the full-res files if higher fidelity is needed.
- External: Google Fonts (Urbanist, Space Mono). Everything else is local.
