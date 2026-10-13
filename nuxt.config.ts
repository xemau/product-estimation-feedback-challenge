import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      title: 'The Price of Nothing',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#f7f3eb' },
        { name: 'description', content: 'A short experiment in the value of everyday things.' }
      ]
    }
  }
})
