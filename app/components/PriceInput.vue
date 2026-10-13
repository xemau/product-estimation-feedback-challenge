<script setup lang="ts">
defineProps<{ modelValue: string; disabled?: boolean; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  const clean = input.value.replace(/[^0-9]/g, '').slice(0, 4)
  input.value = clean
  emit('update:modelValue', clean)
}
</script>

<template>
  <div>
    <label for="price" class="block text-base font-semibold leading-snug">How much would you be willing to pay for this product?</label>
    <div class="form-field mt-4 flex h-18 items-center px-5">
      <span class="text-3xl font-light" aria-hidden="true">€</span>
      <input id="price" :value="modelValue" :disabled="disabled" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" enterkeyhint="done" placeholder="0" aria-label="Price in whole euros" :aria-invalid="Boolean(error)" :aria-describedby="error ? 'price-error' : undefined" class="min-w-0 flex-1 bg-transparent px-3 text-3xl font-semibold outline-none placeholder:text-[#96938d]" @input="onInput">
      <span class="text-[.65rem] font-bold tracking-[.17em] uppercase muted">EUR</span>
    </div>
    <p v-if="error" id="price-error" class="field-error mt-2" role="alert">{{ error }}</p>
  </div>
</template>
