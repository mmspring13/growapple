import {useSupabase} from "#server/modules/supabase";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path');
  const supabase = useSupabase();

  const { data, error } = await supabase.storage.from(config.s3BucketName).download(path);

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Image not found' });
  }

  setResponseHeader(event, 'Content-Type', data.type);
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

  return data.stream()
})