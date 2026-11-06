<script setup>
import { onMounted, ref } from 'vue'
import {
  LOCALE_STORAGE_KEY,
  localizePath,
  resolvePreferredLocale
} from '../locale-routing.mjs'

const path = ref('/')
const target = (locale) => localizePath(locale, path.value)

onMounted(() => {
  path.value = window.location.pathname
  const suffix = window.location.search + window.location.hash
  const locale = resolvePreferredLocale({
    stored: window.localStorage.getItem(LOCALE_STORAGE_KEY),
    languages: navigator.languages?.length ? navigator.languages : [navigator.language]
  })
  window.location.replace(target(locale) + suffix)
})
</script>

<template>
  <main class="language-gateway">
    <p class="language-gateway__eyebrow">Asterisk App Family</p>
    <h1>Choose your language</h1>
    <p>Select a language if automatic detection does not continue.</p>
    <nav aria-label="Available languages">
      <a :href="target('en')" hreflang="en">English</a>
      <a :href="target('zh-cn')" hreflang="zh-CN">简体中文</a>
    </nav>
  </main>
</template>
