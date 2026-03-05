import { defineEventHandler } from 'h3';
import DataLoader from 'dataloader';
import type { AppTypeFruit } from '#shared/entities/fruit';
import { useSupabase } from '#server/modules/supabase';

const fetchData = async (ids) => {
  const supabase = useSupabase();
  console.log("SUPABASE REEQUEST", ids);
  const { data, error } = await supabase
    .from('v_fruits_merged')
    .select(`id,slug,name,opening_year,short_description,children(id,slug,parentage(id,slug,name,children(id,slug,name)))`)
    // .select(`
    //   id,
    //   slug,
    //   name,
    //   parentage (
    //     id,
    //     slug,
    //     children (
    //       id,
    //       slug,
    //       parentage (
    //       id,
    //       slug,
    //         children (
    //           id,
    //           slug
    //         )
    //       )
    //     )
    //   ),
    //   children (
    //     id,
    //     slug,
    //     parentage (
    //       id,
    //       slug,
    //        children (
    //         id,
    //         slug
    //       )
    //     )
    //   )
    // `)
    .in('id', ids);
  if (error) throw error;
  return data;
};

function createScheduler() {
  let callbacks = [];
  return {
    schedule(callback) {
      callbacks.push(callback);
    },
    async dispatch() {
      for (let cb of callbacks) {
        await cb();
      }
      callbacks = [];
    },
  };
}
const { schedule, dispatch } = createScheduler();
const l = new DataLoader(fetchData, { batchScheduleFn: schedule });

const a = async () => {
  await l.loadMany([6,2]);
}

export default defineEventHandler(async () => {
  // await l.loadMany([2,4]);
  // await a();
  // await l.loadMany([5,1]);
  // await dispatch();

  // if (error) {
  //   console.error('Error fetching fruit types:', error);
  //   throw createError({
  //     statusCode: 500,
  //     statusMessage: 'Failed to fetch fruit types',
  //   });
  // }
  return fetchData([4,5,6,8,1,13]);
  // return data as AppTypeFruit[];
});
