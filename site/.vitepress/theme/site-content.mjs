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
    appsEyebrow: '三个核心，一套体验',
    appsTitle: '选择你的 AsteriskAPP',
    download: '下载',
    source: '源代码',
    productCopy: {
      ng: {
        description: '将 Xray 的灵活能力整合为节点、策略组和路由，适合希望直接管理订阅与节点的用户。',
        highlights: ['兼容 v2rayNG 与 Mihomo 订阅格式', '统一管理节点、策略组与路由规则']
      },
      meta: {
        description: '保留 Mihomo 完整的配置与 Provider 体系，适合需要持续按个人策略调整订阅的用户。',
        highlights: ['通过 JavaScript 覆写订阅配置', '围绕配置档、Provider 与规则维护策略']
      },
      box: {
        description: '以 sing-box 配置模型组织网络能力，适合希望精细编排 DNS、出站和路由的用户。',
        highlights: ['将 sing-box 模型拆为独立配置对象', '统一编排 DNS、出站与路由配置']
      }
    },
    telegram: 'Telegram 频道'
  },
  en: {
    appsEyebrow: 'Three cores, one experience',
    appsTitle: 'Choose your AsteriskAPP',
    download: 'Download',
    source: 'Source code',
    productCopy: {
      ng: {
        description: "Organizes Xray's flexibility around nodes, strategy groups, and routes for users who prefer direct control over subscriptions and nodes.",
        highlights: ['Supports v2rayNG and Mihomo subscription formats', 'Manage nodes, strategy groups, and routes together']
      },
      meta: {
        description: "Preserves Mihomo's full profile and provider model for users who continuously tailor subscriptions to their own policies.",
        highlights: ['Use JavaScript to override imported profiles', 'Maintain policies across profiles, providers, and rules']
      },
      box: {
        description: "Organizes networking around sing-box's configuration model for users who want precise control over DNS, outbounds, and routing.",
        highlights: ['Break the sing-box model into separate configuration objects', 'Orchestrate DNS, outbounds, and routing in one configuration']
      }
    },
    telegram: 'Telegram channel'
  }
})

export function getSiteContent(locale) {
  return localizedContent[locale] ?? localizedContent.en
}
