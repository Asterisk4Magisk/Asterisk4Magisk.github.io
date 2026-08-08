const repoBase = 'https://github.com/Asterisk4Magisk'

export const products = Object.freeze([
  {
    id: 'ng',
    name: 'AsteriskNG',
    core: 'Xray',
    icon: '/apps/asterisk-ng.png',
    repoUrl: `${repoBase}/AsteriskNG`,
    releaseUrl: `${repoBase}/AsteriskNG/releases/latest`
  },
  {
    id: 'meta',
    name: 'AsteriskMETA',
    core: 'Mihomo',
    icon: '/apps/asterisk-meta.png',
    repoUrl: `${repoBase}/AsteriskMETA`,
    releaseUrl: `${repoBase}/AsteriskMETA/releases/latest`
  },
  {
    id: 'box',
    name: 'AsteriskBOX',
    core: 'sing-box',
    icon: '/apps/asterisk-box.png',
    repoUrl: `${repoBase}/AsteriskBOX`,
    releaseUrl: `${repoBase}/AsteriskBOX/releases/latest`
  }
])

export const localizedContent = Object.freeze({
  'zh-cn': {
    appsEyebrow: '三款 Android 客户端',
    appsTitle: '选择适合你的应用',
    download: '下载',
    source: '源代码',
    productCopy: {
      ng: {
        description: '导入订阅或节点链接，选择节点即可连接。适合希望直接管理节点的用户。',
        highlights: ['节点可单独编辑、分享并整理到不同分组', '支持自定义策略组、链式代理与路由规则']
      },
      meta: {
        description: '导入订阅后，选择节点即可使用，应用会按照配置中的规则自动分流。',
        highlights: ['直接使用配置中的策略组、规则与 Providers', '支持 JavaScript 配置覆写，并可在应用内调试结果']
      },
      box: {
        description: '将 sing-box 的代理、DNS、路由和 VPN 连接集中到一个应用中管理。',
        highlights: ['可分别配置出站、选择器、DNS 与路由规则', '可导入 WireGuard、OpenVPN 和 OpenConnect 配置']
      }
    },
    telegram: 'Telegram 频道'
  },
  en: {
    appsEyebrow: 'Three Android clients',
    appsTitle: 'Choose the app that fits you',
    download: 'Download',
    source: 'Source code',
    productCopy: {
      ng: {
        description: 'Import a subscription or share link, then choose a server to connect. For users who prefer managing servers directly.',
        highlights: ['Edit and share individual servers, then organize them into groups', 'Build custom strategy groups, proxy chains, and routing rules']
      },
      meta: {
        description: 'Import a subscription, choose a server, and connect. Traffic is automatically routed by the rules in the profile.',
        highlights: ['Use strategy groups, rules, and providers defined by the profile', 'Override profiles with JavaScript and debug the result in the app']
      },
      box: {
        description: 'Manage sing-box proxies, DNS, routing, and VPN connections in one app.',
        highlights: ['Configure outbounds, selectors, DNS, and routing rules separately', 'Import WireGuard, OpenVPN, and OpenConnect configurations']
      }
    },
    telegram: 'Telegram channel'
  }
})

export function getSiteContent(locale) {
  return localizedContent[locale] ?? localizedContent.en
}
