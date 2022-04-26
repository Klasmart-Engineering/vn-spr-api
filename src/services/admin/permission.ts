import { gql } from '@apollo/client/core';

export const GET_PERMISSION = gql`
  query getPermission($count: PageSize, $cursor: String, $permissionName: String!) {
    permissionsConnection(
      direction: FORWARD
      directionArgs: { count: $count, cursor: $cursor }
      filter: {
        AND: [
          { id: { operator: eq, value: $permissionName } }
        ]
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
          category
          group
          level
          description
          allow
          # rolesConnection {
          #   edges {
          #     node {
          #       id
          #       name
          #       status
          #       description
          #       system
          #     }
          #   }
          # }
        }
      }
    }
  }
`;
