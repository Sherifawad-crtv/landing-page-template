# See Padel — landing page

Static implementation of the `See Padel.dc.html` Claude Design handoff.

## Files
- `index.html` — the landing page (hero, shareable highlights, 4 feature panels,
  Inside SEE, How it works, For clubs, FAQs, footer)
- `privacy.html` — Privacy Policy & Terms of Use (linked from the footer)
- `styles.css` — theme + responsive rules, ported from the prototype's `<style>`
  and media queries
- `app.js` — scroll/interaction behaviour (hero-hand parallax, floating menu,
  highlight scale-in, scrubbed "how it works" steps, FAQ accordion, wordmark fit,
  mobile menu)
- `assets/` — images + Obviously font (only the assets the page references)

## Run
```
python3 -m http.server 4173 --directory see-padel
```
then open http://localhost:4173

## Notes on the port
- The prototype's `x-dc` framework, `{{ }}` bindings and `style-hover` attributes
  were converted to plain HTML/CSS/JS.
- Design tokens are baked to the prototype defaults: accent `#F5821F`, framed hero,
  Glass overlay, `scaleFrom` 0.86, `parallax` 48.
- The `<image-slot>` in the "For clubs" panel is replaced with the image the user
  had dropped into it (extracted from `.image-slots.state.json` →
  `assets/cta-mockup.webp`), with the saved crop applied.
- Feature/step artwork uses the `-sm` (downscaled) asset variants, matching the
  prototype. Swap in the full-res files if higher fidelity is needed.
- External: Google Fonts (Archivo, Inter). Everything else is local.
