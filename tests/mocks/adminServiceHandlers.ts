import { graphql } from 'msw';

export const adminServiceHandlers = [
  // Handles a "permissionsConnection" query
  graphql.query('getPermission', (req, res, ctx) => {
    if (!req.headers.get('Authorization')) {
      // When not authenticated, respond with an error
      return res(
        ctx.errors([
          {
            message: 'Not authenticated',
            errorType: 'AuthenticationError',
          },
        ])
      );
    }

    // When authenticated and without pagination cursor, respond with a query payload
    return res(
      ctx.data({
        permissionsConnection: {
          totalCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor:
              'eyJvcmdhbml6YXRpb25faWQiOiIwMDFiZTg3OC0xMWMyLTQwZGMtYWQyNS1iZmJjYmY2ZjA5NjAifQ==',
            endCursor:
              'eyJvcmdhbml6YXRpb25faWQiOiIwMDFiZTg3OC0xMWMyLTQwZGMtYWQyNS1iZmJjYmY2ZjA5NjAifQ==',
          },
          edges: [
            {
              node: {
                id: 'academic_profile_20100',
                name: 'academic_profile_20100',
                category: 'Academic Profile',
                group: 'Schools --> Deprecate',
                level: 'Teacher',
                description:
                  'Gives users access to School Resources (i.e. via icons/buttons)',
                allow: true,
              },
            },
          ],
        },
      })
    );
  }),

  // Handles a "permissionsConnection" query
  graphql.query('getUsersByIds', (req, res, ctx) => {
    if (!req.headers.get('Authorization')) {
      // When not authenticated, respond with an error
      return res(
        ctx.errors([
          {
            message: 'Not authenticated',
            errorType: 'AuthenticationError',
          },
        ])
      );
    }

    // When authenticated and without pagination cursor, respond with a query payload
    return res(
      ctx.data({
        usersConnection: {
          totalCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor:
              'eyJ1c2VyX2lkIjoiMDJkNzYyMzItYjJmYy00M2IzLWE5NDItNmM1OTg2NTdlNTg1In0=',
            endCursor:
              'eyJ1c2VyX2lkIjoiMDJkNzYyMzItYjJmYy00M2IzLWE5NDItNmM1OTg2NTdlNTg1In0=',
          },
          edges: [
            {
              node: {
                id: '10f60763-c32b-4d48-9777-a0c1d28f6e85',
                givenName: 'John',
                familyName: 'Doe',
                avatar: null,
              },
            },
            {
              node: {
                id: '5abd2d6e-fa9f-4026-a9c1-b6b47e557019',
                givenName: 'Jane',
                familyName: 'Doe',
                avatar: null,
              },
            },
          ],
        },
      })
    );
  }),
];
