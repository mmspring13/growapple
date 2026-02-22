import { defineEventHandler } from 'h3';
import type { AppTypeFruit } from '#shared/entities/fruit';
import { useSupabase } from '#server/modules/supabase';

export default defineEventHandler(async () => {
  const supabase = useSupabase();

  const { data, error } = await supabase
    .from('fruit_types')
    .select('*');

  if (error) {
    console.error('Error fetching fruit types:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch fruit types',
    });
  }

  return data as AppTypeFruit[];
});
