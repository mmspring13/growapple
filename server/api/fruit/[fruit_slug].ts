import { defineEventHandler, getRouterParam, createError } from 'h3';
import { fetchFruitTypes } from "#server/actions/fetch-fruit-types";
import type {AllFruitsByTypeResponse} from "#shared/api/types";
import {allFruitsByType} from "#server/actions/all-fruits-by-type";
import {cached} from "#server/utils/cached";
import {useLogger} from "#server/utils/logger";


export default defineEventHandler<Promise<AllFruitsByTypeResponse>>(async (event) => {
  const log = useLogger('api');
  const slug = getRouterParam(event, 'fruit_slug');
  const method = event.method;
  const key = `api:fruits/${slug}`;
  log.info({ key, type: slug }, 'try to fetch all fruits by type');
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Fruit slug is required' });
  }

  const request = async () => {
    log.info({
      key,
    }, 'no-cached request started');
    const types = await fetchFruitTypes();
    const type = types.find((t) => t.slug === slug);
    if (!type) {
      throw createError({ statusCode: 400, statusMessage: `Can't find type by slug = ${slug}` });
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
  };
  return {};
  // return cached(
  //   request,
  //   `api:${method}:${typeSlug}:${take}:${skip}`,
  // )();
})
