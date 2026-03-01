import {useLogger} from "#server/utils/logger";
import { randomUUID } from 'crypto';

export default defineEventHandler((event) => {
  const log = useLogger('app');
  const path = event.path;
  const method = event.method;
  const reqId = randomUUID();
  log.info({ path, method, requestId: reqId }, 'request started');
  event.context.requestId = `${reqId}::${method}::${path}`;
})