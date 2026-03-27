export const schema = `#graphql
  type FruitAvatar {
    url: String!
  }

  type Fruit {
    id: ID!
    slug: String!
    type: String!
    avatar: FruitAvatar
    name: String
    description: String
    short_description: String
    opening_year: Int
    images: [String]
    parentage: [Fruit!]!
    children: [Fruit!]!
    color: String
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
    fruits(
      "API used 'apple' by default"
      type: String,
      skip: Int,
      take: Int,
      slugs: [String!],
      search: String
    ): Fruits
  }
`;