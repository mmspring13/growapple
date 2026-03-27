import {useLogger} from "#server/utils/logger";
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";
import {useSupabase} from "#server/modules/supabase";

export const log = useLogger('gql');

function buildSupabaseSelect(
  fields: any,
  excludeFields: string[] = [],
  requiredFields?: string[],
  restFields: string[] = [],
): string[] {
  const arrFields = Object.entries(fields)
    .filter(([name]) => !excludeFields.includes(name))
    .map(([name, value]: any) => {
      const childTypes = value.fieldsByTypeName
        ? Object.values(value.fieldsByTypeName)[0]
        : null;

      if (childTypes && Object.keys(childTypes).length > 0) {
        let nested = buildSupabaseSelect(childTypes, excludeFields, requiredFields, restFields);
        return `${name}(${nested})`;
      }
      if (restFields.includes(name)) {
        return `rest->${name}`;
      }
      return name;
    })
    if (requiredFields?.length) {
      requiredFields.forEach((field) => {
        if (!arrFields.includes(field)) {
          arrFields.push(field);
        }
      });
    }
    return arrFields;
}

export const getSelectedFields = (
  info: any,
  excludeFields: string[] = [],
  requiredFields: string[] = ['id'],
) => {
  const parsedInfo = parseResolveInfo(info);
  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedInfo,
    info.returnType
  );
  return buildSupabaseSelect(fields, excludeFields, requiredFields, ['color']);
}

export const fetchFromSupabase = async (
  from: string,
  select: string,
  filter: (query: any) => any,
  errorMessage: string,
  single = false
) => {
  log.info({
    from,
    select,
  }, "🚚 start fetch from supabase 🗂️");
  const sp = useSupabase();
  let query = sp.from(from).select(select);
  query = filter(query);
  if (single) {
    query = query.single();
  }
  const { data, error } = await query;
  if (error) {
    log.error({ error, select }, errorMessage);
    throw new Error(`${errorMessage}: ${error.message}`);
  }
  return data
};
