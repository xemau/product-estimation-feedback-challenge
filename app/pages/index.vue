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
      <section class="grid min-h-[calc(100dvh-4.75rem)] items-center gap-10 py-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-12 lg:py-20">
        <div class="relative z-10">
          <span class="pill mb-7">✦ &nbsp; A quick experiment in value</span>
          <h1 class="headline max-w-[840px] uppercase">The Price<br><span class="gradient-text">of Nothing.</span></h1>
          <p class="mt-7 max-w-xl text-xl font-semibold leading-snug md:text-3xl">How much is something really worth?</p>
          <p class="mt-4 max-w-xl text-base leading-relaxed muted md:text-lg">Estimate six everyday product presentations. Go with your first instinct, then see how your choices compare.</p>
          <div class="mt-9 flex flex-wrap items-center gap-4">
            <button class="button-primary min-w-58" :disabled="starting" @click="start">{{ starting ? 'Starting…' : 'Start experiment' }} <span aria-hidden="true">↗</span></button>
            <span class="pill">About 2 minutes</span>
          </div>
          <p v-if="errorMessage" class="field-error mt-4" role="alert">{{ errorMessage }}</p>
          <div class="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t hairline pt-5 text-[.67rem] font-extrabold tracking-[.14em] uppercase muted">
            <span><b class="text-[#5750d9]">01</b> &nbsp; Look</span>
            <span><b class="text-[#5750d9]">02</b> &nbsp; Estimate</span>
            <span><b class="text-[#5750d9]">03</b> &nbsp; Discover</span>
          </div>
        </div>
        <div class="hero-stage relative mx-auto flex h-[390px] w-full max-w-[550px] items-center justify-center sm:h-[520px]" aria-hidden="true">
          <div class="hero-orb absolute h-[290px] w-[290px] rounded-full sm:h-[410px] sm:w-[410px]" />
          <div class="absolute left-[2%] top-[12%] h-24 w-24 rounded-[2rem] border border-white/70 bg-white/30 backdrop-blur-xl sm:h-32 sm:w-32" />
          <div class="absolute bottom-[8%] right-[1%] h-28 w-28 rounded-full border border-white/70 bg-white/35 backdrop-blur-xl sm:h-42 sm:w-42" />
          <div class="hero-glass relative z-10 flex h-[280px] w-[72%] max-w-[370px] flex-col justify-between rounded-[2rem] p-7 sm:h-[370px] sm:p-10">
            <span class="text-[.7rem] font-black tracking-[.24em] uppercase">Perception / 001</span>
            <span class="text-[6.5rem] font-black leading-none tracking-[-.11em] sm:text-[9rem]">€?</span>
            <span class="flex items-center justify-between border-t border-white/60 pt-4 text-xs font-bold tracking-[.12em] uppercase"><span>Your instinct</span><span>↗</span></span>
          </div>
          <div class="absolute right-[2%] top-[13%] z-20 rounded-2xl border border-white/75 bg-white/70 px-5 py-3 text-[.66rem] font-black tracking-[.13em] uppercase shadow-xl shadow-indigo-200/50 backdrop-blur-xl">What do you see?</div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.hero-orb { background: radial-gradient(circle at 25% 20%, #fff 0%, #c4c8ff 24%, #7064ed 52%, #f79bbd 78%, #ffc4a9 100%); filter: drop-shadow(0 40px 55px rgba(87, 75, 210, .25)); }
.hero-glass { border: 1px solid rgba(255, 255, 255, .75); background: linear-gradient(145deg, rgba(255, 255, 255, .54), rgba(255, 255, 255, .16)); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 30px 60px rgba(59, 54, 150, .2), inset 0 2px rgba(255, 255, 255, .55); color: #252561; transform: rotate(-8deg); }
</style>
