import {useSupabase} from "#server/modules/supabase";
import { useLogger } from '#server/utils/logger';
import {ApolloServer} from "@apollo/server";
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import {startServerAndCreateH3Handler} from "@as-integrations/h3";

const log = useLogger('gql');

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
    avatar: FruitAvatar
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
    fruits(type: String!, skip: Int, take: Int, slugs: [String!]): Fruits
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

const fetchFruitType = async (idOrSlug: string | number) => {
  const sp = useSupabase();
  let eqKey = typeof idOrSlug === 'string' ? 'slug' : 'id';
  const { data, error } = await sp.from('fruit_types')
    .select('*')
    .eq(eqKey, idOrSlug)
    .single();
  return data;
};

const root = {
  Query: {
    fruits: async (parent, args, ctx, info) => {
      const sp = useSupabase();

      // 1. Parse the 'info' object to see what the client requested
      const parsedInfo = parseResolveInfo(info);
      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        parsedInfo,
        info.returnType
      );

      // 2. Extract requested fields from the 'data' selection
      // We look at fields.data because your query likely looks like: { fruits { data { ... } } }
      let selectFields = '*';
      if (fields.data) {
        const requestedColumns = Object.keys(fields.data.fieldsByTypeName.Fruit);
        const dbColumns = requestedColumns.filter(col => ![
          'children'
        ].includes(col));

        selectFields = dbColumns.length > 0 ? dbColumns.join(',') : 'id';
      }
      console.log('fields', selectFields)

      const typeSlug = args.type || 'apple';
      const skip = args.skip || 0;
      const take = args.take || 8;
      const { count: totalCount } = await sp.from('v_fruits_merged')
        .select('id', {
          count: 'exact',
          head: true,
        }).eq('type', typeSlug);

      const query = sp.from('v_fruits_merged')
        .select(selectFields)
        .eq('type', typeSlug)
        .range(skip, skip + take);
      if (args.slugs) {
        query.in('slug', args.slugs);
      }
      const { data, error } = await query;

      const fdata = data?.map((f) => ({
        ...f,
        avatar: { url: '__none__' },
      }));

      return {
        totalCount,
        data: fdata || [],
        pageInfo: {
          skip,
          take,
          hasNextPage: totalCount ? skip + take < totalCount : false,
        }
      };
    },

    fruit: async (parent, args) => {
      const data = await fetchFruitBySlug(args.slug);
      const type = await fetchFruitType(data.type);
      const avatar = { url: "__none__" };
      return {
        ...data,
        avatar,
        type,
      };
    }
  },
  Fruit: {
    children: async (parent, ...args) => {
      const sp = useSupabase();
      const { data: ids } = await sp.from('fruits_children')
        .select('children').eq('id', parent.id).single();

      const { data, error } = await sp.from('v_fruits_merged')
        .select('*')
        .in('id', ids.children)
        .range(0, 10);

      return {
        data: data?.map((a) => ({
          ...a,
          avatar: { url: '__none__' },
        })),
        hasMore: true,
        totalCount: 10,
      };
    },

    parentage: async (parent) => {
      const sp = useSupabase();
      const { count: totalCount } = await sp.from('v_fruits_merged')
        .select('id', {
          count: 'exact',
          head: true,
        })
        .in('id', parent.parentage || []);
      const { data, error } = await sp.from('v_fruits_merged')
        .select('*')
        .in('id', parent.parentage || [])
        .range(0, 10);

      return {
        data: data?.map((a) => ({
          ...a,
          avatar: { url: '__none__' },
        })),
        totalCount,
        hasMore: false,
      };
    },
  }
};

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers: root,
  playground: true,
})
export default startServerAndCreateH3Handler(apollo)