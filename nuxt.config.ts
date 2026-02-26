export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  // colorMode: {
  //   preference: 'dark', // Options: 'system', 'light', 'dark'
  //   fallback: 'dark',   // If system preference is not found
  // },
  css: [
    '~/assets/css/main.scss',
    'bootstrap/dist/css/bootstrap.min.css',
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['highcharts', 'highcharts-vue']
  },
  plugins: [
    "~/plugins/highcharts",
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        'data-bs-theme': 'dark',
        // data-bs-theme="dark"
      },
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
  },
  runtimeConfig: {
    supabasePublishKey: process.env.SUPABASE_PUBLISH_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    supabaseUrl: process.env.SUAPABASE_URL,
    protectedRouteKey: process.env.PROTECTED_ROUTE_KEY,
    protectedRouteHeader: process.env.PROTECTED_ROUTE_HEADER,
  },
  ssr: false,
  image: {
    format: ['webp'],
    // domains: ['ohsniypzidwlyrpdlqma.storage.supabase.co'],
    providers: {
      baseProvider: {
        name: 'baseProvider',
        provider: '#server/modules/image-provider/base.ts',
        // options: {
        //   baseURL: 'https://ohsniypzidwlyrpdlqma.storage.supabase.co/storage/v1/object/public/fruit_images/'
        // }
      }
    },
    // supabase: {
    //   // baseURL: 'https://ohsniypzidwlyrpdlqma.storage.supabase.co/storage/v1/s3',
    //   baseURL: 'https://ohsniypzidwlyrpdlqma.storage.supabase.co/storage/v1/object/public_fruit_images/'
    // },
  }
})
