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
];
