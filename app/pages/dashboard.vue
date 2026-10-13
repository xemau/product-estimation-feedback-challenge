<script setup lang="ts">
import type { DashboardResults } from '../../shared/types/experiment'

const { data: initialStatus } = await useFetch<{ authenticated: boolean }>('/api/dashboard/status')
const authenticated = ref(initialStatus.value?.authenticated ?? false)
const loginPassword = ref('')
const loginError = ref('')
const loggingIn = ref(false)
const results = ref<DashboardResults | null>(null)
const loading = ref(false)
const dataError = ref('')
const lastUpdated = ref<Date | null>(null)
const resetOpen = ref(false)
const resetPassword = ref('')
const resetError = ref('')
const resetting = ref(false)
let refreshTimer: ReturnType<typeof setInterval> | undefined

const euro = (value: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value)
const signedEuro = (value: number) => `${value > 0 ? '+' : ''}${euro(value)}`
const signedPercent = (value: number | null) => value === null ? 'n/a' : `${value > 0 ? '+' : ''}${value}%`
const barWidth = (value: number, max: number) => `${max === 0 ? 0 : Math.max(value > 0 ? 4 : 0, value / max * 100)}%`
const dateLabel = (value: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
const timeLabel = computed(() => lastUpdated.value ? new Intl.DateTimeFormat('en', { timeStyle: 'medium' }).format(lastUpdated.value) : '')

async function refreshResults() {
  if (!authenticated.value || loading.value) return
  loading.value = true
  try {
    results.value = await $fetch<DashboardResults>('/api/dashboard/results')
    lastUpdated.value = new Date()
    dataError.value = ''
  } catch {
    dataError.value = 'Could not refresh the dashboard. Trying again shortly.'
  } finally {
    loading.value = false
  }
}

async function login() {
  if (loggingIn.value) return
  loggingIn.value = true
  loginError.value = ''
  try {
    await $fetch('/api/dashboard/login', { method: 'POST', body: { password: loginPassword.value } })
    loginPassword.value = ''
    authenticated.value = true
    await refreshResults()
  } catch {
    loginError.value = 'Incorrect password. Try again.'
  } finally {
    loggingIn.value = false
  }
}

async function logout() {
  await $fetch('/api/dashboard/logout', { method: 'POST' })
  authenticated.value = false
  results.value = null
  lastUpdated.value = null
}

async function resetData() {
  if (resetting.value) return
  resetting.value = true
  resetError.value = ''
  try {
    await $fetch('/api/dashboard/reset', { method: 'POST', body: { password: resetPassword.value } })
    resetOpen.value = false
    resetPassword.value = ''
    await refreshResults()
  } catch {
    resetError.value = 'Password confirmation failed. No data was deleted.'
  } finally {
    resetting.value = false
  }
}

function refreshWhenVisible() {
  if (document.visibilityState === 'visible') void refreshResults()
}

onMounted(async () => {
  const status = await $fetch<{ authenticated: boolean }>('/api/dashboard/status')
  authenticated.value = status.authenticated
  if (authenticated.value) await refreshResults()
  refreshTimer = setInterval(() => { if (document.visibilityState === 'visible') void refreshResults() }, 5_000)
  document.addEventListener('visibilitychange', refreshWhenVisible)
})
onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
  document.removeEventListener('visibilitychange', refreshWhenVisible)
})
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main class="content-wrap py-10 md:py-16">
      <div v-if="!authenticated" class="mx-auto max-w-md">
        <p class="eyebrow mb-4">Organizer access</p>
        <h1 class="section-title">Dashboard</h1>
        <p class="mt-5 leading-relaxed muted">Enter the dashboard password to view workshop results.</p>
        <form class="panel mt-8 p-6 md:p-8" @submit.prevent="login">
          <label for="dashboard-password" class="block text-sm font-semibold">Password</label>
          <input id="dashboard-password" v-model="loginPassword" type="password" autocomplete="current-password" required class="mt-3 h-13 w-full border border-[#bbb5ad] bg-[#faf9f7] px-4">
          <p v-if="loginError" class="field-error mt-3" role="alert">{{ loginError }}</p>
          <button type="submit" class="button-primary mt-6 w-full" :disabled="loggingIn">{{ loggingIn ? 'Checking…' : 'Open dashboard' }}</button>
        </form>
      </div>
      <template v-else>
        <div class="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="eyebrow mb-4">Workshop overview</p>
            <h1 class="section-title">Live dashboard</h1>
            <p class="mt-4 muted">Updates every 5 seconds<span v-if="timeLabel"> · Last updated {{ timeLabel }}</span></p>
          </div>
          <div class="flex gap-2">
            <button class="button-outline" :disabled="loading" @click="refreshResults">{{ loading ? 'Refreshing…' : 'Refresh now' }}</button>
            <button class="button-outline" @click="logout">Sign out</button>
          </div>
        </div>
        <p v-if="dataError" class="field-error mt-6" role="alert">{{ dataError }}</p>
        <div v-if="!results" class="panel mt-8 p-8">Loading results…</div>
        <template v-else>
          <div class="mt-9 grid gap-4 sm:grid-cols-2">
            <div class="panel p-6"><p class="eyebrow">Participants started</p><p class="mt-3 text-5xl font-semibold tracking-[-.07em]">{{ results.participantCount }}</p></div>
            <div class="panel p-6"><p class="eyebrow">Completed experiments</p><p class="mt-3 text-5xl font-semibold tracking-[-.07em]">{{ results.completedCount }}</p></div>
          </div>
          <div v-if="results.completedCount === 0" class="panel mt-5 p-8"><h2 class="text-2xl font-semibold">No completed responses yet.</h2><p class="mt-2 muted">Estimates and notes will appear as participants finish.</p></div>
          <template v-else>
            <section class="mt-12">
              <p class="eyebrow mb-3">Collected estimates</p>
              <h2 class="text-3xl font-semibold tracking-[-.05em]">Average price by presentation</h2>
              <div class="mt-6 grid gap-4 lg:grid-cols-3">
                <article v-for="category in results.categories" :key="category.category" class="panel p-6">
                  <h3 class="text-xl font-semibold">{{ category.categoryName }}</h3>
                  <div class="mt-6 space-y-5">
                    <div v-for="bar in [{ label: 'Listing', value: category.ordinaryAverage, color: 'bg-[#aaa59d]' }, { label: 'Editorial', value: category.premiumAverage, color: 'bg-[#bc6843]' }]" :key="bar.label">
                      <div class="mb-2 flex justify-between gap-3 text-sm"><span>{{ bar.label }}</span><strong>{{ euro(bar.value) }}</strong></div>
                      <div class="h-3 bg-[#ebe8e2]"><div class="h-full transition-[width] duration-500" :class="bar.color" :style="{ width: barWidth(bar.value, Math.max(category.ordinaryAverage, category.premiumAverage)) }" /></div>
                    </div>
                  </div>
                  <div class="mt-6 flex justify-between border-t hairline pt-4 text-sm"><span class="muted">Difference</span><strong>{{ signedEuro(category.difference) }} ({{ signedPercent(category.percentageDifference) }})</strong></div>
                </article>
              </div>
            </section>
            <section class="mt-12 grid gap-5 lg:grid-cols-2">
              <div class="panel p-6 md:p-8">
                <p class="eyebrow mb-2">Selected reasons</p>
                <h2 class="text-2xl font-semibold tracking-[-.04em]">What influenced estimates</h2>
                <div class="mt-7 space-y-5">
                  <div v-for="reason in results.reasons" :key="reason.key">
                    <div class="mb-2 flex justify-between gap-3 text-sm"><span>{{ reason.label }}</span><strong>{{ reason.count }}</strong></div>
                    <div class="h-2 bg-[#ebe8e2]"><div class="h-full bg-[#bc6843]" :style="{ width: barWidth(reason.count, results.completedCount) }" /></div>
                  </div>
                </div>
              </div>
              <div class="panel p-6 md:p-8">
                <p class="eyebrow mb-2">Written responses</p>
                <h2 class="text-2xl font-semibold tracking-[-.04em]">What people said</h2>
                <div v-if="results.explanations.length" class="mt-6 max-h-[460px] space-y-3 overflow-y-auto pr-1">
                  <article v-for="explanation in results.explanations" :key="explanation.id" class="border border-[#e4e1db] bg-[#faf9f7] p-5">
                    <p class="whitespace-pre-wrap break-words leading-relaxed">{{ explanation.text }}</p>
                    <p class="mt-4 text-xs muted">{{ dateLabel(explanation.createdAt) }}</p>
                  </article>
                </div>
                <p v-else class="mt-6 text-sm muted">No written responses yet.</p>
              </div>
            </section>
          </template>
          <div class="mt-14 border-t hairline pt-7">
            <button class="text-sm font-semibold text-[#ad3b2d] underline underline-offset-4" @click="resetOpen = true">Reset all data</button>
          </div>
        </template>
      </template>
    </main>
    <div v-if="resetOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#14120f]/65 p-4" role="presentation" @click.self="resetOpen = false">
      <form class="w-full max-w-md bg-white p-6 shadow-2xl md:p-8" role="dialog" aria-modal="true" aria-labelledby="reset-title" @submit.prevent="resetData">
        <p class="eyebrow">Confirm reset</p>
        <h2 id="reset-title" class="mt-2 text-3xl font-semibold tracking-[-.04em]">Delete all workshop data?</h2>
        <p class="mt-4 leading-relaxed muted">This removes every estimate and written response. Participants will need to start again. Enter the dashboard password to confirm.</p>
        <label for="reset-password" class="mt-6 block text-sm font-semibold">Password</label>
        <input id="reset-password" v-model="resetPassword" type="password" autocomplete="current-password" required class="mt-2 h-13 w-full border border-[#bbb5ad] px-4">
        <p v-if="resetError" class="field-error mt-3" role="alert">{{ resetError }}</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="submit" class="button-primary bg-[#ad3b2d] border-[#ad3b2d]" :disabled="resetting">{{ resetting ? 'Deleting…' : 'Delete all data' }}</button>
          <button type="button" class="button-outline" @click="resetOpen = false; resetPassword = ''; resetError = ''">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>
