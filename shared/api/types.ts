import type {AppFruit, AppTypeFruit} from "#shared/entities/fruit";


export type AllFruitsByTypeResponse = {
  data: Omit<AppFruit, 'type' | 'description'>[];
  type: AppTypeFruit;
};

export type AllFruitsByTypeFruit = AllFruitsByTypeResponse['data'][number];

export type FruitBySlugResponse = {
  data: Omit<AppFruit, 'type'>;
  type: AppTypeFruit;
};

export type FruitBySlug = FruitBySlugResponse['data'];
