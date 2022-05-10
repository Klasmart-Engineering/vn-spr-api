import { UUID } from 'src/types';

/**
 * Build GraphQL ID filter OR conditions
 *
 * Output:
 *
 * ```
 * OR: [
 *   { userId: { operator: eq, value: "abcxyz" } }
 *   { userId: { operator: eq, value: "xyzabc" } }
 * ]
 * ```
 *
 * @param ids UUID[]
 * @param idFilterName string
 * @returns string
 */
export function buildOrConditions(ids: UUID[], idFilterName: string): string {
  let conditions: string;

  if (ids.length === 0) throw new Error(`Ids is missing`);
  if (ids.length === 1)
    conditions = `name: { operator: eq, value: "${ids[0]}" }`;

  conditions =
    'OR: [' +
    ids.map((id) => `{ ${idFilterName}: { operator: eq, value: "${id}" } }`) +
    ']';

  return conditions;
}

/**
 * Build GraphQL filter AND conditions
 *
 * Output:
 *
 * ```
 *
 * { name1: { operator: eq, value: "abcxyz" } }
 * { name2: { operator: eq, value: "xyzabc" } }
 *
 * ```
 *
 * @param records { name1: "abcxyz", name2: "xyzabc"}
 * @returns string
 */
export function buildAndConditions(records: Record<string, string>): string {
  let conditions = '';
  const keys = Object.keys(records);
  for(let i = 0 ; i< keys.length; i++) {
    const key = keys[i];
    conditions += `${key}: { operator: eq, value: "${records[key]}" }`;
  }
  return conditions;
}
