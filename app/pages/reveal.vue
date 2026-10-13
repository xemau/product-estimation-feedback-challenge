<script setup lang="ts">
import type { RevealItem, SessionState } from '../../shared/types/experiment'

const { data: comparisons, error: loadError, refresh } = await useFetch<RevealItem[]>('/api/reveal')
const continuing = ref(false)
const errorMessage = ref('')

async function continueToFeedback() {
  if (continuing.value) return
  continuing.value = true
  errorMessage.value = ''
  try {
    const session = await $fetch<SessionState>('/api/reveal/continue', { method: 'POST' })
    if (session.phase === 'feedback') await navigateTo('/feedback')
  } catch {
    errorMessage.value = 'Could not continue. Please try again.'
  } finally {
    continuing.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main class="content-wrap max-w-[960px] py-13 md:py-20">
      <div class="max-w-3xl">
        <span class="pill mb-8">The reveal</span>
        <h1 class="section-title">You were looking at the <span class="gradient-text">same products</span> all along.</h1>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed muted">Each pair showed the same physical product. The lead photo, name, description and page styling changed. The material and construction did not.</p>
      </div>
      <div v-if="loadError" class="mt-12 panel p-8">
        <p>Your comparison could not load.</p>
        <button class="button-outline mt-5" @click="refresh()">Try again</button>
      </div>
      <div v-else-if="comparisons" class="mt-12 space-y-5">
        <ComparisonResult v-for="item in comparisons" :key="item.category" :item="item" />
      </div>
      <div class="mt-12 border-t hairline pt-9">
        <p class="max-w-2xl text-2xl font-semibold leading-snug">The product stayed the same. Did its presentation change your sense of value?</p>
        <button class="button-primary mt-8" :disabled="continuing || !comparisons" @click="continueToFeedback">{{ continuing ? 'Continuing…' : 'Reflect on your choices' }} <span aria-hidden="true">→</span></button>
        <p v-if="errorMessage" class="field-error mt-3" role="alert">{{ errorMessage }}</p>
      </div>
    </main>
  </div>
</template>
