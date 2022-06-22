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

  graphql.query('getClassesByOrgId', (req, res, ctx) => {
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

    return res(
      ctx.data({
        classesConnection: {
          totalCount: 6,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor:
              'eyJjbGFzc19pZCI6IjEzZDk0OTg0LTBiZmEtNGQxYS1iMDFjLTkyN2Y4ZmEzYzg2ZSJ9',
            endCursor:
              'eyJjbGFzc19pZCI6ImRmZmIzM2I0LTg1ODktNDBjOC04Nzc5LTMxMWEyNmFlZTgyYyJ9',
          },
          edges: [
            {
              node: {
                id: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e',
                name: 'Class1B Test',
              },
            },
            {
              node: {
                id: '367ce372-9058-4212-a00e-33d4b9bbf164',
                name: 'Class1D',
              },
            },
            {
              node: {
                id: '7f78aeac-a8e2-4c4e-b819-458403b68854',
                name: 'Class1C',
              },
            },
            {
              node: {
                id: '82c608c3-3de2-4ea6-b5e2-358ab7f7cc11',
                name: 'Class1A',
              },
            },
            {
              node: {
                id: 'c332d35c-1866-4d23-a4e7-7b309a9ce576',
                name: 'Class1V',
              },
            },
            {
              node: {
                id: 'dffb33b4-8589-40c8-8779-311a26aee82c',
                name: 'Class1E',
              },
            },
          ],
        },
      })
    );
  }),
];
