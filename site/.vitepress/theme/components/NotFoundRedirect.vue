<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue'
import LanguageRedirect from './LanguageRedirect.vue'
import { localeFromPath } from '../locale-routing.mjs'

// A path without a language prefix (e.g. /changelog/) is sent to the
// preferred language; anything else keeps the default 404 page.
const route = useRoute()
const hasLocale = computed(() => localeFromPath(route.path) !== null)
</script>

<template>
  <NotFound v-if="hasLocale" />
  <LanguageRedirect v-else />
</template>
