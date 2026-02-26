import {useSupabase} from "#server/modules/supabase";

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path');
  const config = useRuntimeConfig()

  const supabase = useSupabase()

  console.log('path', path)
  const { data, error } = await supabase.storage.from('fruit_images').download(path)

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Image not found' })
  }

  // 3. Set correct headers for image streaming
  setResponseHeader(event, 'Content-Type', data.type)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')

  console.log('data', data)

  return data.stream()
})