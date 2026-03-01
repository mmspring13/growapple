import { defineEventHandler, getRouterParam, createError } from 'h3';
import { fetchFruitTypes } from "#server/actions/fetch-fruit-types";
import type {AllFruitsByTypeResponse} from "#shared/api/types";
import {allFruitsByType} from "#server/actions/all-fruits-by-type";
import {cached} from "#server/utils/cached";
import {useLogger} from "#server/utils/logger";


export default defineEventHandler<Promise<AllFruitsByTypeResponse>>(async (event) => {
  const log = useLogger('api');
  const typeSlug = getRouterParam(event, 'type');
  const query = getQuery(event);
  const method = event.method;
  const take = query.take ? Number(query.take) : 100;
  const skip = query.skip ? Number(query.skip) : 0;
  const key = `api:fruits/${typeSlug}?take=${take}&skip=${skip}`;
  log.info({ key, type: typeSlug }, 'try to fetch all fruits by type');
  if (!typeSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Fruit type slug is required' });
  }

  const request = async () => {
    log.info({
      key,
    }, 'no-cached request started');
    const types = await fetchFruitTypes();
    console.log('111', types);
    const type = types.find((t) => t.slug === typeSlug);
    if (!type) {
      throw createError({ statusCode: 400, statusMessage: `Can't find type by slug = ${typeSlug}` });
    }
    console.log('333');
    const allFruitsResponse = await allFruitsByType(type.id);
    console.log('444', allFruitsResponse);
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

  return cached(
    request,
    `api:${method}:${typeSlug}:${take}:${skip}`,
  )();
})
