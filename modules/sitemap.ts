import { defineNuxtModule } from '@nuxt/kit'
import {createClient} from "@supabase/supabase-js";

export default defineNuxtModule({
  meta: {
    name: 'fruit-sitemap',
    configKey: 'sitemap'
  },
  setup(options, nuxt) {
    nuxt.hook('nitro:config', async (nitroConfig) => {
      // 1. Define Static Routes
      const staticRoutes = [
        '/',
        '/about',
        '/apple',
        '/apple/tree'
      ]

      // 2. Fetch Dynamic Routes from Supabase
      // const supabase = useSupabase();
      const config = nitroConfig.runtimeConfig;
      if (!config || !config.supabaseUrl || !config.supabaseSecretKey) {
        throw new Error('No config supabaseUrl provided');
      }

      const supabase = createClient(
        config.supabaseUrl,
        config.supabaseSecretKey
      );

      const { data: fruits } = await supabase
        .from('v_fruits_merged')
        .select('slug')

      const dynamicRoutes = fruits?.map(f => `/fruit/${f.slug}`) || []

      // 3. Combine and Add to Nitro Prerenderer
      const allRoutes = [...staticRoutes, ...dynamicRoutes]

      config.prerender = config.prerender || {}
      config.prerender.routes = config.prerender.routes || []
      config.prerender.routes.push(...allRoutes)

      console.log(`Successfully added ${allRoutes.length} routes to sitemap/prerender.`)
    })
  }
})