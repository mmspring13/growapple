import {apolloServerEventHandler} from "#server/modules/gql/apollo";

export default defineEventHandler(async (event) => {
  const allowedOrigins = ['https://studio.apollographql.com', 'http://localhost:3000'];
  const origin = getRequestHeader(event, 'origin');

  if (origin && allowedOrigins.includes(origin)) {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-apollo-operation-name, apollo-require-preflight',
      'Access-Control-Allow-Credentials': 'true',
    });
  }

  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.statusMessage = 'No Content';
    return '';
  }

  return apolloServerEventHandler(event);
});
