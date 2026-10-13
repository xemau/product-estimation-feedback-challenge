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
    errorMessage.value = 'We could not start your experiment. Please try again.'
  } finally {
    starting.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main class="content-wrap">
      <section class="grid min-h-[calc(100dvh-4.5rem)] items-center gap-12 py-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
        <div>
          <p class="eyebrow mb-7">A short experiment in perception</p>
          <h1 class="serif headline max-w-[850px]">The Price<br><em>of Nothing.</em></h1>
          <p class="serif mt-8 max-w-lg text-2xl leading-tight md:text-3xl">How much is something really worth?</p>
          <p class="mt-5 max-w-lg text-base leading-relaxed muted">Estimate the value of everyday products and discover what influences your judgment. Follow your first impression; there are no right answers.</p>
          <div class="mt-10 flex flex-wrap items-center gap-5">
            <button class="button-primary min-w-56" :disabled="starting" @click="start">{{ starting ? 'Starting…' : 'Start experiment' }} <span aria-hidden="true">↗</span></button>
            <span class="text-sm muted">About 1–2 minutes</span>
          </div>
          <p v-if="errorMessage" class="field-error mt-4" role="alert">{{ errorMessage }}</p>
          <p class="mt-10 text-xs leading-relaxed muted">No login. No personal information. Your estimates are anonymous.</p>
        </div>
        <div class="relative hidden min-h-[560px] lg:block" aria-hidden="true">
          <div class="absolute inset-[3%_15%_6%_4%] bg-[#e7ddcd]" />
          <div class="absolute inset-[11%_3%_13%_16%] border border-[#ac926a]" />
          <div class="absolute inset-[19%_12%_20%_23%] flex flex-col justify-between bg-[#292722] p-11 text-[#f7f3eb] shadow-2xl">
            <span class="text-[.7rem] font-bold tracking-[.3em] uppercase text-[#cba76f]">Value / 001</span>
            <span class="serif text-[7.7rem] leading-none">€?</span>
            <span class="serif text-3xl italic">What do you see?</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
