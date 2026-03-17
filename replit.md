# Civil Legacy — Workspace

## Overview

pnpm workspace monorepo migrated from Vercel to Replit. Contains a React/Vite frontend and an Express API backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite 7, Tailwind CSS v4, shadcn/ui components, Framer Motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for API), Vite (frontend)

## Workflows

- **Start application** — Runs the React/Vite frontend on port 5000 (webview)
- **API Server** — Runs the Express API server on port 3000 (console)

## Environment Variables

- `PORT=5000` — Frontend Vite dev server port
- `BASE_PATH=/` — Vite base path
- `DATABASE_URL` — PostgreSQL connection string (set as secret)
- `SESSION_SECRET` — Session secret (set as secret)
- `ALLOWED_ORIGIN` — CORS allowed origin for API server (optional in dev)

## Structure

```text
workspace/
├── artifacts/
│   ├── civil-legacy/       # React + Vite frontend (port 5000)
│   └── api-server/         # Express API server (port 3000)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Frontend: `artifacts/civil-legacy` (`@workspace/civil-legacy`)

Single-page React app for Civil Legacy consultancy website.

- Entry: `src/main.tsx`
- App: `src/App.tsx` — main component with full page content
- Config: `vite.config.ts` — reads `PORT` and `BASE_PATH` from env
- Dev: `pnpm --filter @workspace/civil-legacy run dev`
- Build: `pnpm --filter @workspace/civil-legacy run build`

## API Server: `artifacts/api-server` (`@workspace/api-server`)

Express 5 REST API.

- Entry: `src/index.ts` — reads `PORT=3000`, starts Express
- App: `src/app.ts` — CORS, JSON parsing, routes at `/api`
- Routes: `src/routes/health.ts` — `GET /api/healthz`
- Dev: `pnpm --filter @workspace/api-server run dev`

## Database: `lib/db` (`@workspace/db`)

Drizzle ORM with PostgreSQL.

- Uses `DATABASE_URL` env var (provisioned by Replit)
- Schema: `src/schema/index.ts`
- Push schema: `pnpm --filter @workspace/db run push`

## TypeScript

Every package extends `tsconfig.base.json` with `composite: true`.

- Run `pnpm run typecheck` from root
- Run `pnpm run build` for full workspace build
