export const GET_USERS_BY_IDS = `
  query getUsersByIds(
    $count: PageSize,
    $cursor: String
  ) {
    usersConnection(
      direction: FORWARD
      directionArgs: { count: $count, cursor: $cursor }
      filter: {
        status: { operator: eq, value: "active" }
        {orConditions}
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
