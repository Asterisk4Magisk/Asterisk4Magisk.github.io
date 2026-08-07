export const SUPPORTED_LOCALES = Object.freeze(['zh-cn', 'en'])
export const LOCALE_STORAGE_KEY = 'asterisk.locale'

export function normalizeLocale(value) {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase().replaceAll('_', '-')
  if (normalized === 'zh-cn' || normalized.startsWith('zh-') || normalized === 'zh') {
    return 'zh-cn'
  }
  if (normalized === 'en' || normalized.startsWith('en-')) return 'en'
  return null
}

export function resolvePreferredLocale({ stored, languages = [] }) {
  if (SUPPORTED_LOCALES.includes(stored)) return stored
  for (const language of languages) {
    const locale = normalizeLocale(language)
    if (locale) return locale
  }
  return 'en'
}

export function localePath(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return '/en/'
  return `/${locale}/`
}

export function localeFromPath(pathname) {
  if (typeof pathname !== 'string') return null
  const segment = pathname.split('/').filter(Boolean)[0]
  return SUPPORTED_LOCALES.includes(segment) ? segment : null
}
