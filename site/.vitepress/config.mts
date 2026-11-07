import { defineConfig } from 'vitepress'
import {
  SUPPORTED_LOCALES,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  resolvePreferredLocale,
  localePath,
  localizePath,
  localeFromPath
} from './theme/locale-routing.mjs'

const siteTitle = 'Asterisk App Family'

// Inlined into 404.html: sends language-less paths (e.g. /changelog/) to the
// preferred locale before the app bundle loads, so the 404 page never shows.
// Reuses the functions from locale-routing.mjs to keep one implementation.
const earlyLanguageRedirect = `(() => {
  try {
    const SUPPORTED_LOCALES = ${JSON.stringify(SUPPORTED_LOCALES)}
    ${normalizeLocale}
    ${resolvePreferredLocale}
    ${localePath}
    ${localizePath}
    ${localeFromPath}
    if (localeFromPath(location.pathname)) return
    let stored = null
    try { stored = localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)}) } catch {}
    const locale = resolvePreferredLocale({
      stored,
      languages: navigator.languages?.length ? navigator.languages : [navigator.language]
    })
    location.replace(localizePath(locale, location.pathname) + location.search + location.hash)
  } catch {}
})()`

const github = 'https://github.com/Asterisk4Magisk'
const telegramChannel = 'https://t.me/Asterisk4Magisk'
const telegram = 'https://t.me/AsteriskFactory'

function guideSidebar(base: string, labels: { start: string, shared: string, apps: string, core: string, help: string }, text: Record<string, string>) {
  return [
    {
      text: labels.start,
      items: [
        { text: text.index, link: `${base}/` },
        { text: text.gettingStarted, link: `${base}/getting-started` }
      ]
    },
    {
      text: labels.shared,
      items: [
        { text: text.runModes, link: `${base}/run-modes` },
        { text: text.common, link: `${base}/common` }
      ]
    },
    {
      text: labels.apps,
      items: [
        { text: 'AsteriskNG', link: `${base}/ng` },
        { text: 'AsteriskMETA', link: `${base}/meta` },
        { text: 'AsteriskBOX', link: `${base}/box` }
      ]
    },
    {
      text: labels.core,
      items: [
        { text: text.coreXray, link: `${base}/core-xray` },
        { text: text.coreMihomo, link: `${base}/core-mihomo` },
        { text: text.coreSingbox, link: `${base}/core-singbox` }
      ]
    },
    {
      text: labels.help,
      items: [
        { text: text.automation, link: `${base}/automation` },
        { text: text.faq, link: `${base}/faq` }
      ]
    }
  ]
}

export default defineConfig({
  title: 'Asterisk App Family',
  titleTemplate: false,
  description: 'Open-source proxy clients for Android',
  cleanUrls: true,
  lastUpdated: false,
  // Keep the browser tab title fixed to the site title on every page.
  transformPageData(pageData, { siteConfig }) {
    pageData.title = siteConfig.site.title
  },
  // 404.html also serves language-less paths that are about to redirect, so it
  // starts with the site title and the early redirect. Real 404s under a
  // locale still get the "404" title once the app renders.
  transformHtml(html, _id, { page }) {
    if (page !== '404.md') return
    return html
      .replace('<title>404</title>', `<title>${siteTitle}</title>`)
      .replace('<meta charset="utf-8">', `<meta charset="utf-8">\n    <script>${earlyLanguageRedirect}</script>`)
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/brand/asterisk.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/brand/asterisk.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/brand/asterisk.png' }]
  ],
  sitemap: {
    hostname: 'https://asterisk4magisk.github.io',
    transformItems: (items) => items.filter((item) => item.url !== '')
  },
  locales: {
    'zh-cn': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-cn/',
      title: 'Asterisk App Family',
      description: '面向 Android 的开源代理客户端系列',
      themeConfig: {
        nav: [
          { text: '应用', link: '/zh-cn/#apps' },
          { text: '文档', link: '/zh-cn/guide/', activeMatch: '^/zh-cn/guide/' },
          { text: '更新日志', activeMatch: '^/zh-cn/changelog/', items: [{ text: 'AsteriskNG', link: '/zh-cn/changelog/ng' }, { text: 'AsteriskMETA', link: '/zh-cn/changelog/meta' }, { text: 'AsteriskBOX', link: '/zh-cn/changelog/box' }] },
          { text: '频道', link: telegramChannel },
          { text: '社区', link: telegram }
        ],
        sidebar: {
          '/zh-cn/guide/': guideSidebar('/zh-cn/guide',
            { start: '开始', shared: '通用', apps: '应用', core: '核心', help: '进阶与帮助' },
            {
              index: '文档概览',
              gettingStarted: '快速开始',
              runModes: '运行模式与 ROOT',
              common: '通用功能',
              coreXray: 'Xray',
              coreMihomo: 'Mihomo',
              coreSingbox: 'sing-box',
              automation: '自动化与外部控制',
              faq: '常见问题与排错'
            })
        },
        docFooter: { prev: '上一页', next: '下一页' },
        sidebarMenuLabel: '目录',
        outline: { level: [2, 3], label: '本页内容' },
        returnToTopLabel: '返回顶部',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        langMenuLabel: '切换语言'
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'Asterisk App Family',
      description: 'Open-source proxy clients for Android',
      themeConfig: {
        nav: [
          { text: 'Apps', link: '/en/#apps' },
          { text: 'Guide', link: '/en/guide/', activeMatch: '^/en/guide/' },
          { text: 'Changelog', activeMatch: '^/en/changelog/', items: [{ text: 'AsteriskNG', link: '/en/changelog/ng' }, { text: 'AsteriskMETA', link: '/en/changelog/meta' }, { text: 'AsteriskBOX', link: '/en/changelog/box' }] },
          { text: 'Channel', link: telegramChannel },
          { text: 'Community', link: telegram }
        ],
        sidebar: {
          '/en/guide/': guideSidebar('/en/guide',
            { start: 'Start here', shared: 'Shared', apps: 'Apps', core: 'Core', help: 'Advanced & help' },
            {
              index: 'Overview',
              gettingStarted: 'Getting started',
              runModes: 'Run modes & root',
              common: 'Common features',
              coreXray: 'Xray',
              coreMihomo: 'Mihomo',
              coreSingbox: 'sing-box',
              automation: 'Automation & control',
              faq: 'FAQ & troubleshooting'
            })
        },
        outline: { level: [2, 3], label: 'On this page' },
        returnToTopLabel: 'Return to top',
        darkModeSwitchLabel: 'Appearance',
        langMenuLabel: 'Change language'
      }
    }
  },
  themeConfig: {
    siteTitle: 'Asterisk App Family',
    appearance: true,
    socialLinks: [{ icon: 'github', link: github }],
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-cn': {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有找到相关结果',
                resetButtonTitle: '清除查询',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    }
  }
})
