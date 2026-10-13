<script setup lang="ts">
import type { Presentation } from '../../shared/types/experiment'

defineProps<{ presentation: Presentation }>()
</script>

<template>
  <article class="product-card overflow-hidden" :class="[presentation.style === 'dark' ? 'product-feature' : 'product-catalog', `scene-${presentation.scene}`]">
    <div class="product-image-wrap relative">
      <img :src="presentation.image" alt="Photograph of the product being valued" class="product-image" fetchpriority="high">
    </div>
    <div class="product-copy">
      <div>
        <p class="product-kicker">{{ presentation.kicker }}</p>
        <h2 class="product-title" :class="presentation.style === 'dark' ? 'serif' : ''">{{ presentation.name }}</h2>
        <p class="product-description">{{ presentation.description }}</p>
      </div>
      <div class="product-bottom"><span>Consider the object</span><span aria-hidden="true">✳</span></div>
    </div>
  </article>
</template>

<style scoped>
.product-card { display: grid; grid-template-columns: 1fr; min-height: 510px; border-radius: 1.7rem; box-shadow: 0 28px 70px rgba(34, 39, 103, .15); }
.product-image-wrap { min-height: 315px; overflow: hidden; }
.product-image { display: block; width: 100%; height: 100%; max-height: 470px; object-fit: cover; }
.product-copy { display: flex; flex-direction: column; justify-content: space-between; gap: 2rem; padding: 1.8rem; }
.product-kicker { margin-bottom: 1.6rem; font-size: .67rem; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; }
.product-title { max-width: 11ch; font-size: clamp(2rem, 3vw, 3.3rem); font-weight: 760; line-height: 1.06; letter-spacing: -.055em; overflow-wrap: anywhere; }
.product-description { max-width: 30rem; margin-top: 1.3rem; line-height: 1.6; }
.product-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid currentColor; font-size: .65rem; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; opacity: .72; }
.product-bottom span:last-child { font-size: 1.4rem; line-height: 1; }
.product-catalog { border: 1px solid #fff; background: #fff; color: #25294b; }
.product-catalog .product-image-wrap { background: #f0f1f6; }
.product-catalog .product-kicker { color: #6a6f92; }
.product-catalog .product-description { color: #656b85; }
.product-catalog .product-bottom { border-color: #d8dbeb; }
.product-feature { color: #fff; }
.product-feature .product-kicker, .product-feature .product-bottom { color: var(--highlight); }
.product-feature .product-title { font-size: clamp(2.25rem, 3.3vw, 3.7rem); font-weight: 400; }
.product-feature .product-description { color: rgba(255,255,255,.79); }
.product-feature .product-bottom { border-color: rgba(255,255,255,.34); }
.scene-iris.product-feature { --highlight: #c6bbff; background: radial-gradient(circle at 84% 0%, #7764de, transparent 48%), linear-gradient(145deg, #2b286e, #171936); }
.scene-ember.product-feature { --highlight: #ffc5a0; background: radial-gradient(circle at 16% 0%, #db875a, transparent 53%), linear-gradient(145deg, #743857, #241d3b); }
.scene-mint.product-feature { --highlight: #99ecdb; background: radial-gradient(circle at 95% 14%, #1dbfa7, transparent 55%), linear-gradient(145deg, #195a68, #122a43); }
@media (min-width: 760px) {
  .product-card { grid-template-columns: minmax(0, 1fr) minmax(0, .92fr); min-height: 565px; }
  .product-image-wrap { min-height: 565px; }
  .product-image { max-height: none; }
  .product-copy { padding: clamp(2rem, 3.2vw, 3.5rem); }
  .scene-ember.product-feature .product-image-wrap { order: 2; }
  .scene-ember.product-feature .product-copy { order: 1; }
  .scene-mint.product-feature { grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); }
}
</style>
