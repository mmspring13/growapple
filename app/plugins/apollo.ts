import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";

export default defineNuxtPlugin({
  name: 'apollo',
  setup (nuxtApp) {
    const { origin } = useRequestURL();

    const client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({ uri: origin + "/api/fruit/gql" }),
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
