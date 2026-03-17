import pino, {type LoggerOptions} from 'pino';

export type ModuleName = 'app' | 'gql' | 'supabase';

export const useLogger = (
  moduleName: ModuleName,
  opts?: LoggerOptions,
) => {
  const transport = () => {
    if (process.env.NODE_ENV === 'development') {
      return pino.transport({
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
      });
    }
  };

  const logger = pino({
    level: 'info',
    name: moduleName,
    timestamp: pino.stdTimeFunctions.isoTime,
    ...opts,
  }, transport());
  return logger.child({ module: moduleName });
};
