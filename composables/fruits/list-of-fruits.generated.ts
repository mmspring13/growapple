import gql from 'graphql-tag';
import type { Fruit } from './types';

export type ListOfFruitsQuery = {
  fruits: {
    data: Fruit[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      total: number;
    };
  };
};

export type ListOfFruitsQueryVariables = {
  search?: string;
  type?: string;
  skip?: number;
  take?: number;
};

export const ListOfFruitsDocument = gql`
  query ListOfFruits($search: String, $type: String, $skip: Int, $take: Int) {
    fruits(search: $search, type: $type, skip: $skip, take: $take) {
      data {
        id
        name
        slug
        opening_year
        short_description
        parentage {
          id
          name
        }
        children {
          id
          name
        }
        rest
        avatar {
          url
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        total
      }
    }
  }
`;

