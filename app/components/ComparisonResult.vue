<script setup lang="ts">
import type { RevealItem } from '../../shared/types/experiment'

defineProps<{ item: RevealItem }>()
const euro = (value: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
</script>

<template>
  <article class="panel overflow-hidden p-5 md:p-7">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="eyebrow">Your comparison</p>
        <h3 class="mt-1 text-2xl font-semibold tracking-[-.04em]">{{ item.categoryName }}</h3>
      </div>
      <span class="pill">One product, two presentations</span>
    </div>
    <div class="grid grid-cols-2 gap-3 md:gap-5">
      <div v-for="(version, index) in [item.ordinary, item.premium]" :key="version.name" class="border border-[#e6e3de] bg-[#faf9f7]">
        <img :src="version.image" :alt="`${item.categoryName}, presentation ${index + 1}`" class="aspect-[4/3] w-full object-cover object-center">
        <div class="p-3 md:p-5">
          <p class="text-[.62rem] font-bold tracking-[.1em] uppercase muted">Presentation {{ index + 1 }}</p>
          <p class="mt-1 text-sm leading-snug md:text-base">{{ version.name }}</p>
          <p class="mt-3 text-2xl font-semibold tracking-[-.05em] md:text-3xl">{{ euro(version.price) }}</p>
        </div>
      </div>
    </div>
    <div class="mt-5 flex items-center justify-between border-t hairline pt-4 text-sm">
      <span class="muted">Difference between your estimates</span>
      <strong class="text-lg">{{ item.difference > 0 ? '+' : '' }}{{ euro(item.difference) }}</strong>
    </div>
  </article>
</template>
