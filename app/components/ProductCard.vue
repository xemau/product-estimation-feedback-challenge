<script setup lang="ts">
import type { Presentation } from '../../shared/types/experiment'

defineProps<{ presentation: Presentation }>()
</script>

<template>
  <article class="product-card overflow-hidden" :class="presentation.style === 'dark' ? 'product-editorial' : 'product-retail'">
    <div class="product-image-wrap">
      <img :src="presentation.image" alt="Photograph of the product being valued" class="product-image" fetchpriority="high">
    </div>
    <div class="product-copy">
      <p v-if="presentation.style === 'dark'" class="editorial-kicker">An object of everyday beauty</p>
      <h2 :class="presentation.style === 'dark' ? 'serif editorial-title' : 'retail-title'">{{ presentation.name }}</h2>
      <p class="product-description">{{ presentation.description }}</p>
      <p v-if="presentation.style === 'dark'" class="editorial-footer">Form & feeling <span>✦</span> The collection</p>
    </div>
  </article>
</template>

<style scoped>
.product-card { display: grid; grid-template-columns: 1fr; min-height: 520px; }
.product-image-wrap { min-height: 330px; overflow: hidden; }
.product-image { width: 100%; height: 100%; max-height: 520px; object-fit: cover; }
.product-copy { padding: 1.75rem; }
.product-retail { background: #fff; border: 1px solid #e5e5e5; }
.product-retail .product-image-wrap { background: #f3f3f3; }
.retail-title { font-size: 1.55rem; font-weight: 650; letter-spacing: -.04em; }
.product-description { max-width: 34rem; margin-top: .8rem; line-height: 1.65; }
.product-retail .product-description { color: #555; }
.product-editorial { background: #27251f; color: #f6f0e3; }
.product-editorial .product-image-wrap { background: #c8bca8; }
.editorial-kicker { margin-bottom: 1.1rem; color: #d2b27b; font-size: .65rem; font-weight: 700; letter-spacing: .25em; text-transform: uppercase; }
.editorial-title { font-size: clamp(2.15rem, 3vw, 3.25rem); line-height: 1.05; letter-spacing: -.045em; overflow-wrap: anywhere; }
.product-editorial .product-description { color: #d1c7b4; }
.editorial-footer { display: flex; justify-content: space-between; max-width: 21rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #6c6251; color: #d2b27b; font-size: .64rem; letter-spacing: .2em; text-transform: uppercase; }
@media (min-width: 760px) {
  .product-card { grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); min-height: 580px; }
  .product-image-wrap { min-height: 580px; }
  .product-image { max-height: none; }
  .product-copy { display: flex; flex-direction: column; justify-content: center; padding: clamp(2rem, 5vw, 5rem); }
}
</style>
