# Student performance report

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

Setup environment variables:

- Create a `.env` file by copying the contents of `.env.example`
- Change the value of `SHOW_SWAGGER` to `true` if you want to see Swagger document on your local machine.

Install dependencies:

- `npm i`

## Running

Start the application:

- `npm start`
- or, `npm run start:dev` for nodemon monitoring & live reloading

### Testing

For running tests with a specific file:

```bash
$ npm test -- string.test.ts
```

### Connect to Admin Service (former User Service) on local machine

**Important:** you need to have access to the repo https://github.com/KL-Engineering/user-service.

Follow `user-service`'s README [`Installation`](https://github.com/KL-Engineering/user-service/blob/main/README.md#installation) sections to start the service.

Next, we need to create a user & organization, you can whether create on `Admin Service` GraphQL playground at http://localhost:8080/user/playground or simply run below SQL script:

> Please remember to input your Organization Admin `roleRoleId` (can be found in `role` table) in the last query.

```sql
INSERT INTO "public"."organization" ("organization_id", "organization_name", "address1", "address2", "phone", "shortCode", "status", "deleted_at", "primaryContactUserId", "created_at", "updated_at") VALUES
('001be878-11c2-40dc-ad25-bfbcbf6f0960', 'Organization 1', NULL, NULL, NULL, 'DFXI9JM7UK', 'active', NULL, '514cd042-c24d-57ce-815c-9e50989f4031', '2021-11-17 00:34:21.935', '2021-11-17 00:34:21.935');
INSERT INTO "public"."organization_membership" ("user_id", "organization_id", "status", "join_timestamp", "shortcode", "deleted_at", "userUserId", "organizationOrganizationId", "created_at", "updated_at") VALUES
('514cd042-c24d-57ce-815c-9e50989f4031', '001be878-11c2-40dc-ad25-bfbcbf6f0960', 'active', '2021-05-18 14:53:44.462997', NULL, NULL, '514cd042-c24d-57ce-815c-9e50989f4031', '001be878-11c2-40dc-ad25-bfbcbf6f0960', '2021-11-17 00:34:21.935', '2021-11-17 00:34:21.935');
INSERT INTO "public"."organization_ownership" ("user_id", "organization_id", "status", "deleted_at", "created_at", "updated_at") VALUES
('514cd042-c24d-57ce-815c-9e50989f4031', '001be878-11c2-40dc-ad25-bfbcbf6f0960', 'active', NULL, '2021-11-17 00:34:21.935', '2021-11-17 00:34:21.935');
INSERT INTO "public"."user" ("user_id", "given_name", "family_name", "username", "email", "phone", "date_of_birth", "gender", "avatar", "status", "deleted_at", "primary", "alternate_email", "alternate_phone", "myOrganizationOrganizationId", "created_at", "updated_at") VALUES
('514cd042-c24d-57ce-815c-9e50989f4031', NULL, NULL, NULL, 'john@example.com', NULL, NULL, NULL, NULL, 'active', NULL, 'f', NULL, NULL, '001be878-11c2-40dc-ad25-bfbcbf6f0960', '2021-11-17 00:34:21.935', '2021-11-17 00:34:21.935');
INSERT INTO "public"."role_memberships_organization_membership" ("roleRoleId", "organizationMembershipUserId", "organizationMembershipOrganizationId") SELECT "role_id", '514cd042-c24d-57ce-815c-9e50989f4031', '001be878-11c2-40dc-ad25-bfbcbf6f0960' FROM "public"."role" WHERE "role_name" = 'Organization Admin';
```

Then you can use below JWT to connect to `Admin Service` by set it for `ADMIN_SERVICE_JWT` environment variable in `.env`.

> If you already had/created a user & its organization on GraphQL playground yourself, you will need to generate the JWT yourself, instruction can be found at [Admin Service onboarding document](https://bitbucket.org/calmisland/kidsloop-user-service/src/master/documents/howto/onboarding.md#markdown-header-token-script)

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjYWxtaWQtZGVidWciLCJpZCI6IjUxNGNkMDQyLWMyNGQtNTdjZS04MTVjLTllNTA5ODlmNDAzMSIsIm5hbWUiOm51bGwsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImFkbWluIjp0cnVlfQ.-YX-mL05D-ucomyS2IXw9VYapF5vq6fvSzsJ6SFUtt4
```

### Docker

You can also run the application with its dependencies through a docker-compose. For this just run:

- `docker-compose up`

### Swagger

You can check Swagger document at http://localhost:4200/docs.

Swagger document is built with [tsoa](https://github.com/lukeautry/tsoa), please check its [document](https://tsoa-community.github.io/docs/) for further information.
