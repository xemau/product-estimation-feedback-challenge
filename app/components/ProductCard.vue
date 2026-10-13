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
      <ul class="product-specifications" aria-label="Product details">
        <li v-for="specification in presentation.specifications" :key="specification">{{ specification }}</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.product-card { display: grid; grid-template-columns: 1fr; min-height: 510px; border: 1px solid rgba(255,255,255,.9); border-radius: 1.7rem; box-shadow: 0 24px 60px rgba(34, 39, 103, .12); }
.product-image-wrap { min-height: 315px; overflow: hidden; }
.product-image { display: block; width: 100%; height: 100%; max-height: 470px; object-fit: cover; }
.product-copy { display: flex; flex-direction: column; justify-content: space-between; gap: 2rem; padding: 1.8rem; }
.product-kicker { margin-bottom: 1.6rem; color: #5c61a4; font-size: .67rem; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; }
.product-title { max-width: 14ch; font-size: clamp(2rem, 3vw, 3.2rem); font-weight: 760; line-height: 1.06; letter-spacing: -.055em; overflow-wrap: anywhere; }
.product-description { max-width: 30rem; margin-top: 1.3rem; color: #535a77; line-height: 1.6; }
.product-specifications { display: flex; flex-wrap: wrap; gap: .55rem; padding: 1rem 0 0; border-top: 1px solid rgba(82,86,144,.18); list-style: none; }
.product-specifications li { border: 1px solid rgba(115,119,176,.22); border-radius: 999px; background: rgba(255,255,255,.53); padding: .5rem .7rem; color: #4e5378; font-size: .68rem; font-weight: 700; }
.product-catalog { background: rgba(255,255,255,.82); color: #25294b; }
.product-catalog .product-image-wrap { background: #f0f1f6; }
.product-feature { color: #25294b; }
.product-feature .product-kicker { color: #625ad5; }
.product-feature .product-title { font-size: clamp(2.1rem, 3.1vw, 3.45rem); font-weight: 500; }
.scene-iris.product-feature { background: radial-gradient(circle at 94% 5%, #cfc7fa 0%, transparent 48%), linear-gradient(145deg, #f7f6ff, #e5e8fa); }
.scene-ember.product-feature { background: radial-gradient(circle at 10% 0%, #f8d4c1 0%, transparent 50%), linear-gradient(145deg, #fffaf6, #f7e6e0); }
.scene-mint.product-feature { background: radial-gradient(circle at 98% 5%, #c3eadf 0%, transparent 50%), linear-gradient(145deg, #f5fcfa, #dff3ee); }
.scene-ember.product-catalog { background: #fffcf9; }
.scene-mint.product-catalog { background: #fafffd; }
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
