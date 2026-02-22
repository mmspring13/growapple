import type {AppFruit, AppTypeFruit} from "#shared/entities/fruit";

export type AppFruitResponse = Omit<AppFruit, 'type'>;

export type AllFruitsByTypeResponse = {
  data: AppFruitResponse[];
  type: AppTypeFruit;
};
