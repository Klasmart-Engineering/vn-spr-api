import { buildOrConditions } from 'src/services/admin/common';
import { GET_USERS_BY_IDS } from 'src/services/admin/user';
import { stringInject } from 'src/utils';

describe('#buildOrConditions', () => {
  it('builds correct GraphQL ID filter conditions', () => {
    const conditions = buildOrConditions(
      [
        '10f60763-c32b-4d48-9777-a0c1d28f6e85',
        '5abd2d6e-fa9f-4026-a9c1-b6b47e557019',
      ],
      'userId'
    );

    expect(conditions).toEqual(
      'OR: [{ userId: { operator: eq, value: "10f60763-c32b-4d48-9777-a0c1d28f6e85" } },{ userId: { operator: eq, value: "5abd2d6e-fa9f-4026-a9c1-b6b47e557019" } }]'
    );
  });

  it('builds correct GraphQL query after injecting condition', () => {
    const conditions = buildOrConditions(
      [
        '10f60763-c32b-4d48-9777-a0c1d28f6e85',
        '5abd2d6e-fa9f-4026-a9c1-b6b47e557019',
      ],
      'userId'
    );
    const query = stringInject(GET_USERS_BY_IDS, { orConditions: conditions });
    const expectedQuery = `
  query getUsersByIds(
    $count: PageSize,
    $cursor: String
  ) {
    usersConnection(
      direction: FORWARD
      directionArgs: { count: $count, cursor: $cursor }
      filter: {
        userStatus: { operator: eq, value: "active" }
        OR: [{ userId: { operator: eq, value: "10f60763-c32b-4d48-9777-a0c1d28f6e85" } },{ userId: { operator: eq, value: "5abd2d6e-fa9f-4026-a9c1-b6b47e557019" } }]
      }
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          givenName
          familyName
          avatar
        }
      }
    }
  }
`;

    expect(query).toEqual(expectedQuery);
  });
});
