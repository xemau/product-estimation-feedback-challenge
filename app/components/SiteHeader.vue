<template>
  <header class="site-header sticky top-0 z-30 border-b backdrop-blur-xl">
    <div class="content-wrap flex min-h-16 items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="brand-mark flex h-8 w-8 items-center justify-center border text-[.61rem] font-black tracking-[-.04em]">P/N</span>
        <span class="text-[.73rem] font-extrabold tracking-[.09em] uppercase">The Price of Nothing</span>
      </div>
      <span class="hidden text-[.68rem] font-semibold tracking-[.1em] uppercase muted sm:block">A two-minute experiment</span>
    </div>
  </header>
</template>

<style scoped>
.site-header { border-color: var(--border); background: var(--header-bg); }
.brand-mark { border-color: var(--text); }
</style>
