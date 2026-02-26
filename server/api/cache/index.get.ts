import {readCachedKeys} from "#server/utils/cached";

export default defineEventHandler(() => {
  return { success: true, data: readCachedKeys() };
});
