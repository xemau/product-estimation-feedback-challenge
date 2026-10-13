<script setup lang="ts">
import type { SessionState } from '../../shared/types/experiment'

const starting = ref(false)
const errorMessage = ref('')

async function start() {
  if (starting.value) return
  starting.value = true
  errorMessage.value = ''
  try {
    const session = await $fetch<SessionState>('/api/session', { method: 'POST' })
    await navigateTo(session.phase === 'pricing' ? '/experiment' : '/')
  } catch {
    errorMessage.value = 'The experiment could not start. Try again.'
  } finally {
    starting.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main class="content-wrap">
      <section class="grid min-h-[calc(100dvh-4rem)] items-center gap-10 py-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-15 lg:py-20">
        <div class="relative z-10 min-w-0">
          <p class="eyebrow mb-6">The value experiment / 001</p>
          <h1 class="headline max-w-[800px] uppercase">The Price<br><span class="serif italic font-normal">of Nothing.</span></h1>
          <div class="mt-8 h-px w-25 bg-[#bb603d]" />
          <p class="mt-8 max-w-lg text-2xl font-medium leading-snug md:text-3xl">How much is something really worth?</p>
          <p class="mt-4 max-w-lg text-base leading-relaxed muted md:text-lg">Explore everyday products, estimate what you would pay, then discover what shaped your choices.</p>
          <div class="mt-9 flex flex-wrap items-center gap-4">
            <button class="button-primary min-w-58" :disabled="starting" @click="start">{{ starting ? 'Starting…' : 'Start experiment' }} <span aria-hidden="true">→</span></button>
            <span class="text-xs font-semibold uppercase tracking-[.08em] muted">About 2 minutes</span>
          </div>
          <p v-if="errorMessage" class="field-error mt-4" role="alert">{{ errorMessage }}</p>
          <div class="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t hairline pt-5 text-[.68rem] font-bold tracking-[.11em] uppercase muted">
            <span>01 &nbsp; Explore</span><span>02 &nbsp; Estimate</span><span>03 &nbsp; Discover</span>
          </div>
        </div>
        <div class="hero-gallery grid h-[440px] min-w-0 grid-cols-[1.18fr_.82fr] grid-rows-2 gap-2 sm:h-[590px]" aria-hidden="true">
          <div class="relative row-span-2 overflow-hidden bg-[#e8e5df]"><img src="/products/shirt-4.jpg" alt="" class="h-full w-full object-cover object-center"></div>
          <div class="overflow-hidden bg-[#e8e5df]"><img src="/products/mug-4.jpg" alt="" class="h-full w-full object-cover"></div>
          <div class="overflow-hidden bg-[#e8e5df]"><img src="/products/tote-2.jpg" alt="" class="h-full w-full object-cover object-center"></div>
          <div class="absolute bottom-4 left-4 border border-white/70 bg-white/80 px-4 py-3 text-xs font-semibold tracking-[.09em] uppercase backdrop-blur-xl sm:bottom-6 sm:left-6">What would you pay? &nbsp; ↗</div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.hero-gallery { position: relative; }
.hero-gallery img { display: block; transition: transform .5s ease; }
.hero-gallery > div:hover img { transform: scale(1.025); }
</style>
