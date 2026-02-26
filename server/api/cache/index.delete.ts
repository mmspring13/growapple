export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const key = body?.key;
  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'cache key is required'
    })
  }
  if (deleteCache(key)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'cache does not deleted'
    });
  }

  return { success: true, key };
});
