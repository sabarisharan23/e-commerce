This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Copy the environment template before running the app:

```bash
cp .env.example .env.local
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Backend Setup

Backend code lives in `src/server`, and API route handlers live under `src/app/api/v1`.
The initial endpoints are available at:

```txt
GET /api/v1/health
GET /api/v1/vendors
POST /api/v1/vendors
GET /api/v1/vendors/:vendorId
PATCH /api/v1/vendors/:vendorId
PUT /api/v1/vendors/:vendorId
DELETE /api/v1/vendors/:vendorId
```

Use the helpers exported from `@/server` for consistent responses, API errors,
environment access, and route error handling.

Prisma is used for database access. The default local database is PostgreSQL
from `DATABASE_URL`:

```bash
npm run prisma:push
npm run prisma:generate
```

To seed or re-sync the current static storefront catalog into the configured
database, run:

```bash
npm run catalog:sync -- --dry-run
npm run catalog:sync
```

After pushing the schema, open the configured PostgreSQL database in DBeaver.
With the default `.env.example`, that is the `theni-store` database on
`localhost:5432`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
