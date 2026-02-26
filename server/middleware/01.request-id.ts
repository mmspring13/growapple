import {useLogger} from "#server/utils/logger";
import { randomUUID } from 'crypto';

export default defineEventHandler((event) => {
  const log = useLogger('api');
  const path = event.path;
  const method = event.method;
  log.info({ path, method }, 'start request');
  event.context.requestId = `${randomUUID()}::${method}::${path}`;
})