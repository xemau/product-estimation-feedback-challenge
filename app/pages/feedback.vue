<script setup lang="ts">
import type { ReasonKey, SessionState } from '../../shared/types/experiment'

const options: { key: ReasonKey; label: string }[] = [
  { key: 'branding', label: 'Branding and exclusivity' },
  { key: 'photography', label: 'Photography and visual presentation' },
  { key: 'description', label: 'Product name and description' },
  { key: 'quality', label: 'Assumed quality or materials' },
  { key: 'other', label: 'Other' }
]
const reason = ref<ReasonKey | null>(null)
const explanation = ref('')
const submitting = ref(false)
const errorMessage = ref('')

async function submitFeedback() {
  if (submitting.value) return
  if (!reason.value) {
    errorMessage.value = 'Choose the reason that influenced you most.'
    return
  }
  if (Array.from(explanation.value).length > 200) {
    errorMessage.value = 'Keep your note under 200 characters.'
    return
  }
  submitting.value = true
  errorMessage.value = ''
  try {
    const session = await $fetch<SessionState>('/api/feedback', {
      method: 'POST',
      body: { reason: reason.value, explanation: explanation.value }
    })
    if (session.phase === 'completed') await navigateTo('/results')
  } catch {
    errorMessage.value = 'Your feedback could not be saved. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main class="content-wrap max-w-[840px] py-13 md:py-20">
      <p class="eyebrow mb-6">One final question</p>
      <h1 class="section-title max-w-3xl">What influenced your price estimates the most, <span class="gradient-text">and why?</span></h1>
      <p class="mt-5 max-w-2xl leading-relaxed muted">Pick the factor that mattered most in your decisions.</p>
      <form class="panel mt-10 p-5 md:p-9" @submit.prevent="submitFeedback">
        <fieldset>
          <legend class="mb-5 text-sm font-bold tracking-[.12em] uppercase">Select one reason</legend>
          <div class="grid gap-3">
            <label v-for="option in options" :key="option.key" class="flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors" :class="reason === option.key ? 'border-[#776cf1] bg-[#e8e6ff]/80 shadow-lg shadow-indigo-100/60' : 'border-white/90 bg-white/45 hover:bg-white/80'">
              <input v-model="reason" type="radio" name="reason" :value="option.key" class="h-5 w-5 accent-[#655bee]">
              <span class="font-medium">{{ option.label }}</span>
            </label>
          </div>
        </fieldset>
        <div class="mt-9">
          <label for="explanation" class="block text-sm font-bold tracking-[.12em] uppercase">Add a note <span class="font-normal normal-case tracking-normal muted">(optional, shown without a name in results)</span></label>
          <textarea id="explanation" v-model="explanation" rows="4" maxlength="200" placeholder="What shaped your first impression?" class="mt-3 w-full resize-y rounded-2xl border border-white/90 bg-white/65 p-4 leading-relaxed"></textarea>
          <p class="mt-2 text-right text-xs muted">{{ Array.from(explanation).length }}/200</p>
        </div>
        <p v-if="errorMessage" class="field-error mt-5" role="alert">{{ errorMessage }}</p>
        <button class="button-primary mt-8 w-full sm:w-auto" type="submit" :disabled="submitting">{{ submitting ? 'Submitting…' : 'Submit feedback & see results' }} <span aria-hidden="true">→</span></button>
      </form>
    </main>
  </div>
</template>
