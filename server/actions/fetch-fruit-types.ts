import {useSupabase} from "#server/modules/supabase";
import {DbFruitType} from "#server/entities/fruit";
import type {AppTypeFruit} from "#shared/entities/fruit";

export const fetchFruitTypes = async () => {
  const supabase = useSupabase();

  const { data, error } = await supabase
    .from('fruit_types')
    .select('*');
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  if (!data || data.length === 0) {
    throw createError({statusCode: 404, statusMessage: 'No fruit types found'});
  }

  return data as AppTypeFruit[];
};
