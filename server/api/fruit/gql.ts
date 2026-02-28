import { ApolloServer } from '@apollo/server'
import { startServerAndCreateH3Handler } from '@as-integrations/h3'
import { buildSchema } from "graphql/utilities";
import type {GraphQLTypeResolver} from "graphql/type";
import type {IExecutableSchemaDefinition} from "@graphql-tools/schema";
import {useSupabase} from "#server/modules/supabase";

const books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Novel',
    books: [
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        year: 1960,
        genre: 'Southern Gothic'
      }
    ]
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    genre: 'Southern Gothic'
  }
];

// const schema = `#graphql
//   # A book has a title, author, and publication year
//   type Book {
//     id: ID!
//     title: String!
//     author: String!
//     year: Int
//     genre: String
//     books: [Book]
//   }
//
//   # The "Query" type is the root of all GraphQL queries
//   type Query {
//     # Get all books
//     books: [Book!]!
//     # Get a specific book by ID
//     book(id: ID!): Book
//     # Search books by title or author
//     searchBooks(query: String!): [Book!]!
//   }
// `
//
// // Define resolvers for the schema fields
// const root = {
//   Query: {
//     // Resolver for fetching all books
//     books: () => books,
//
//     // Resolver for fetching a single book by ID
//     book: (parent, args) => {
//       return books.find((book) => book.id === args.id);
//     },
//
//     // Resolver for searching books
//     searchBooks: ({ query }) => {
//       const searchTerm = query.toLowerCase();
//       return books.filter(
//         book =>
//           book.title.toLowerCase().includes(searchTerm) ||
//           book.author.toLowerCase().includes(searchTerm)
//       );
//     }
//   }
// };

const schema = `#graphql
  type Fruit {
    id: ID!
    slug: String!
    type: FruitType!
    name: String
    description: String
    short_description: String
    opening_year: Int
    images: [String]
    parentage: [Fruit]
    children: [Fruit]
  }
  
  type FruitType {
    id: ID!
    slug: String!
    name: String
  }
  
  type Query {
    fruit(slug: String!): Fruit
    fruits(first: Int, offset: Int): {
      totalCount: Int
      edges
    }
  }
`;

const fetchFruitBySlug = async (idOrSlug: string) => {
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
    fruits: async () => {
      const sp = useSupabase();
      const { data, error } = await sp.from('v_fruits_merged').select('*');
      return data;
    },

    fruit: async (parent, args , ...r) => {
      const sp = useSupabase();
      const data = await fetchFruitBySlug(args.slug);
      const parentage = await Promise.all(data.parentage.map(fetchFruitBySlug));
      const children = await fetchFruitChildren(data.id);
      const type = await fetchFruitType(data.type);
      return {
        ...data,
        parentage,
        children,
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