<script setup lang="ts">
import type { SessionState } from '../../shared/types/experiment'

const { data: session, error: loadError, refresh } = await useFetch<SessionState>('/api/session')
const price = ref('')
const submitting = ref(false)
const errorMessage = ref('')

async function submitPrice() {
  if (submitting.value || session.value?.phase !== 'pricing') return
  const euros = Number(price.value)
  if (!/^(0|[1-9][0-9]*)$/.test(price.value) || !Number.isInteger(euros) || euros > 2000) {
    errorMessage.value = 'Enter a whole-euro amount from €0 to €2,000.'
    return
  }
  submitting.value = true
  errorMessage.value = ''
  try {
    const next = await $fetch<SessionState>('/api/estimates', {
      method: 'POST',
      body: { stepIndex: session.value.stepIndex, euros }
    })
    price.value = ''
    if (next.phase === 'reveal') await navigateTo('/reveal')
    else session.value = next
  } catch {
    errorMessage.value = 'Your estimate could not be saved. Please try again.'
    await refresh()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main class="content-wrap py-8 md:py-12">
      <div v-if="loadError || !session?.presentation" class="mx-auto max-w-xl py-24 text-center">
        <h1 class="serif section-title">One moment.</h1>
        <p class="mt-4 muted">We could not load this product.</p>
        <button class="button-outline mt-7" @click="refresh()">Try again</button>
      </div>
      <template v-else>
        <div class="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="eyebrow mb-2">Trust your first impression</p>
            <h1 class="serif text-3xl tracking-[-.04em] md:text-5xl">What would you pay?</h1>
          </div>
          <div class="w-full max-w-70"><ProgressIndicator :step-index="session.stepIndex || 0" /></div>
        </div>
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ProductCard :key="session.stepIndex" :presentation="session.presentation" />
          <form class="panel p-6 md:p-8 lg:sticky lg:top-6" @submit.prevent="submitPrice">
            <p class="eyebrow mb-8">Your estimate</p>
            <PriceInput v-model="price" :disabled="submitting" :error="errorMessage" />
            <button class="button-primary mt-9 w-full" type="submit" :disabled="submitting">{{ submitting ? 'Saving…' : 'Submit estimate' }} <span aria-hidden="true">→</span></button>
            <p class="mt-5 text-center text-xs leading-relaxed muted">You’ll see each product one at a time.</p>
          </form>
        </div>
      </template>
    </main>
  </div>
</template>
