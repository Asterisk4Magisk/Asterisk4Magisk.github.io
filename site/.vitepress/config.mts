import { defineConfig } from 'vitepress'

const github = 'https://github.com/Asterisk4Magisk'

export default defineConfig({
  title: 'AsteriskAPP',
  titleTemplate: false,
  description: 'Open-source proxy clients for Android',
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/brand/asterisk.png' }],
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
      title: 'AsteriskAPP',
      description: '面向 Android 的开源代理客户端系列'
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'AsteriskAPP',
      description: 'Open-source proxy clients for Android'
    }
  },
  themeConfig: {
    siteTitle: 'AsteriskAPP',
    appearance: true,
    socialLinks: [{ icon: 'github', link: github }],
    locales: {
      'zh-cn': {
        nav: [
          { text: '应用', link: '/zh-cn/#apps' },
          { text: '核心能力', link: '/zh-cn/#features' },
          { text: '社区', link: '/zh-cn/#community' }
        ],
        outlineTitle: '本页内容',
        returnToTopLabel: '返回顶部',
        darkModeSwitchLabel: '外观',
        langMenuLabel: '切换语言'
      },
      en: {
        nav: [
          { text: 'Apps', link: '/en/#apps' },
          { text: 'Capabilities', link: '/en/#features' },
          { text: 'Community', link: '/en/#community' }
        ],
        outlineTitle: 'On this page',
        returnToTopLabel: 'Return to top',
        darkModeSwitchLabel: 'Appearance',
        langMenuLabel: 'Change language'
      }
    }
  }
})
