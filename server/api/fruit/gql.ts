import {useSupabase} from "#server/modules/supabase";
import {ApolloServer} from "@apollo/server";
import {startServerAndCreateH3Handler} from "@as-integrations/h3";

const schema = `#graphql
  type SubFruits {
    totalCount: Int!
    hasMore: Boolean!
    data: [Fruit!]!
  }
  
  type FruitAvatar {
    url: String!
  }

  type Fruit {
    id: ID!
    slug: String!
    type: FruitType!
    avatar: FruitAvatar!
    name: String
    description: String
    short_description: String
    opening_year: Int
    images: [String]
    parentage: SubFruits
    children: SubFruits
  }

  type FruitType {
    id: ID!
    slug: String!
    name: String
  }

  type Pagination {
    skip: Int!
    take: Int!
    hasNextPage: Boolean!
  }
  
  type Fruits {
    totalCount: Int
    data: [Fruit!]!
    pageInfo: Pagination!
  }

  type Query {
    fruit(slug: String!): Fruit
    fruits(type: String!, skip: Int, take: String): Fruits
  }
`;

const fetchFruitBySlug = async (idOrSlug: string | number) => {
  const sp = useSupabase();
  let eqKey = typeof idOrSlug === 'string' ? 'slug' : 'id';
  const { data, error } = await sp.from('v_fruits_merged')
    .select('*')
    .eq(eqKey, idOrSlug)
    .single();
  return data;
};

const fetchFruitChildren = async (id: number) => {
  const sp = useSupabase();
  const { data, error } = await sp.from('v_fruits_merged')
    .select('*')
    .contains('parentage', [id]);
  return data;
};

const fetchFruitType = async (id: number) => {
  const sp = useSupabase();
  const { data, error } = await sp.from('fruit_types')
    .select('*')
    .eq('id', id)
    .single();
  return data;
};

const root = {
  Query: {
    fruits: async (parent, args) => {
      const sp = useSupabase();
      const typeSlug = args.type || 'apple';
      const skip = args.skip || 0;
      const take = args.take || 36;
      const { count: totalCount } = await sp.from('v_fruits_merged')
        .select('*', {
          count: 'exact',
          head: true,
        }).eq('type', typeSlug);
      const { data, error } = await sp.from('v_fruits_merged')
        .select('*')
        .eq('type', typeSlug)
        .range(skip, take);

      return {
        totalCount,
        data: data || [],
        pageInfo: {
          skip,
          take,
          hasNextPage: totalCount ? skip + take < totalCount : false,
        }
      };
    },

    fruit: async (parent, args) => {
      const data = await fetchFruitBySlug(args.slug);
      const parentage = {
        data: [],
        hasMore: false,
        totalCount: 2,
      };
      const children = {
        data: [],
        hasMore: true,
        totalCount: 10,
      };
      // const parentage = await Promise.all(data.parentage.map(fetchFruitBySlug));
      // const children = await fetchFruitChildren(data.id);
      const type = await fetchFruitType(data.type);
      const avatar = { url: "__none__" };
      return {
        ...data,
        parentage,
        children,
        avatar,
        type,
      };
    }
  }
};

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers: root,
  playground: true,
})
export default startServerAndCreateH3Handler(apollo)