<script setup>
import { computed } from 'vue'
import { inBrowser, useRoute } from 'vitepress'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import LanguageRedirect from './LanguageRedirect.vue'
import { localeFromPath } from '../locale-routing.mjs'

// A path without a language prefix (e.g. /changelog/) is sent to the
// preferred language; anything else keeps the default 404 page.
const route = useRoute()
// Use the address bar in the browser: a link clicked before the app mounts
// leaves route.path at its default '/' while the target page is still
// loading, which would otherwise prefix the locale twice (/en/en/...).
const currentPath = computed(() => {
  const path = route.path
  return inBrowser ? window.location.pathname : path
})
const hasLocale = computed(() => localeFromPath(currentPath.value) !== null)
</script>

<template>
  <NotFound v-if="hasLocale" />
  <LanguageRedirect v-else />
</template>
