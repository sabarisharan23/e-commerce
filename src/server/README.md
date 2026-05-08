# Backend Setup

This folder holds server-only code used by Next.js route handlers.

## Structure

- `config/` - environment helpers and server configuration.
- `db/` - Prisma client setup and database access.
- `http/` - API response helpers, typed errors, and route-handler wrappers.
- `observability/` - logging and diagnostics helpers.
- `security/` - password hashing and security utilities.
- `vendors/` - vendor-specific business logic.

## Adding An API

Create route handlers under `src/app/api/v1`. Keep business logic in `src/server`
so the route file stays small.

```ts
import { apiErrors, apiSuccess, withApiHandler } from "@/server";

export const POST = withApiHandler(async (request) => {
  const body = await request.json();

  if (!body) {
    throw apiErrors.badRequest("Request body is required.");
  }

  return apiSuccess({ created: true }, { status: 201 });
});
```

The current health check is available at `/api/v1/health`.

## Database

Prisma is configured in `prisma/schema.prisma` and `prisma.config.ts`. The
default development database uses PostgreSQL from `DATABASE_URL`.

```bash
npm run prisma:push
npm run prisma:generate
```

Vendor passwords are never stored as plain text. They are stored as salted
`scrypt` password hashes in the `passwordHash` column.
