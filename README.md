# wwxd-landing

The marketing landing page for [wwxd](https://github.com/wwxd/wwxd) — what would x do?

Deploys to `wwxd.chat`.

## What this is

A standalone Next.js 16 project that builds to fully static HTML/CSS/JS (`output: 'export'`). It exists so the wwxd application repo stays a pure self-hosted tool, with no marketing logic to maintain.

The hosted wwxd app lives at `app.wwxd.chat` (or wherever you point `NEXT_PUBLIC_APP_URL`).

## Quick start

```bash
cp .env.example .env.local   # optional — override APP_URL / GITHUB_URL
pnpm install
pnpm dev                     # http://localhost:3000
pnpm build                   # writes static site to ./out/
```

`./out/` is portable — upload it anywhere (Vercel, Netlify, Cloudflare Pages, S3, your own nginx).

## Configuration

| Env var | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | `https://app.wwxd.chat` | Where "Start chatting" / "Add anyone" CTAs link to |
| `NEXT_PUBLIC_GITHUB_URL` | `https://github.com/wwxd/wwxd` | Where GitHub buttons link to |

## Shared design language

The mascot SVG (`PersonaAvatar`), brand mark, AI badge, and design tokens (font tokens, color palette, mascot animations) are duplicated from the wwxd application repo so the landing looks identical to the chat surface. If you change a token here, mirror it there (or — eventually — extract both into a shared `@wwxd/design` package).

Specifically duplicated:

- `app/components/persona-avatar.tsx`
- `app/components/ai-badge.tsx`
- `app/components/brand-mark.tsx`
- `lib/persona-styling.ts` (just `tintHex`)
- The CSS tokens + mascot animations in `app/globals.css`

## License

MIT — same as the main project.
