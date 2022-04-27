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
