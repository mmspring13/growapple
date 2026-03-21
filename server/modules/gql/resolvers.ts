import {useSupabase} from "#server/modules/supabase";
import {log, getSelectedFields, fetchFromSupabase} from "./utils";
import {AppApolloDepthError, AppApolloErrorCodes} from './errors';
import type {FieldNode} from "graphql/language";
import type {Fruit} from "~/_codegen/types";

const imgDir = 'fruit_images/';

const getDepth = (node: FieldNode, currentDepth = 0): number => {
  if (!node.selectionSet) {
    return currentDepth;
  }

  // @todo: expect code
  const depths = node.selectionSet.selections.map(selection => {
    if (selection.kind === 'Field') {
      return getDepth(selection, currentDepth + 1);
    }
    return currentDepth + 1;
  });

  return Math.max(...depths, currentDepth);
};

export const resolvers = {
  Query: {
    // @ts-ignore
    fruits: async (_, args, ctx, info) => {
      log.info({
        args,
      }, '🍏 resolve fruit query');

      const sp = useSupabase();
      const { listFruitsLimit } = ctx.config;
      const { type = 'apple', skip = 0, slugs, search = '' } = args;
      let { take } = args;
      if (!take || take > listFruitsLimit) {
        take = listFruitsLimit;
      }

      const selectFields = getSelectedFields(info, ['images', 'avatar']);
      if (!selectFields) {
        throw new Error("empty selected fields");
      }

      const data = await fetchFromSupabase(
        'v_fruits_merged',
        selectFields,
        (query) => {
          query = slugs ? query.in('slug', slugs) : query;
          if (search) query = query.textSearch('name', search, {
            type: 'websearch',
            config: 'english'
          })
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
    // @ts-ignore
    fruit: async (_, { slug }, __, info) => {
      log.info({
        slug
      }, '🍏 resolve fruit query');
      const selectFields = getSelectedFields(info, ['avatar', 'images']);
      if (!selectFields) {
        throw new Error("empty selected fields");
      }

      return fetchFromSupabase('v_fruits_merged', selectFields, q => q.eq('slug', slug), 'Failed to fetch fruit', true);
    },
  },
  Fruit: {
    // @ts-ignore
    children: (parent, _, ctx, info) => {
      const { fruitDepthLimit } = ctx.config;
      const depth = getDepth(info.fieldNodes[0]) - 2;
      if (depth > fruitDepthLimit) {
        throw new AppApolloDepthError(
          "exceeded depth of fruit children query",
          AppApolloErrorCodes.EXCEEDED_DEPTH_CHILDREN,
          null,
          fruitDepthLimit,
        );
      }
      return parent.children;
    },
    // @ts-ignore
    parentage: (parent, _, ctx, info) => {
      const { fruitDepthLimit } = ctx.config;
      const depth = getDepth(info.fieldNodes[0]) - 2;
      if (depth > fruitDepthLimit) {
        throw new AppApolloDepthError(
          "exceeded depth of fruit parentage query",
          AppApolloErrorCodes.EXCEEDED_DEPTH_PARENTAGE,
          null,
          fruitDepthLimit,
        );
      }
      return parent.parentage;
    },
    // @ts-ignore
    avatar: async (parent: Fruit, _, ctx, infp) => {
      log.info({
        images: parent.images,
        id: parent.id,
        slug: parent.slug,
      }, '🍎 resolve fruit avatar field');
      const { s3BucketName } = ctx.config;
      const sp = useSupabase();
      for (const avatarPath of [
        `${parent.id}/avatar.webp`,
        `${parent.id}/001.webp`
      ]) {
        const { data: isAvatarExist } = await sp.storage
          .from(s3BucketName).exists(avatarPath);
        if (isAvatarExist) {
          return { url: imgDir + avatarPath };
        }
      }
      return null;
    },
    // @ts-ignore
    images: async (parent: Fruit, _, ctx) => {
      log.info({
        images: parent.images,
        id: parent.id,
        slug: parent.slug,
      }, '🌉 resolve fruit images field');
      const { s3BucketName, fruitImagesLimit } = ctx.config;
      const sp = useSupabase();
      const { data } = await sp.storage
        .from(s3BucketName).list(parent.id, {
          limit: fruitImagesLimit,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });
      if (data?.length) {
        const images = data.filter((file) => {
          const parts = file.name.split('.');
          const extension = parts.pop();
          const nameWithoutExt = parts.join('.');
          const isWebp = extension?.toLowerCase() === 'webp';
          const isNumeric = nameWithoutExt.trim() !== "" && !Number.isNaN(Number(nameWithoutExt));

          return isWebp && isNumeric;
        });
        return images.map((img) => `${imgDir}${parent.id}/${img.name}`);
      }
      return []
    },
  },
};