# AsteriskAPP Website

Official GitHub Pages website for AsteriskNG, AsteriskMETA, and AsteriskBOX.

## Local development

Requirements: Node.js 20 or newer and npm.

```powershell
npm ci
npm run dev
```

## Build verification

```powershell
npm run build
```

The VitePress/Vite development server is intended for trusted local networks only. Do not expose it to untrusted networks, and track VitePress/Vite updates for upstream fixes to development-server advisories reported by `npm audit`.

## Language routes

- `/zh-cn/` — 简体中文
- `/en/` — English
- `/` — saved/browser language detection, with English fallback

Add future languages as their own lowercase URL directory and locale configuration. Keep product facts in `site/.vitepress/theme/site-content.mjs` and add translated presentation copy without duplicating Vue components.

## Deployment

`.github/workflows/deploy-pages.yml` tests and builds the site on pushes to `main`, then publishes `site/.vitepress/dist` with GitHub Pages. In the repository settings, set Pages source to **GitHub Actions**.

## License

The linked AsteriskAPPs are released under GPL-3.0. Website source licensing should be declared by the repository owner before external reuse.
