# AGENTS.md

Guidance for coding agents working on the Asterisk App Family website (`https://asterisk4magisk.github.io`). It is a VitePress site for three Android apps: **AsteriskNG** (Xray), **AsteriskMETA** (Mihomo / Meow), and **AsteriskBOX** (sing-box).

## Commands

```sh
npm ci          # install (Node.js 24, same as CI)
npm run dev     # local dev server — trusted networks only
npm run build   # production build into site/.vitepress/dist
npm run preview # serve the last build
```

There is no test or lint script. `npm run build` is the required check before every commit. `preview` serves a fixed build, so restart it after rebuilding.

## Layout

```text
site/
  index.md                    # language gateway (layout: false), redirects to /zh-cn/ or /en/
  zh-cn/ en/                  # one directory per locale, mirrored file for file
    index.md                  # homepage (hero + <HomeSections />)
    guide/*.md                # user guide
    changelog/index.md        # changelog overview
    changelog/{ng,meta,box}.md
  public/                     # static assets (app icons, brand, og.png)
  .vitepress/
    config.mts                # locales, top nav, guide sidebar, search
    theme/
      index.ts                # theme slots (hero image, not-found redirect, locale sync)
      site-content.mjs        # product facts and homepage copy
      locale-routing.mjs      # supported locales and path helpers
      components/*.vue
      styles.css
```

`site/.vitepress/dist` and `cache` are build output and git-ignored. Files at the repository root (this file, `README.md`) are outside `site/` and are not published.

## Locales

- Every page exists in both `site/zh-cn/` and `site/en/` with the same file name, headings, anchors, and structure. Change both in the same commit.
- Chinese copy uses the apps' Simplified Chinese UI labels in **bold**; English copy uses the English UI labels. Take labels from the apps' `strings.xml`, not from memory.
- Paths without a locale prefix (`/changelog/`, `/guide/faq`) are redirected client-side to the preferred locale by `NotFoundRedirect.vue` and `LanguageRedirect.vue`. Do not add duplicate unprefixed pages.
- A new locale needs its own lowercase directory, an entry in `config.mts` `locales`, `SUPPORTED_LOCALES` in `locale-routing.mjs`, and copy in `site-content.mjs`.

## Guide (`guide/`)

- The guide always describes the **latest released version** of each app. When an app ships, update the affected pages instead of adding version notes. Keep the version table in `guide/index.md` current.
- Verify behavior against the app source (commits since the last documented tag, `strings.xml`, settings code) before writing. Do not describe unreleased or speculative behavior.
- Keep user-facing explanation in the main text and implementation detail in `::: details` blocks.
- Cross-page links use relative paths with anchors (`./box#plugins`). VitePress slugs Chinese headings as-is (`./ng#订阅分组`); add explicit `{#id}` anchors for headings other pages link to.
- The guide sidebar is built by `guideSidebar()` in `config.mts`; new guide pages must be added there for both locales. Do not link the changelog from the guide.

## Changelog (`changelog/`)

- One page per app per locale, reached from the **Changelog** dropdown in the top nav. The homepage has no changelog entry.
- Only **stable releases** are listed; skip beta and rc tags. Sources are each app's GitHub Releases (`gh release list/view --repo Asterisk4Magisk/<App>`).
- Newest first. Each version is an `##` heading with an explicit anchor:

  ```md
  ## 1.1.26 · 2026-11-05 {#v1-1-26}
  ```

  Use the tag's version name exactly as released and the release publication date (UTC). Anchors start with `v` so they are valid CSS selectors.
- Bullets start with one category label: `**新增**` / `**改进**` / `**修复**` / `**核心**` / `**其他**` in Chinese, `**New**` / `**Improved**` / `**Fixed**` / `**Core**` / `**Other**` in English.
- Rewrite commits as user-facing changes. Leave out dependency bumps, build, CI, refactors, and pure styling unless users notice them. Record proxy core version changes under the core label.
- Link to the relevant guide section when one exists (`../guide/box#plugins`). In `changelog/index.md` use absolute links (`/zh-cn/changelog/ng`), because the page can be opened without a trailing slash.

## Homepage and theme

- Product names, cores, icons, and release URLs live in `site-content.mjs`; reuse them instead of hard-coding in components.
- Colors and spacing go through VitePress CSS variables in `styles.css`; check light and dark themes and a phone-width viewport after layout changes.
- The browser tab title is intentionally fixed to the site title (`transformPageData` in `config.mts`).

## Commits and deployment

- Commit messages: `site: <imperative summary>` for content and theme changes; `ci:`, `chore:`, or `style:` where they fit. Keep one logical change per commit.
- Pushing to `main` builds and deploys GitHub Pages through `.github/workflows/deploy-pages.yml`. Treat a push as publishing, and confirm with the maintainer before pushing.
- Never commit build output, `node_modules`, or editor folders.
