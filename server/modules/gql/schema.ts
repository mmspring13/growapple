export const schema = `#graphql
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
    type: String!
#    type: FruitType!
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