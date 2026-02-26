import {createError} from "h3";
import {useSupabase} from "#server/modules/supabase";
import {DbFruit, DbFruitMeta} from "#server/entities/fruit";
import {fetchFruitTypes} from "./fetch-fruit-types";
import type {AppTypeFruit} from "#shared/entities/fruit";
import type {AllFruitsByTypeFruit} from "#shared/api/types";

export type AllFruitsByType = (fruitTypeId: number) => Promise<{
  type: AppTypeFruit | null;
  fruits: AllFruitsByTypeFruit[];
}>;

export const allFruitsByType: AllFruitsByType = async (fruitTypeId: number) => {
  const supabase = useSupabase();

  const { data: fruitsMetaData, error: fruitsMetaError } = await supabase
    .from('fruits_meta')
    .select('*')
    .eq('type', fruitTypeId);

  if (fruitsMetaError) throw fruitsMetaError;
  if (!fruitsMetaData?.length) return { fruits: [], type: null };

  const types = await fetchFruitTypes();

  const fruitIds = fruitsMetaData.map((meta: DbFruitMeta) => meta.fruit_id);

  const { data: fruitsData, error: fruitsError } = await supabase
    .from('fruits')
    .select('*')
    .in('id', fruitIds);

  if (fruitsError) throw fruitsError;

  const childrenMap = new Map<number, number[]>();

  fruitsData?.forEach(f => childrenMap.set(f.id, []));

  fruitsData?.forEach((fruit: DbFruit) => {
    if (Array.isArray(fruit.parentage)) {
      fruit.parentage.forEach((parentId) => {
        if (childrenMap.has(parentId)) {
          const currentChildren = childrenMap.get(parentId)!;
          if (!currentChildren.includes(fruit.id)) {
            currentChildren.push(fruit.id);
          }
        }
      });
    }
  });

  const fruitTypes = await fetchFruitTypes();
  const currentType = fruitTypes?.find((f) => f.id === Number(fruitTypeId)) || null;

  const fruitsMap = new Map(fruitsData?.map(f => [f.id, f]));

  const appFruits = fruitsMetaData.map((meta: DbFruitMeta) => {
    const fruit = fruitsMap.get(meta.fruit_id);

    return {
      id: fruit.id,
      slug: meta.slug,
      opening_year: fruit.opening_year,
      name: meta.name,
      parentage: fruit.parentage,
      children: childrenMap.get(fruit.id) || [],
      description: meta.description,
      images: meta.images,
      rest: meta.rest,
    };
  });

  return {
    fruits: appFruits,
    type: currentType,
  };
};