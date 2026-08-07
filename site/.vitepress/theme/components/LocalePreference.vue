<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vitepress'
import { startLocalePreferenceSync } from '../locale-preference-sync.mjs'

const route = useRoute()

onMounted(() => {
  startLocalePreferenceSync(route, window.localStorage)
})
</script>

<template><span hidden aria-hidden="true" /></template>
