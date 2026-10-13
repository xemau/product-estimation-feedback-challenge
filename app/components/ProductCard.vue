<script setup lang="ts">
import type { Presentation } from '../../shared/types/experiment'

const props = defineProps<{ presentation: Presentation }>()
const gallery = ref<HTMLElement | null>(null)
const currentImage = ref(0)

function showImage(index: number) {
  const next = Math.max(0, Math.min(index, props.presentation.images.length - 1))
  gallery.value?.scrollTo({ left: next * gallery.value.clientWidth, behavior: 'smooth' })
  currentImage.value = next
}

function syncImage() {
  if (gallery.value?.clientWidth) currentImage.value = Math.round(gallery.value.scrollLeft / gallery.value.clientWidth)
}
</script>

<template>
  <article class="product-card" :class="`product-card--${presentation.style}`">
    <div class="product-gallery">
      <div ref="gallery" class="gallery-track" aria-label="Product photo gallery" @scroll.passive="syncImage">
        <div v-for="(photo, index) in presentation.images" :key="photo" class="gallery-slide">
          <img :src="photo" :alt="`${presentation.name}, view ${index + 1}`" :fetchpriority="index === 0 ? 'high' : undefined" :loading="index === 0 ? 'eager' : 'lazy'">
        </div>
      </div>
      <div class="gallery-controls" aria-label="Gallery controls">
        <button type="button" aria-label="Previous photo" :disabled="currentImage === 0" @click="showImage(currentImage - 1)">←</button>
        <span aria-live="polite">{{ currentImage + 1 }} / {{ presentation.images.length }}</span>
        <button type="button" aria-label="Next photo" :disabled="currentImage === presentation.images.length - 1" @click="showImage(currentImage + 1)">→</button>
      </div>
      <div class="gallery-thumbnails" aria-label="Choose product photo">
        <button v-for="(photo, index) in presentation.images" :key="photo" type="button" :class="{ 'is-active': currentImage === index }" :aria-label="`Show photo ${index + 1}`" :aria-pressed="currentImage === index" @click="showImage(index)">
          <img :src="photo" alt="" loading="lazy">
        </button>
      </div>
    </div>
    <div class="product-copy">
      <p class="product-kicker">{{ presentation.kicker }}</p>
      <h2 class="product-title">{{ presentation.name }}</h2>
      <p class="product-description">{{ presentation.description }}</p>
      <div class="product-detail-heading">Product details</div>
      <ul class="product-specifications" aria-label="Product details">
        <li v-for="specification in presentation.specifications" :key="specification">{{ specification }}</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.product-card { display: grid; background: #fff; color: #171717; }
.product-card--catalog { border: 1px solid #dededb; }
.product-card--editorial { background: #fff; }
.product-gallery { position: relative; min-width: 0; background: #f1f0ed; }
.gallery-track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-inline: contain; }
.gallery-track::-webkit-scrollbar { display: none; }
.gallery-slide { flex: 0 0 100%; aspect-ratio: 1 / 1; scroll-snap-align: start; overflow: hidden; }
.gallery-slide img { width: 100%; height: 100%; display: block; object-fit: cover; }
.product-card--catalog .gallery-slide img { object-position: center 32%; }
.product-card--editorial .gallery-slide img { object-position: center 30%; }
.gallery-controls { position: absolute; right: 1rem; bottom: 1rem; display: flex; align-items: center; gap: .55rem; padding: .35rem; border: 1px solid #ffffffa8; border-radius: 999px; background: #fffc; backdrop-filter: blur(16px); font-size: .7rem; font-weight: 700; box-shadow: 0 5px 20px #00000012; }
.gallery-controls button { width: 2rem; height: 2rem; border: 0; border-radius: 50%; background: transparent; font-size: 1rem; }
.gallery-controls button:hover:not(:disabled) { background: #fff; }
.gallery-controls button:disabled { opacity: .3; }
.gallery-thumbnails { display: none; gap: .5rem; padding: .7rem; background: #fff; }
.gallery-thumbnails button { width: 3.1rem; aspect-ratio: 1; padding: 0; overflow: hidden; border: 1px solid #ddd; background: #f4f4f2; opacity: .68; }
.gallery-thumbnails button.is-active { border: 2px solid #161616; opacity: 1; }
.gallery-thumbnails img { width: 100%; height: 100%; object-fit: cover; }
.product-copy { padding: 1.55rem 1.4rem 2rem; }
.product-kicker { color: #68655e; font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.product-title { max-width: 17ch; margin-top: .8rem; font-size: clamp(1.8rem, 3vw, 3rem); line-height: 1.1; letter-spacing: -.045em; font-weight: 700; }
.product-description { max-width: 36rem; margin-top: 1rem; color: #53514d; font-size: .94rem; line-height: 1.6; }
.product-detail-heading { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e3df; color: #383631; font-size: .72rem; font-weight: 750; letter-spacing: .09em; text-transform: uppercase; }
.product-specifications { display: flex; flex-wrap: wrap; gap: .4rem .9rem; margin: .85rem 0 0; padding: 0; list-style: none; color: #5d5a55; font-size: .8rem; }
.product-specifications li + li::before { content: '·'; margin-right: .9rem; color: #a8a39a; }
.product-card--editorial .gallery-slide { aspect-ratio: 4 / 5; }
.product-card--editorial .product-copy { padding-top: 2.6rem; padding-bottom: 3rem; }
.product-card--editorial .product-kicker { color: #555; font-size: .62rem; letter-spacing: .16em; }
.product-card--editorial .product-title { max-width: 21ch; margin-top: 1.4rem; font-size: clamp(1.75rem, 2.8vw, 2.8rem); font-weight: 600; letter-spacing: -.02em; line-height: 1.16; text-transform: uppercase; }
.product-card--editorial .product-description { margin-top: 1.8rem; color: #373737; }
@media (min-width: 680px) { .gallery-thumbnails { display: flex; } }
@media (min-width: 960px) {
  .product-card { grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); align-items: stretch; }
  .product-copy { display: flex; flex-direction: column; align-items: start; justify-content: center; padding: clamp(2rem, 3vw, 4rem); }
  .product-detail-heading { width: 100%; }
  .gallery-slide { aspect-ratio: 4 / 5; max-height: 640px; }
  .product-card--editorial { grid-template-columns: minmax(0, 1.3fr) minmax(0, .7fr); }
  .product-card--editorial .gallery-slide { aspect-ratio: 2 / 3; max-height: 720px; }
  .product-card--editorial .product-copy { justify-content: end; padding-bottom: clamp(3rem, 6vw, 6rem); }
}
</style>
