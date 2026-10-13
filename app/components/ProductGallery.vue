<script setup lang="ts">
const props = defineProps<{ images: string[]; name: string; variant: 'catalog' | 'editorial' }>()
const gallery = ref<HTMLElement | null>(null)
const currentImage = ref(0)

function showImage(index: number) {
  const next = Math.max(0, Math.min(index, props.images.length - 1))
  gallery.value?.scrollTo({ left: next * gallery.value.clientWidth, behavior: 'smooth' })
  currentImage.value = next
}

function syncImage() {
  if (gallery.value?.clientWidth) currentImage.value = Math.round(gallery.value.scrollLeft / gallery.value.clientWidth)
}
</script>

<template>
  <div class="gallery" :class="`gallery--${variant}`">
    <div ref="gallery" class="gallery-track" aria-label="Product photo gallery" @scroll.passive="syncImage">
      <div v-for="(photo, index) in images" :key="photo" class="gallery-slide">
        <img :src="photo" :alt="`${name}, view ${index + 1}`" :fetchpriority="index === 0 ? 'high' : undefined" :loading="index === 0 ? 'eager' : 'lazy'">
      </div>
    </div>
    <div class="gallery-controls" aria-label="Gallery controls">
      <button type="button" aria-label="Previous photo" :disabled="currentImage === 0" @click="showImage(currentImage - 1)">←</button>
      <span aria-live="polite">{{ String(currentImage + 1).padStart(2, '0') }} / {{ String(images.length).padStart(2, '0') }}</span>
      <button type="button" aria-label="Next photo" :disabled="currentImage === images.length - 1" @click="showImage(currentImage + 1)">→</button>
    </div>
    <div v-if="variant === 'catalog'" class="gallery-thumbnails" aria-label="Choose product photo">
      <button v-for="(photo, index) in images" :key="photo" type="button" :class="{ 'is-active': currentImage === index }" :aria-label="`Show photo ${index + 1}`" :aria-pressed="currentImage === index" @click="showImage(index)">
        <img :src="photo" alt="" loading="lazy">
      </button>
    </div>
    <div v-else class="gallery-pagination" aria-label="Choose product photo">
      <button v-for="(photo, index) in images" :key="photo" type="button" :class="{ 'is-active': currentImage === index }" :aria-label="`Show photo ${index + 1}`" :aria-pressed="currentImage === index" @click="showImage(index)" />
    </div>
  </div>
</template>

<style scoped>
.gallery { position: relative; min-width: 0; }
.gallery-track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-inline: contain; }
.gallery-track::-webkit-scrollbar { display: none; }
.gallery-slide { flex: 0 0 100%; aspect-ratio: 1 / 1; scroll-snap-align: start; overflow: hidden; background: #f1f0ed; }
.gallery-slide img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center 32%; }
.gallery--editorial .gallery-slide { aspect-ratio: 4 / 5; background: #292a2b; }
.gallery--editorial .gallery-slide img { object-position: center 30%; }
.gallery-controls { position: absolute; z-index: 3; right: 1rem; bottom: 1rem; display: flex; align-items: center; gap: .25rem; border: 1px solid #ffffff55; background: #111213e8; color: #f8f7f4; backdrop-filter: blur(16px); font-size: .68rem; font-weight: 700; letter-spacing: .08em; }
.gallery-controls button { width: 2.6rem; height: 2.6rem; border: 0; background: transparent; color: inherit; font-size: 1.1rem; }
.gallery-controls button:hover:not(:disabled) { background: #ffffff25; }
.gallery-controls button:disabled { opacity: .3; }
.gallery--catalog .gallery-controls { bottom: 5.1rem; border-color: #ffffffb5; background: #fffffff0; color: #171717; }
.gallery--catalog .gallery-controls button:hover:not(:disabled) { background: #e9e7e2; }
.gallery--editorial .gallery-controls { bottom: 1.8rem; right: 1.8rem; border-color: #f3f0eb; background: #f3f0eb; color: #111213; }
.gallery--editorial .gallery-controls button:hover:not(:disabled) { background: #d5ccbf; }
.gallery-thumbnails { display: flex; gap: .5rem; padding: .85rem; overflow-x: auto; background: #fff; }
.gallery-thumbnails button { flex: 0 0 3.35rem; width: 3.35rem; aspect-ratio: 1; padding: 0; overflow: hidden; border: 1px solid #ddd; background: #f4f4f2; opacity: .62; }
.gallery-thumbnails button.is-active { border-color: #161616; opacity: 1; }
.gallery-thumbnails img { width: 100%; height: 100%; object-fit: cover; }
.gallery-pagination { position: absolute; z-index: 3; left: 1.6rem; bottom: 2.9rem; display: flex; gap: .45rem; }
.gallery-pagination button { width: 1.8rem; height: .2rem; padding: 0; border: 0; background: #ffffff6b; }
.gallery-pagination button.is-active { background: #fff; }
@media (min-width: 960px) {
  .gallery--catalog .gallery-slide { aspect-ratio: 4 / 5; max-height: 650px; }
  .gallery--editorial .gallery-slide { aspect-ratio: auto; height: min(76vh, 780px); min-height: 600px; }
  .gallery--editorial .gallery-slide img { object-position: center 38%; }
}
</style>
