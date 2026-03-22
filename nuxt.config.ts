import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ['@nuxt/image', '~~/modules/sitemap', 'nuxt-svgo'],
  css: [
    '~/assets/css/main.css',
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      exclude: ['@graphql-typed-document-node/core'],
    },
    plugins: [
      // @ts-ignore
      tailwindcss(),
    ],
  },
  app: {
    head: {
      // %s is the placeholder for the page title
      titleTemplate: '%s - The Apple Genealogy Project',
      title: 'The Apple Genealogy Project - Explore Fruit Heritage', // Default if page has no title
      meta: [
        {
          name: 'description',
          content: 'Discover the fascinating world of fruit genealogy. Explore genetic relationships, historical origins, and complex lineages of apple varieties and other fruits through interactive visualizations and comprehensive databases.'
        },
        {
          name: 'keywords',
          content: 'apple genealogy, fruit heritage, pomology, apple varieties, fruit database, genetic relationships, fruit history'
        },
        {
          property: 'og:title',
          content: 'The Apple Genealogy Project | Explore Fruit Heritage'
        },
        {
          property: 'og:description',
          content: 'Discover the fascinating world of fruit genealogy. Explore genetic relationships, historical origins, and complex lineages of apple varieties and other fruits.'
        },
        {
          property: 'og:type',
          content: 'website'
        }
      ],
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'apple-touch-icon', href: '/images/icon-180.png' },
        { rel: 'icon', href: '/images/icon-32.png', sizes: '32x32' },
        { rel: 'icon', href: '/images/icon-192.png', sizes: '192x192' },
      ],
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  runtimeConfig: {
    supabasePublishKey: process.env.SUPABASE_PUBLISH_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    s3BucketName: process.env.S3_BUCKET_NAME,
    supabaseUrl: process.env.SUAPABASE_URL,
    fruitImagesLimit: Number(
      process.env["FRUIT_IMAGES_LIMIT"] || '8',
    ),
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
      siteName: process.env["PUBLIC_SITE_NAME"] || 'UFO',
      isDev: process.env['NODE_ENV'] === 'development',
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
