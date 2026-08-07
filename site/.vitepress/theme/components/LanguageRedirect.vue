<script setup>
import { onMounted } from 'vue'
import {
  LOCALE_STORAGE_KEY,
  localePath,
  resolvePreferredLocale
} from '../locale-routing.mjs'

onMounted(() => {
  const locale = resolvePreferredLocale({
    stored: window.localStorage.getItem(LOCALE_STORAGE_KEY),
    languages: navigator.languages?.length ? navigator.languages : [navigator.language]
  })
  window.location.replace(localePath(locale))
})
</script>

<template>
  <main class="language-gateway">
    <p class="language-gateway__eyebrow">AsteriskAPP</p>
    <h1>Choose your language</h1>
    <p>Select a language if automatic detection does not continue.</p>
    <nav aria-label="Available languages">
      <a href="/en/" hreflang="en">English</a>
      <a href="/zh-cn/" hreflang="zh-CN">简体中文</a>
    </nav>
  </main>
</template>
