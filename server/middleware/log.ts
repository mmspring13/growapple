import {useApiLogger} from "#server/utils/logger";
import { randomUUID } from 'crypto';

export default defineEventHandler((event) => {
  const requestId = randomUUID();
  event.context.requestId = requestId;
  const logger = useApiLogger(event);

  logger.info({ requestId, method: event.node.req.method, url: event.node.req.url }, 'Incoming request');

  event.node.res.on('finish', () => {
    logger.info({ requestId, statusCode: event.node.res.statusCode }, 'Request finished');
  });

  event.node.req.on('error', (err) => {
    logger.error({
      requestId,
      statusCode: event.node.res.statusCode,
      error: err,
      errorMessage: err.message,
    }, '‼️ Request finished with error');
  });
})