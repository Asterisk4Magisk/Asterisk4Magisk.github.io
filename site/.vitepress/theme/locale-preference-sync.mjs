import { watch } from 'vue'
import { LOCALE_STORAGE_KEY, localeFromPath } from './locale-routing.mjs'

export function startLocalePreferenceSync(route, storage) {
  return watch(() => route.path, (path) => {
    const locale = localeFromPath(path)
    if (locale) storage.setItem(LOCALE_STORAGE_KEY, locale)
  }, { immediate: true })
}
