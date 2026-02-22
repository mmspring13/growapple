// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'dark', // Options: 'system', 'light', 'dark'
    fallback: 'dark',   // If system preference is not found
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['highcharts', 'highcharts-vue']
  },
  plugins: [
    "~/plugins/highcharts",
  ],
  runtimeConfig: {
    supabasePublishKey: process.env.SUPABASE_PUBLISH_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    supabaseUrl: process.env.SUAPABASE_URL,
  },
  ssr: false
})
