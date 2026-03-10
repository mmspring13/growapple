import {useSupabase} from "#server/modules/supabase";

export default defineEventHandler(async (event) => {
  const sp = useSupabase();
  // const q = await sp.from('v_fruits_merged')
  //   .select('id,slug,description,name,children(id,slug,name),parentage(id,slug,name),opening_year')
  const { data, error } = await sp.storage
    .from('fruit_images').exists('1/001.swebp');
  // if (error) {
  //   console.log(error)
  //   throw error;
  // }
  return data
});