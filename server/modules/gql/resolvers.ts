import {useSupabase} from "#server/modules/supabase";
import {log, getSelectFields, fetchFromSupabase} from "./utils";

export const resolvers = {
  Query: {
    fruits: async (_, args, __, info) => {
      const sp = useSupabase();

      const { type = 'apple', skip = 0, take = 8, slugs } = args;
      const selectFields = getSelectFields(info, 'Fruit', ['totalCount'], ['id']);

      if (!selectFields) {
        throw createError({ status: 400, statusText: 'bad query' });
      }

      const data = await fetchFromSupabase(
        'v_fruits_merged',
        selectFields,
        (query) => {
          query = slugs ? query.in('slug', slugs) : query;
          return query.eq('type', type).range(skip, skip + take - 1);
        },
        'Failed to fetch fruits',
      );

      const { count } = await sp.from('v_fruits_merged').select('id', {
        head: true,
        count: 'exact'
      });

      return {
        totalCount: count || 0,
        data: data?.map((f: any) => {
          if (f.avatar) {
            f.avatar = { url: f.avatar };
          }
          return f;
        }) || [],
        pageInfo: {
          skip,
          take,
          hasNextPage: count ? skip + take < count : false,
        },
      };
    },
    fruit: async (_, { slug }, __, info) => {
      log.info({
        slug
      }, '🍏 handle fruit query');
      const selectFields = getSelectFields(info, 'Fruit', []);

      if (!selectFields) {
        throw createError({ status: 400, statusText: 'bad query' });
      }

      const data = await fetchFromSupabase('v_fruits_merged', selectFields, q => q.eq('slug', slug), 'Failed to fetch fruit', true);
      return {
        ...data,
        avatar: { url: "__none__" }
      };
    },
  },
  Fruit: {
    children: async (parent) => {
      log.info({
        parent: parent.slug
      }, 'handle fruit query, children');
      const childrenIds = parent?.children || [];
      if (childrenIds.length === 0) {
        return { data: [], hasMore: false, totalCount: 0 };
      }
      return { data: parent.children, hasMore: true, totalCount: 104 };
    },
    parentage: async (parent) => {
      log.info({
        parent: parent.slug
      }, 'handle fruit query, parentage');
      const parentageIds = parent?.parentage || [];
      if (parentageIds.length === 0) {
        return { data: [], hasMore: false, totalCount: 0 };
      }
      return { data: parent.parentage, hasMore: true, totalCount: 92 };
    }
  },
};