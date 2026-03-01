import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";

export default defineNuxtPlugin({
  name: 'apollo',
  setup (nuxtApp) {
    const client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({ uri: "http://localhost:3000/api/fruit/gql" }),
      cache: new InMemoryCache(),
    });

    if (import.meta.server) {
      nuxtApp.hook('app:rendered', () => {
        nuxtApp.payload.apolloState = client.extract();
      });
    } else if (import.meta.client) {
      const initialState = nuxtApp.payload.apolloState;

      if (initialState) {
        client.cache.restore(initialState);
      }
    }

    return {
      provide: {
        apollo: client,
      },
    }
  },
})
