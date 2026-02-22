import type {AllFruitsByTypeResponse} from "#shared/api/types";

type FetchFruitsByType = (slug: string, skip?: number, take?: number) => Promise<AllFruitsByTypeResponse>;

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
      () => $fetch(`/api/fruits/${slug}/all`)
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

  return { fetchFruitsByType };
};
