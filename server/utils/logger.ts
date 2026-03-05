import pino, {type LoggerOptions} from 'pino';
import type {H3Event} from "h3";

export type ModuleName = 'api' | 'app' | 'cache' | 'gql' | 'supabase';

export const useLogger = (
  moduleName: ModuleName,
  opts?: LoggerOptions,
) => {
  const logger = pino({
    level: 'info',
    name: moduleName,
    timestamp: pino.stdTimeFunctions.isoTime,
    ...opts,
  }, pino.transport({
    targets: [
      {
        target:  'pino-pretty',
        options: { colorize: true }
      },
      // ...logLevel.map((lvl) => {
      //   return {
      //     target: 'pino/file',
      //     level: lvl,
      //     options: { destination: `./logs/${moduleName}.${lvl}.log`, mkdir: true },
      //   };
      // })
    ]
  }))
  return logger.child({ module: moduleName });
};

export const useApiLogger = (
  event: H3Event,
  opts?: LoggerOptions,
) => {
  let msgPrefix = opts?.msgPrefix;
  if (!opts?.msgPrefix) {
    msgPrefix = `[api-logger:${event.context.requestId}] `;
  }

  return useLogger('api', {...opts, msgPrefix});
};
