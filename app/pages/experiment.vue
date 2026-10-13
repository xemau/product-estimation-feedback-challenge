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
  <div class="page-shell" :class="{ 'page-shell--editorial': session?.presentation?.style === 'editorial' }">
    <SiteHeader />
    <main class="content-wrap py-6 md:py-10">
      <div v-if="loadError || !session?.presentation" class="mx-auto max-w-xl py-24 text-center">
        <h1 class="serif section-title">One moment.</h1>
        <p class="mt-4 muted">This product could not load.</p>
        <button class="button-outline mt-7" @click="refresh()">Try again</button>
      </div>
      <template v-else>
        <div class="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="eyebrow mb-2">Explore the product</p>
            <h1 class="text-3xl font-semibold tracking-[-.05em] md:text-5xl">What would you pay?</h1>
          </div>
          <div class="w-full max-w-70"><ProgressIndicator :step-index="session.stepIndex || 0" /></div>
        </div>
        <div>
          <ProductCard :key="session.stepIndex" :presentation="session.presentation" />
          <form class="panel mt-5 grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-7" @submit.prevent="submitPrice">
            <PriceInput v-model="price" :disabled="submitting" :error="errorMessage" />
            <button class="button-primary w-full md:min-w-57" type="submit" :disabled="submitting">{{ submitting ? 'Saving…' : 'Continue' }} <span aria-hidden="true">→</span></button>
          </form>
        </div>
      </template>
    </main>
  </div>
</template>
