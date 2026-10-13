<script setup lang="ts">
import type { RevealItem } from '../../shared/types/experiment'

defineProps<{ item: RevealItem }>()
const euro = (value: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
</script>

<template>
  <article class="panel overflow-hidden">
    <div class="grid md:grid-cols-[260px_1fr]">
      <div class="relative min-h-55 overflow-hidden bg-[#e9e9f3] md:min-h-full">
        <img :src="item.image" :alt="item.categoryName" class="absolute inset-0 h-full w-full object-cover">
        <span class="absolute bottom-4 left-4 rounded-full border border-white/80 bg-white/70 px-3 py-2 text-[.64rem] font-extrabold tracking-[.12em] uppercase text-[#5149c2] backdrop-blur-xl">One object / two looks</span>
      </div>
      <div class="p-6 md:p-8">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div><p class="eyebrow mb-2">Your comparison</p><h3 class="text-2xl font-bold tracking-[-.05em] md:text-3xl">{{ item.categoryName }}</h3></div>
          <span class="pill">Same photograph</span>
        </div>
        <div class="mt-7 grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl border border-white/90 bg-white/45 p-4">
            <p class="eyebrow">Everyday</p>
            <p class="mt-2 text-sm muted">{{ item.ordinary.name }}</p>
            <p class="mt-5 text-3xl font-bold tracking-[-.06em]">{{ euro(item.ordinary.price) }}</p>
          </div>
          <div class="rounded-2xl border border-[#bcb7ff]/70 bg-[#e8e6ff]/70 p-4">
            <p class="eyebrow">Editorial</p>
            <p class="mt-2 text-sm muted">{{ item.premium.name }}</p>
            <p class="mt-5 text-3xl font-bold tracking-[-.06em] text-[#5149d1]">{{ euro(item.premium.price) }}</p>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t hairline pt-4 text-sm"><span class="font-semibold muted">Difference</span><strong class="text-lg text-[#5149d1]">{{ item.difference > 0 ? '+' : '' }}{{ euro(item.difference) }}</strong></div>
      </div>
    </div>
  </article>
</template>
