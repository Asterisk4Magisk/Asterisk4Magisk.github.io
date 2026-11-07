<script setup>
import { onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import {
  LOCALE_STORAGE_KEY,
  localizePath,
  resolvePreferredLocale
} from '../locale-routing.mjs'

const { site } = useData()
const path = ref('/')
const target = (locale) => localizePath(locale, path.value)

onMounted(() => {
  // Shown inside the 404 page too; keep the tab from reading "404" while
  // the redirect is pending.
  document.title = site.value.title
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
  <main class="language-gateway" aria-busy="true">
    <p class="language-gateway__eyebrow">Asterisk App Family</p>
    <span class="language-gateway__spinner" aria-hidden="true" />
    <h1 role="status">
      <span lang="zh-CN">正在跳转…</span>
      <span lang="en">Redirecting…</span>
    </h1>
    <p>
      <span lang="zh-CN">如果没有自动跳转，请选择语言。</span>
      <span lang="en">If nothing happens, choose a language.</span>
    </p>
    <nav aria-label="Available languages">
      <a :href="target('en')" hreflang="en">English</a>
      <a :href="target('zh-cn')" hreflang="zh-CN">简体中文</a>
    </nav>
  </main>
</template>
