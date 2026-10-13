<script setup lang="ts">
defineProps<{ stepIndex: number }>()
</script>

<template>
  <div class="space-y-3" aria-label="Experiment progress">
    <div class="flex items-center justify-between text-[.7rem] font-bold tracking-[.14em] uppercase">
      <span>Product {{ Math.floor(stepIndex / 2) + 1 }} of 3</span>
      <span class="muted">View {{ stepIndex % 2 + 1 }} of 2</span>
    </div>
    <div class="grid grid-cols-6 gap-1.5" aria-hidden="true">
      <span v-for="index in 6" :key="index" class="h-1.5 rounded-full" :class="index <= stepIndex + 1 ? 'bg-[#655bee]' : 'bg-white/75'" />
    </div>
  </div>
</template>
