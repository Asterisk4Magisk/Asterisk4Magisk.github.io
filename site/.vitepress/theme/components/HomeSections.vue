<script setup>
import { computed } from 'vue'
import { getSiteContent, products } from '../site-content.mjs'

const props = defineProps({
  locale: { type: String, required: true }
})
const copy = computed(() => getSiteContent(props.locale))
</script>

<template>
  <div class="home-extra">
    <section id="apps" class="home-section" aria-labelledby="apps-title">
      <header class="section-heading">
        <p class="section-eyebrow">{{ copy.appsEyebrow }}</p>
        <h2 id="apps-title">{{ copy.appsTitle }}</h2>
      </header>
      <div class="app-grid">
        <article v-for="product in products" :key="product.id" class="app-card">
          <div class="app-card__header">
            <img :src="product.icon" alt="" width="72" height="72">
            <div>
              <span class="core-badge">{{ product.core }}</span>
              <h3>{{ product.name }}</h3>
            </div>
          </div>
          <p>{{ copy.productCopy[product.id].description }}</p>
          <ul>
            <li v-for="item in copy.productCopy[product.id].highlights" :key="item">{{ item }}</li>
          </ul>
          <div class="app-card__actions">
            <a class="button button--brand" :href="product.releaseUrl" target="_blank" rel="noopener noreferrer">{{ copy.download }}</a>
            <a class="button button--ghost" :href="product.repoUrl" target="_blank" rel="noopener noreferrer">{{ copy.source }}</a>
          </div>
        </article>
      </div>
    </section>

    <footer class="site-footer">
      <span class="site-footer__copyright">Copyright © 2026-present Asterisk4Magisk contributors.</span>
      <nav :aria-label="copy.telegram">
        <a href="https://t.me/Asterisk4Magisk" target="_blank" rel="noopener noreferrer">{{ copy.telegram }}</a>
      </nav>
    </footer>
  </div>
</template>
