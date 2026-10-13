<script setup lang="ts">
import type { RevealItem } from '../../shared/types/experiment'

defineProps<{ item: RevealItem }>()
const euro = (value: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
</script>

<template>
  <article class="panel overflow-hidden">
    <div class="grid md:grid-cols-[240px_1fr]">
      <img :src="item.image" :alt="`The same ${item.categoryName.toLowerCase()} photograph used twice`" class="h-54 w-full object-cover md:h-full">
      <div class="p-6 md:p-8">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <h3 class="serif text-3xl">{{ item.categoryName }}</h3>
          <span class="pill">Same photograph</span>
        </div>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="border-t hairline pt-3">
            <p class="eyebrow">Everyday presentation</p>
            <p class="mt-2 text-sm muted">{{ item.ordinary.name }}</p>
            <p class="serif mt-2 text-3xl">{{ euro(item.ordinary.price) }}</p>
          </div>
          <div class="border-t hairline pt-3">
            <p class="eyebrow">Editorial presentation</p>
            <p class="mt-2 text-sm muted">{{ item.premium.name }}</p>
            <p class="serif mt-2 text-3xl">{{ euro(item.premium.price) }}</p>
          </div>
        </div>
        <p class="mt-6 border-t hairline pt-4 text-sm font-semibold">Your difference: {{ item.difference > 0 ? '+' : '' }}{{ euro(item.difference) }}</p>
      </div>
    </div>
  </article>
</template>
