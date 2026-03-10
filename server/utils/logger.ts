import pino, {type LoggerOptions} from 'pino';
import type {H3Event} from "h3";

export type ModuleName = 'app' | 'gql' | 'supabase';

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
