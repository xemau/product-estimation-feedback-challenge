<script setup lang="ts">
import type { CommunityResults, SessionState } from '../../shared/types/experiment'

const { data: results, error: loadError, refresh } = await useFetch<CommunityResults>('/api/results')
const restarting = ref(false)
const errorMessage = ref('')
let refreshTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => { refreshTimer = setInterval(() => { void refresh() }, 10_000) })
onUnmounted(() => { if (refreshTimer) clearInterval(refreshTimer) })

const euro = (value: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value)
const signedEuro = (value: number) => `${value > 0 ? '+' : ''}${euro(value)}`
const signedPercent = (value: number | null) => value === null ? 'n/a' : `${value > 0 ? '+' : ''}${value}%`
const barWidth = (value: number, max: number) => `${max === 0 ? 0 : Math.max(value > 0 ? 4 : 0, value / max * 100)}%`
const dateLabel = (value: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

async function newExperiment() {
  if (restarting.value) return
  restarting.value = true
  errorMessage.value = ''
  try {
    const session = await $fetch<SessionState>('/api/session', { method: 'POST', body: { restart: true } })
    if (session.phase === 'pricing') await navigateTo('/experiment')
  } catch {
    errorMessage.value = 'Could not start a new experiment. Please try again.'
  } finally {
    restarting.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main class="content-wrap py-13 md:py-19">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="eyebrow mb-5">The collective picture</p>
          <h1 class="section-title">What changed the <span class="gradient-text">price?</span></h1>
          <p class="mt-5 max-w-2xl leading-relaxed muted">The photographs stayed the same. These figures show how participants priced each presentation.</p>
        </div>
        <span class="pill">Refreshes every 10 seconds</span>
      </div>

      <div v-if="loadError" class="panel mt-10 p-8">
        <p>Community results could not load.</p>
        <button class="button-outline mt-5" @click="refresh()">Try again</button>
      </div>
      <template v-else-if="results">
        <div class="mt-10 grid gap-4 sm:grid-cols-2">
          <div class="panel p-7"><p class="eyebrow">Participants started</p><p class="serif mt-3 text-5xl">{{ results.participantCount }}</p></div>
          <div class="panel p-7"><p class="eyebrow">Completed experiments</p><p class="serif mt-3 text-5xl">{{ results.completedCount }}</p></div>
        </div>

        <div v-if="results.completedCount === 0" class="panel mt-6 p-8 text-center">
          <h2 class="serif text-3xl">No completed responses yet.</h2>
          <p class="mt-3 muted">The comparison will appear when the first participant finishes.</p>
        </div>
        <template v-else>
          <section class="mt-16">
            <p class="eyebrow mb-3">The setup</p>
            <h2 class="text-3xl font-bold tracking-[-.05em] md:text-4xl">One photograph. Two presentations.</h2>
            <p class="mt-3 max-w-2xl text-sm leading-relaxed muted">Each ordinary and editorial version used the exact same product image. The bars below are real averages from completed experiments.</p>
            <div class="mt-7 grid gap-5 lg:grid-cols-3">
              <article v-for="category in results.categories" :key="category.category" class="panel p-6">
                <h3 class="serif text-2xl">{{ category.categoryName }}</h3>
                <div class="mt-7 space-y-5">
                  <div v-for="bar in [{ label: 'Everyday', value: category.ordinaryAverage, color: 'bg-[#91a0c3]' }, { label: 'Editorial', value: category.premiumAverage, color: 'bg-[#655bee]' }]" :key="bar.label">
                    <div class="mb-2 flex justify-between gap-3 text-sm"><span>{{ bar.label }}</span><strong>{{ euro(bar.value) }}</strong></div>
                    <div class="h-3 rounded-full bg-[#e0e4f6]"><div class="h-full rounded-full transition-[width] duration-500" :class="bar.color" :style="{ width: barWidth(bar.value, Math.max(category.ordinaryAverage, category.premiumAverage)) }" /></div>
                  </div>
                </div>
                <div class="mt-7 border-t hairline pt-4 text-sm"><span class="muted">Difference</span><strong class="float-right">{{ signedEuro(category.difference) }} <span class="font-normal muted">({{ signedPercent(category.percentageDifference) }})</span></strong></div>
              </article>
            </div>
          </section>

          <section class="mt-16 grid gap-9 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p class="eyebrow mb-3">The numbers</p>
              <h2 class="text-3xl font-bold tracking-[-.05em] md:text-4xl">Your view and the group.</h2>
              <p class="mt-4 text-sm leading-relaxed muted">Your estimates are shown beside the averages from all completed experiments, including yours.</p>
            </div>
            <div class="panel overflow-x-auto">
              <table class="w-full min-w-[530px] text-left text-sm">
                <thead class="bg-[#e3e5ff] text-[.66rem] tracking-[.13em] uppercase"><tr><th class="p-4">Product</th><th class="p-4">Your everyday</th><th class="p-4">Group everyday</th><th class="p-4">Your editorial</th><th class="p-4">Group editorial</th></tr></thead>
                <tbody><tr v-for="category in results.categories" :key="category.category" class="border-t hairline"><th class="p-4 font-semibold">{{ category.categoryName }}</th><td class="p-4">{{ euro(category.myOrdinary) }}</td><td class="p-4 muted">{{ euro(category.ordinaryAverage) }}</td><td class="p-4">{{ euro(category.myPremium) }}</td><td class="p-4 muted">{{ euro(category.premiumAverage) }}</td></tr></tbody>
              </table>
            </div>
          </section>

          <section class="mt-16 grid gap-6 lg:grid-cols-2">
            <div class="panel p-7 md:p-9">
              <p class="eyebrow mb-3">The reasons</p>
              <h2 class="text-3xl font-bold tracking-[-.05em]">What drove the choice</h2>
              <div class="mt-8 space-y-5">
                <div v-for="reason in results.reasons" :key="reason.key">
                  <div class="mb-2 flex justify-between gap-3 text-sm"><span>{{ reason.label }}</span><strong>{{ reason.count }}</strong></div>
                  <div class="h-2 rounded-full bg-[#e0e4f6]"><div class="h-full rounded-full bg-[#655bee]" :style="{ width: barWidth(reason.count, results.completedCount) }" /></div>
                </div>
              </div>
            </div>
            <div class="panel p-7 md:p-9">
              <p class="eyebrow mb-3">The notes</p>
              <h2 class="text-3xl font-bold tracking-[-.05em]">In their own words</h2>
              <p class="mt-3 text-sm muted">Recent written explanations from other participants.</p>
              <div v-if="results.explanations.length" class="mt-6 max-h-[430px] space-y-3 overflow-y-auto pr-1">
                <article v-for="explanation in results.explanations" :key="explanation.id" class="rounded-2xl border border-white/90 bg-white/55 p-5">
                  <p class="leading-relaxed whitespace-pre-wrap break-words">{{ explanation.text }}</p>
                  <p class="mt-4 text-xs muted">{{ dateLabel(explanation.createdAt) }}</p>
                </article>
              </div>
              <p v-else class="mt-7 text-sm muted">No other written explanations yet. Check back as more people finish.</p>
            </div>
          </section>
        </template>

        <div class="mt-16 border-t hairline pt-9">
          <button class="button-outline" :disabled="restarting" @click="newExperiment">{{ restarting ? 'Starting…' : 'New experiment' }} <span aria-hidden="true">↗</span></button>
          <p v-if="errorMessage" class="field-error mt-3" role="alert">{{ errorMessage }}</p>
        </div>
      </template>
    </main>
  </div>
</template>
