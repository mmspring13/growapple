import {useLogger} from "#server/utils/logger";

export default defineEventHandler((event) => {
  const log = useLogger('cache');
  const path = event.path;
  const key = `📋 ${path}`
  if (path.startsWith('/api/cache')) {
    log.info({
      key,
      path,
    }, 'auth cache');
    const config = useRuntimeConfig(event);
    if (getHeader(event, config.protectedRouteHeader) !== config.protectedRouteKey) {
      throw createError({
        statusCode: 401,
        statusMessage: `cache available only with key`,
      })
    }
  }
})