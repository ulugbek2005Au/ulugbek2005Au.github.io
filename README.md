# Everyday Tools — multilingual static site

Includes six language paths (`/en/`, `/uz/`, `/ru/`, `/zh/`, `/es/`, `/tr/`), five working tools, responsive layout and basic information pages.

## Preview
Run `python3 -m http.server 8000` from this folder and visit http://localhost:8000/. Do not open index.html via file:// because root-relative assets need a web server.

## Publish
Upload the folder contents to a static host supporting directory index files (Cloudflare Pages, Netlify, etc.). For GitHub Pages project sites, root-relative paths require a custom domain or modification.

## Before production / monetization
- Replace placeholder contact page with real contact details.
- Review and localize legal pages; current legal pages are English-only drafts.
- Translate form labels, units and dynamic results for each locale (tool titles, descriptions and explanatory content are localized already).
- Add real canonical URLs, hreflang tags and sitemap after choosing a domain.
- Add genuinely helpful, original explanations/examples for every tool.
- Check AdSense and hosting policies; approval and income are not guaranteed.
- Test accessibility, browser compatibility and calculations thoroughly.
- Do not add ads until the policy, consent and privacy setup is ready.
