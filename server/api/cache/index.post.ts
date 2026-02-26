import {readCache} from "#server/utils/cached";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const key = body?.key;
  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'cache key is required'
    })
  }
  return { success: true, cache: readCache(key) };
});
