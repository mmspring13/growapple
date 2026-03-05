import {useLogger} from "#server/utils/logger";
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";
import {useSupabase} from "#server/modules/supabase";

export const log = useLogger('supabase');

function buildSupabaseSelect(
  fields: any,
  excludeFields: string[] = [],
  requiredFields?: string[],
): string {
  const arrFields = Object.entries(fields)
    .filter(([name]) => !excludeFields.includes(name))
    .map(([name, value]: any) => {
      const childTypes = value.fieldsByTypeName
        ? Object.values(value.fieldsByTypeName)[0]
        : null;

      if (childTypes && Object.keys(childTypes).length > 0) {
        let nested = buildSupabaseSelect(childTypes, excludeFields);
        if (['parentage', 'children'].includes(name) && nested.startsWith('data(')) {
          nested = nested.replace(/^data\(|\)$/g, '');
        }
        return `${name}(${nested})`;
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
    return arrFields.join(",");
}

export const getSelectFields = (
  info: any,
  targetTypeName: string,
  excludeFields: string[] = [],
  requiredFields: string[] = []
): string | null => {
  const parsedInfo = parseResolveInfo(info);

  if (!parsedInfo) return null;

  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedInfo,
    info.returnType
  );

  let targetFields = fields;

  if (fields["data"] && fields["data"].fieldsByTypeName[targetTypeName]) {
    targetFields = fields["data"].fieldsByTypeName[targetTypeName];
  } else if (parsedInfo.fieldsByTypeName[targetTypeName]) {
    targetFields = parsedInfo.fieldsByTypeName[targetTypeName];
  }
  const select = buildSupabaseSelect(targetFields, excludeFields, requiredFields);
  return select || null;
};

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
  }, "start fetch from supabase");
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
