import {useSupabase} from "#server/modules/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const { data: fruits } = await supabase.from('v_fruits_merged').select('slug')

  const staticRoutes = ['', '/about', '/apple', '/apple/tree']
  const dynamicRoutes = fruits?.map(f => `/fruit/${f.slug}`) || []
  const allRoutes = [...staticRoutes, ...dynamicRoutes]

  const baseUrl = 'https://growapple.org'
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allRoutes.map(route => `
        <url>
          <loc>${baseUrl}${route}</loc>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
    </urlset>`

  event.node.res.setHeader('Content-Type', 'text/xml')
  return sitemap
})