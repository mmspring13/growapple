import {ApolloServer} from "@apollo/server";
import {startServerAndCreateH3Handler} from "@as-integrations/h3";
import { log } from "./utils";
import { schema } from "./schema";
import { resolvers } from "./resolvers";

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers,
  playground: true,
  logger: log,
  // formatError: (err) => {
  //   if (e)
  //   console.log('err', err)
  // },
});
export const apolloServerEventHandler = startServerAndCreateH3Handler(apollo, {
  context: async (event) => {
    return {
      appContext: true
    };
  },
});