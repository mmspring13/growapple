import tailwindcss from "@tailwindcss/vite";


export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  css: [
    '~/assets/css/main.css',
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
      },
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    supabasePublishKey: process.env.SUPABASE_PUBLISH_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    s3BucketName: process.env.S3_BUCKET_NAME,
    supabaseUrl: process.env.SUAPABASE_URL,
    fruitDepthLimit: Number(
      process.env["FRUIT_DEPTH_LIMIT"] || '8',
    ),
    concurrentImageDownloadLimit: Number(
      process.env["CONCURRENT_IMAGE_DOWNLOAD_LIMIT"] || '6',
    ),
    public: {
      listFruitsLimit: Number(
        process.env["PUBLIC_LIST_FRUITS_LIMIT"] || '10',
      ),
    },
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
