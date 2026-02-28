import type {AllFruitsByTypeResponse, FruitBySlugResponse} from "#shared/api/types";

type FetchFruitsByType = (slug: string, skip?: number, take?: number) => Promise<AllFruitsByTypeResponse>;

type FetchFruitBySlug = (slug: string) => Promise<FruitBySlugResponse>;

export const useApi = () => {
  const fetchFruitsByType: FetchFruitsByType = async (
    slug,
    skip = 0,
    take= 100,
  ) => {
    const {
      data,
      error,
    } = await useAsyncData<AllFruitsByTypeResponse>(
      `api:fetch-fruits-by-type:${slug}:${skip}:${take}`,
      () => $fetch(`/api/fruits/${slug}`)
    );

    if (error.value) throw error;
    if (!data.value) {
      throw new Error('unknow error');
    }

    return {
      type: data.value.type,
      data: data.value.data,
    };
  };

  const fetchFruitBySlug: FetchFruitBySlug = async (slug) => {
    const {
      data,
      error,
    } = await useAsyncData<FruitBySlugResponse>(
      `api:fetch-fruit-by-slug:${slug}`,
      () => $fetch(`/api/fruit/${slug}`)
    );

    if (error.value) throw error;
    if (!data.value) {
      throw new Error('unknow error');
    }

    return {
      type: data.value.type,
      data: data.value.data,
    };
  };

  // const fetchAllApples: FetchAllApples = async (skip = 0, take = 100) => {
  //   const {
  //     data,
  //     error,
  //   } = await useAsyncData('api:all-apples', () => $fetch<AllFruitsByTypeResponse>('/api/fruits/1/all'));
  //
  //   if (error.value) throw error;
  //   if (!data.value) {
  //     throw new Error('unknow error');
  //   }
  //
  //   return {
  //     type: data.value.type,
  //     data: data.value.data,
  //   };
  // };

  return { fetchFruitsByType, fetchFruitBySlug };
};
