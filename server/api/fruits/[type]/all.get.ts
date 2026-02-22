import { defineEventHandler, getRouterParam, createError } from 'h3';
import { useSupabase } from '#server/modules/supabase';
import { DbFruitMeta, DbFruit } from '#server/entities/fruit';
import { fetchFruitTypes } from "#server/actions/fetch-fruit-types";
import type {AppFruit, AppTypeFruit} from "#shared/entities/fruit";
import type {AllFruitsByTypeResponse, AppFruitResponse} from "#shared/api/types";
import {allFruitsByType} from "#server/actions/all-fruits-by-type";

export default defineEventHandler<Promise<AllFruitsByTypeResponse>>(async (event) => {
  const typeSlug = getRouterParam(event, 'type');
  const types = await fetchFruitTypes();
  console.log(types)
  const type = types.find((t) => t.slug === typeSlug);
  if (!type) {
    throw createError({ statusCode: 400, statusMessage: `Can't find type by slug = ${typeSlug}` });
  }
  const allFruitsResponse = await allFruitsByType(type.id);
  if (!allFruitsResponse.type) {
    throw createError({
      statusCode: 400, statusMessage: `Can't find type by id = ${type.id}`
    });
  }

  return {
    type: allFruitsResponse.type,
    data: allFruitsResponse.fruits,
  }
})

// export default defineEventHandler<Promise<{
//   data: AppFruitResponse[];
//   type: AppTypeFruit | null;
// }>>(async (event) => {
//   const typeSlug = getRouterParam(event, 'type');
//   const supabase = useSupabase();
//
//   if (!typeSlug) {
//     throw createError({ statusCode: 400, statusMessage: 'Fruit type ID is required' });
//   }
//   const types = await fetchFruitTypes();
//   const type = types.find((t) => t.slug === typeSlug);
//   if (!type) {
//     throw createError({ statusCode: 400, statusMessage: `Can't find type by slug = ${typeSlug}` });
//   }
//
//   // 1. Fetch metadata and core fruit data
//   const { data: fruitsMetaData, error: fruitsMetaError } = await supabase
//     .from('fruits_meta')
//     .select('*')
//     .eq('type', type?.id);
//
//   if (fruitsMetaError) throw createError({ statusCode: 500, statusMessage: fruitsMetaError.message });
//   if (!fruitsMetaData?.length) return { data: [], type: null };
//
//   const fruitIds = fruitsMetaData.map((meta: DbFruitMeta) => meta.fruit_id);
//
//   const { data: fruitsData, error: fruitsError } = await supabase
//     .from('fruits')
//     .select('*')
//     .in('id', fruitIds);
//
//   if (fruitsError) throw createError({ statusCode: 500, statusMessage: fruitsError.message });
//
//   const childrenMap = new Map<number, number[]>();
//
//   // Initialize children arrays for all found fruits
//   fruitsData?.forEach(f => childrenMap.set(f.id, []));
//
//   fruitsData?.forEach((fruit: DbFruit) => {
//     if (Array.isArray(fruit.parentage)) {
//       fruit.parentage.forEach((parentId) => {
//         if (childrenMap.has(parentId)) {
//           const currentChildren = childrenMap.get(parentId)!;
//           if (!currentChildren.includes(fruit.id)) {
//             currentChildren.push(fruit.id);
//           }
//         }
//       });
//     }
//   });
//
//   // 4. Combine data into AppFruit format
//   const fruitsMap = new Map(fruitsData?.map(f => [f.id, f]));
//
//   const appFruits: AppFruitResponse[] = fruitsMetaData.map((meta: DbFruitMeta) => {
//     const fruit = fruitsMap.get(meta.fruit_id);
//
//     return {
//       id: fruit.id,
//       slug: meta.slug,
//       name: meta.name,
//       parentage: fruit.parentage,
//       opening_year: fruit.opening_year,
//       type: {
//         id: currentType.id,
//         name: currentType.name,
//         slug: currentType.slug,
//       },
//       children: childrenMap.get(fruit.id) || [],
//       description: meta.description,
//       images: meta.images,
//       rest: meta.rest,
//     };
//   });
//
//   return {
//     data: appFruits,
//     type: currentType,
//   };
// });