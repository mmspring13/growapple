export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Fruit = {
  __typename?: 'Fruit';
  avatar?: Maybe<FruitAvatar>;
  children: Array<Fruit>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  opening_year?: Maybe<Scalars['Int']['output']>;
  parentage: Array<Fruit>;
  short_description?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type FruitAvatar = {
  __typename?: 'FruitAvatar';
  url: Scalars['String']['output'];
};

export type FruitType = {
  __typename?: 'FruitType';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
};

export type Fruits = {
  __typename?: 'Fruits';
  data: Array<Fruit>;
  pageInfo: Pagination;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type Pagination = {
  __typename?: 'Pagination';
  hasNextPage: Scalars['Boolean']['output'];
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  fruit?: Maybe<Fruit>;
  fruits?: Maybe<Fruits>;
};


export type QueryFruitArgs = {
  slug: Scalars['String']['input'];
};


export type QueryFruitsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  slugs?: InputMaybe<Array<Scalars['String']['input']>>;
  take?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};
