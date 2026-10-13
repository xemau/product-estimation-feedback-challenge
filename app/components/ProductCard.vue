<script setup lang="ts">
import type { Presentation } from '../../shared/types/experiment'

defineProps<{ presentation: Presentation }>()
</script>

<template>
  <article v-if="presentation.style === 'catalog'" class="catalog-product">
    <ProductGallery :images="presentation.images" :name="presentation.name" variant="catalog" />
    <div class="catalog-copy">
      <p class="catalog-kicker">{{ presentation.kicker }}</p>
      <h2 class="catalog-title">{{ presentation.name }}</h2>
      <p class="catalog-description">{{ presentation.description }}</p>
      <div class="catalog-detail-heading">Product details</div>
      <ul class="catalog-specifications" aria-label="Product details">
        <li v-for="specification in presentation.specifications" :key="specification">{{ specification }}</li>
      </ul>
    </div>
  </article>
  <article v-else class="editorial-product">
    <div class="editorial-cover">
      <ProductGallery :images="presentation.images" :name="presentation.name" variant="editorial" />
      <div class="editorial-cover-copy">
        <p class="editorial-index">{{ presentation.kicker }}</p>
        <h2>{{ presentation.name }}</h2>
      </div>
    </div>
    <div class="editorial-story">
      <div class="editorial-rule"><span>Form &amp; function</span><span>Composition</span></div>
      <p class="editorial-description">{{ presentation.description }}</p>
      <div class="editorial-specifications">
        <p>Composition &amp; details</p>
        <ul aria-label="Product details"><li v-for="specification in presentation.specifications" :key="specification">{{ specification }}</li></ul>
      </div>
    </div>
  </article>
</template>

<style scoped>
.catalog-product { display: grid; border: 1px solid #dededb; background: #fff; color: #171717; }
.catalog-copy { padding: 1.6rem 1.4rem 2rem; }
.catalog-kicker { color: #68655e; font-size: .66rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.catalog-title { max-width: 20ch; margin-top: .7rem; font-size: clamp(1.75rem, 3vw, 2.75rem); line-height: 1.12; letter-spacing: -.047em; font-weight: 620; }
.catalog-description { max-width: 34rem; margin-top: 1rem; color: #53514d; font-size: .95rem; line-height: 1.65; }
.catalog-detail-heading { margin-top: 2.2rem; padding-top: 1.1rem; border-top: 1px solid #e5e3df; color: #383631; font-size: .7rem; font-weight: 750; letter-spacing: .11em; text-transform: uppercase; }
.catalog-specifications { display: grid; gap: .7rem; margin: 1rem 0 0; padding: 0; list-style: none; color: #5d5a55; font-size: .85rem; }
.catalog-specifications li::before { content: '•'; margin-right: .7rem; color: #a8a39a; }
.editorial-product { background: #121314; }
.editorial-cover { position: relative; overflow: hidden; background: #1c1e1f; }
.editorial-cover::after { content: ''; position: absolute; z-index: 1; inset: 52% 0 0; pointer-events: none; background: linear-gradient(transparent, #0c0d0ec4 88%); }
.editorial-cover-copy { position: absolute; z-index: 2; right: 1.5rem; bottom: 5.4rem; left: 1.5rem; pointer-events: none; }
.editorial-index { font-size: .66rem; font-weight: 700; letter-spacing: .23em; text-transform: uppercase; color: #fffdfa; text-shadow: 0 1px 9px #000; }
.editorial-cover-copy h2 { max-width: 18ch; margin-top: .9rem; color: #fffdfa; font-size: clamp(2.3rem, 6.1vw, 6rem); font-weight: 400; line-height: .96; letter-spacing: -.065em; text-transform: uppercase; text-wrap: balance; text-shadow: 0 2px 16px #0008; }
.editorial-story { display: grid; gap: 2.4rem; padding: 2rem 1.5rem 2.5rem; }
.editorial-rule { display: flex; justify-content: space-between; gap: 1rem; border-top: 1px solid #5c5b58; padding-top: .75rem; color: #b7b3ad; font-size: .63rem; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; }
.editorial-description { max-width: 38ch; font-family: "Iowan Old Style", Baskerville, Georgia, serif; font-size: clamp(1.55rem, 2.5vw, 2.5rem); line-height: 1.23; letter-spacing: -.025em; }
.editorial-specifications { display: grid; gap: .8rem; border-top: 1px solid #4b4c4b; padding-top: 1rem; }
.editorial-specifications p { color: #c4b69e; font-size: .66rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.editorial-specifications ul { display: flex; flex-wrap: wrap; gap: .5rem 1.2rem; margin: 0; padding: 0; list-style: none; color: #b5b3af; font-size: .82rem; }
.editorial-specifications li + li::before { content: '·'; margin-right: 1.2rem; }
@media (min-width: 960px) {
  .catalog-product { grid-template-columns: minmax(0, 1.12fr) minmax(0, .88fr); }
  .catalog-copy { display: flex; flex-direction: column; align-items: start; justify-content: center; padding: clamp(2rem, 4vw, 5rem); }
  .catalog-detail-heading { width: 100%; }
  .editorial-cover-copy { right: 3rem; bottom: 3.2rem; left: 3rem; }
  .editorial-story { grid-template-columns: minmax(0, .7fr) minmax(0, 1.3fr) minmax(0, .8fr); align-items: start; gap: 3rem; padding: 2.5rem 3rem 3rem; }
  .editorial-rule { display: grid; gap: .8rem; }
}
</style>
