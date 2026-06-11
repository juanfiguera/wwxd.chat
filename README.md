# wwxd.chat

Source for the **[wwxd.chat](https://wwxd.chat)** landing page.

The chat app itself lives at **[github.com/juanfiguera/wwxd](https://github.com/juanfiguera/wwxd)** and is self-hosted only — no production server. This site exists to explain what wwxd is and point people at that repo.

## What's in here

A standalone Next.js 16 project that builds to fully-static HTML/CSS/JS (`output: 'export'`). Ships to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`.

The design tokens, mascot SVG, and a couple of small components are duplicated from the chat repo so the two surfaces match visually. See [Shared design language](#shared-design-language) below.

## Local dev

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Optional: override the GitHub URL the CTAs point at.

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_GITHUB_URL
```

## Build the static site

```bash
pnpm build        # writes the static site to ./out/
```

`./out/` is portable. Upload it anywhere static (GitHub Pages, Cloudflare Pages, Netlify, S3, your own nginx).

## Deploy to GitHub Pages

The workflow at `.github/workflows/deploy.yml` does this on every push to `main`. One-time setup if you're forking:

1. **Settings → Pages → Source = GitHub Actions.**
2. **Custom domain (optional).** `public/CNAME` is set to `wwxd.chat`. If you're using a different domain, update that file. If you're not using a custom domain, delete it and the site will live at `https://<your-user>.github.io/<repo>/`.
3. **DNS for `wwxd.chat`.** Add an `ALIAS`/`ANAME` (or four `A` records) pointing at GitHub Pages's IPs. See [GitHub's apex-domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
4. **Override the linked repo URL (optional).** In Settings → Secrets and variables → Actions → Variables, set `NEXT_PUBLIC_GITHUB_URL` to your fork's URL. Otherwise the CTAs will still point at `juanfiguera/wwxd`.

## Configuration

| Env var | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_GITHUB_URL` | `https://github.com/juanfiguera/wwxd` | Where every "View on GitHub" / "Clone the repo" CTA links to |

There is no `NEXT_PUBLIC_APP_URL`. wwxd has no hosted chat — every CTA goes to the GitHub repo so visitors land on the README and clone it.

## Shared design language

A few files are duplicated from `juanfiguera/wwxd` so the landing looks identical to the chat surface. If you change one of these here, mirror it there.

- `app/components/persona-avatar.tsx`
- `app/components/ai-badge.tsx`
- `app/components/brand-mark.tsx`
- `lib/persona-styling.ts` (just `tintHex`)
- The CSS tokens + mascot animations in `app/globals.css`

Eventually these would move into a shared `@wwxd/design` package; the duplication is intentional for now to keep both repos independent.

## License

MIT.
