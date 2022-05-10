export const GET_CLASSES_OF_ORG_ID = `
  query getClassesByOrgId(
    $count: PageSize
    $cursor: String
    $orgId: UUID!
  ) {
    classesConnection(
      direction: FORWARD
      directionArgs: { count: $count, cursor: $cursor }
      filter: {
        status: { operator: eq, value: "active" }
        organizationId: { operator: eq, value: $orgId }
        {andConditions}
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
          name
        }
      }
    }
  }
`;
