import tailwindcss from "@tailwindcss/vite";


export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  css: [
    '~/assets/css/main.css',
    // 'bootstrap/dist/css/bootstrap.min.css',
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['highcharts', 'highcharts-vue']
  },
  plugins: [
    "~/plugins/highcharts",
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@graphql-typed-document-node/core'],
    },
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        'data-bs-theme': 'dark',
        // data-bs-theme="dark"
      },
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    supabasePublishKey: process.env.SUPABASE_PUBLISH_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    supabaseUrl: process.env.SUAPABASE_URL,
    protectedRouteKey: process.env.PROTECTED_ROUTE_KEY,
    protectedRouteHeader: process.env.PROTECTED_ROUTE_HEADER,
  },
  ssr: true,
  image: {
    format: ['webp'],
    providers: {
      baseProvider: {
        name: 'baseProvider',
        provider: '#server/modules/image-provider/base.ts',
      }
    },
  }
})
