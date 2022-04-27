import {
  ApolloClient,
  DocumentNode,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  TypedDocumentNode,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import fetch from 'cross-fetch';
import { Permission } from 'src/models';
import { User } from 'src/models';
import { Entity, UUID } from 'src/types'; // TODO: can't use src/types <= why?
import { stringInject } from 'src/utils';

import { buildOrConditions } from './common';
import { GET_PERMISSION } from './permission';
import { GET_USERS_BY_IDS } from './user';

type SupportedConnections =
  | 'permissionsConnection'
  | 'usersConnection';

export type IdNameMapper = {
  id: UUID;
  name: string;
};

export class AdminService {
  private static _instance: AdminService;
  public readonly context: { headers: { Authorization: string } };

  private constructor(
    private _client: ApolloClient<NormalizedCacheObject>,
    token: string
  ) {
    this.context = { headers: { Authorization: `${token}` } };
  }

  public static async getInstance(token: string) {
    if (this._instance) return this._instance;

    if (!process.env.ADMIN_SERVICE_URL) {
      throw new Error(`Environment variable ADMIN_SERVICE_URL is invalid.`);
    }

    const httpLink = new HttpLink({
      uri: process.env.ADMIN_SERVICE_URL,
      fetch,
    });

    /**
     * Only retry network errors
     *
     * Reference: https://www.apollographql.com/docs/react/api/link/apollo-link-retry/
     */
    const retryLink = new RetryLink({
      delay: {
        initial: 300,
        max: Infinity,
        jitter: true,
      },
      attempts: {
        max: 5,
        retryIf: (error, _operation) => !!error,
      },
    });

    const errorLink = onError(({ graphQLErrors, networkError, response }) => {
      /**
       * GraphQL errors, will not retry
       *
       * - Syntax errors (e.g., a query was malformed) - 4xx error
       * - Validation errors (e.g., a query included a schema field that doesn't exist) - 4xx error
       * - Resolver errors (e.g., an error occurred while attempting to populate a query field) - 2xx error
       *
       * Reference: https://www.apollographql.com/docs/react/data/error-handling
       */
      if (graphQLErrors)
        graphQLErrors.forEach(({ message }) =>
          /* eslint-disable-next-line no-console */
          console.error(`[GraphQL error]: ${message}`)
        );

      // 4xx/5xx errors
      /* eslint-disable-next-line no-console */
      if (networkError) console.error(`[Network error]: ${networkError}`);

      if (response && response.errors) {
        response.errors.forEach((message) =>
          /* eslint-disable-next-line no-console */
          console.error(`[GraphQL error]: ${message}`)
        );
      }
    });

    try {
      const client = new ApolloClient({
        link: from([errorLink, retryLink, httpLink]),
        cache: new InMemoryCache(),
      });

      this._instance = new AdminService(client, token);
      /* eslint-disable-next-line no-console */
      console.info('Connected to KidsLoop admin service');
      return this._instance;
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error('❌ Failed to connect KidsLoop admin service');
      throw e;
    }
  }

  get client(): ApolloClient<NormalizedCacheObject> {
    return this._client;
  }

  public async getPermission(permissionName: string): Promise<Permission> {
    const transformer = ({
      id,
      name,
      category,
      group,
      level,
      description,
      allow,
    }: Permission) => ({
      id,
      name,
      category,
      group,
      level,
      description,
      allow,
    });
    const permission = await this.traversePaginatedQuery(
      GET_PERMISSION,
      transformer,
      'permissionsConnection',
      { permissionName }
    );
    if (permission.length > 1)
      throw new Error(
        `Unexpectedly found more than one permission with the name ${permissionName}, unable to identify which one should be used`
      );
    if (permission.length === 0)
      throw new Error(`Permission ${permissionName} not found`);

    return permission[0];
  }

  public async getUsersByIds(ids: UUID[]): Promise<User[]> {
    const transformer = ({ id, givenName, familyName }: User) => ({
      id,
      givenName,
      familyName,
    });

    const conditions = buildOrConditions(ids, 'userId');
    const query = stringInject(GET_USERS_BY_IDS, {
      orConditions: conditions,
    });
    if (query === undefined) {
      throw new Error(`Cannot prepare Admin Service usersConnection query`);
    }

    const users = await this.traversePaginatedQuery(
      gql(query),
      transformer,
      'usersConnection'
    );
    if (users.length === 0) throw new Error(`Users not found`);

    return users;
  }

  /**
   * A helper function to send a request to a paginated API and walk the
   * full length of the cursor, collating all the responses before returning
   * an array of items
   *
   * @param {string} query - The GraphQL query to be sent
   * @param {function} transformer - A function that will be called on each
   * node within the response to convert the response data into the desired format
   * @param {object} variables - Any variables that need to be provided to the
   * GraphQL query
   * @returns {T[]} An array of the transformed type
   */
  private async traversePaginatedQuery<T, U>(
    query: DocumentNode | TypedDocumentNode,
    transformer: (responseData: U) => T,
    connectionName: SupportedConnections,
    variables?: Record<string, unknown>
  ): Promise<T[]> {
    let hasNextPage = true;
    let cursor = '';

    const result: T[] = [];
    while (hasNextPage) {
      /**
       * Don't need to handle errors here because:
       *
       * - 4xx/5xx were handled in `errorLink` when initializing `ApolloClient`
       * - 2xx errors won't exist in this case
       */
      const response = await this.client.query({
        query,
        variables: {
          count: 50,
          cursor,
          ...variables,
        },
        context: this.context,
      });
      const data = response.data;
      if (!data)
        throw new Error('Received no data property on the response object');

      const responseData = data[connectionName];
      if (!responseData || !responseData.pageInfo) {
        let entity = Entity.UNKNOWN;
        switch (connectionName) {
          case 'permissionsConnection':
            entity = Entity.PERMISSION;
            break;
          default:
            break;
        }

        throw new Error(
          `When trying to parse the paginated query, found no pages of ${entity} data`
        );
      }
      hasNextPage = responseData.pageInfo.hasNextPage;
      cursor = responseData.pageInfo.endCursor;

      for (const { node } of responseData.edges) {
        result.push(transformer(node));
      }
    }
    return result;
  }
}
