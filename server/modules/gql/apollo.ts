import {ApolloServer} from "@apollo/server";
// import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import {startServerAndCreateH3Handler} from "@as-integrations/h3";
import { log } from "./utils";
import { schema } from "./schema";
import { resolvers } from "./resolvers";
import {GraphQLError} from "graphql";
import {AppApolloDepthError, AppApolloErrorCodes} from './errors';

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // @ts-ignore
  playground: true,
  logger: log,
  // plugins: [ApolloServerPluginLandingPageDisabled()],
  formatError: (err) => {
    log.error({
      message: err.message,
      path: err.path,
    }, `🔴 something bad happened`);

    let message = err.message;
    let status = 500;
    let code = AppApolloErrorCodes.UFO;

    if (AppApolloDepthError.is(err)) {
      status = 400;
      code = err.code;
    } else {
      message = 'unknown error';
    }

    log.error({
      message: err,
      path: err.path,
    }, `🔴 something bad happened`);

    throw new GraphQLError(message, {
      extensions: {
        code,
        http: {
          status,
        },
      },
    });
  },
});

export const apolloServerEventHandler = startServerAndCreateH3Handler(apollo, {
  context: async (event) => {
    const {
      s3BucketName,
      fruitImagesLimit,
      fruitDepthLimit,
    } = useRuntimeConfig();
    const config = { s3BucketName, fruitImagesLimit, fruitDepthLimit };

    log.info({
      method: event.event.method,
      config,
    }, '🛰️ run apollo server handler')

    return { appContext: true, config };
  },
});