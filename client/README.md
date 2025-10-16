# KfW Mini-Förderportal – Frontend Scaffold

This directory hosts the React + TypeScript frontend for the training reference project. The scaffold is purpose-built for deterministic Cypress exercises and will be extended with routing, feature flows, and backoffice tooling described in the product requirements document.

## Prerequisites

- Node.js ≥ 22.0.0 (LTS recommended)
- npm ≥ 10.0.0

Verify your local versions before proceeding:

```bash
node -v
npm -v
```

## Getting Started

```bash
cd client
npm install
cp .env.example .env.development
```

Update `.env.development` as needed. By default it points to `http://localhost:3001`, the port reserved for the fake API wrapper.
Set `VITE_API_MOCKING=on` to enable the Mock Service Worker layer during development (see [Mock API Layer](#mock-api-layer)).

## Available Scripts

All commands run from the `client` directory:

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the Vite dev server on port `5173` (configurable via `VITE_PORT`). |
| `npm run typecheck` | Run the TypeScript compiler in no-emit mode to surface type errors. |
| `npm run build` | Execute `typecheck` then create an optimized production build. |
| `npm run preview` | Serve the production build locally on port `4173`. |
| `npm run lint` | Execute ESLint with type-aware rules (React, hooks, a11y). |
| `npm run format` | Check formatting with Prettier without writing changes. |
| `npm run format:write` | Format the code base in-place using Prettier. |
| `npm run api` | Placeholder for the Express/json-server wrapper (`server/dev-server.cjs`). |
| `npm run seed` | Generate deterministic fixtures in [`../mocks/db.json`](../mocks/db.json) for json-server / API wrapper consumers. |
| `npm run start:all` | Placeholder for running API + frontend in parallel; will rely on the scripts above once implemented. |

> Note: `npm-run-all` is already installed to support the future `start:all` command.

## Project Structure

```
client/
├── public/                 # Static assets served as-is
├── src/
│   ├── app/
│   │   └── App.tsx         # Application shell placeholder
│   ├── styles/
│   │   └── global.css      # Baseline global styles and layout tokens
│   ├── main.tsx            # React entry point mounting the shell
│   └── vite-env.d.ts       # Vite-provided TypeScript declarations
├── index.html              # Root HTML document
├── tsconfig*.json          # TS project references (app + node)
└── vite.config.ts          # Vite configuration with alias + ports
```

Key files to reference:

- [`src/app/App.tsx`](src/app/App.tsx) – minimal layout with deterministic copy and `data-testid` hooks.
- [`src/main.tsx`](src/main.tsx) – registers the React root and imports global styles.
- [`src/styles/global.css`](src/styles/global.css) – neutral design system foundation.

Path aliases are defined so imports can use `@/` to resolve from `src/`.

## Linting & Formatting

- ESLint is configured via [`eslint.config.js`](eslint.config.js) using the flat config format with type-aware rules from `@typescript-eslint`, React, hooks, and `jsx-a11y`.
- Prettier is configured in [` .prettierrc.json`](.prettierrc.json) with a 100 character print width and single quotes.
- Run `npm run lint` and `npm run format` regularly; CI hooks can be wired later.

## Environment Variables

`.env.example` documents the supported keys:

```ini
VITE_PORT=5173
VITE_API_URL=http://localhost:3001
```

Copy it to `.env.development` (ignored by git) and adjust values per environment. Vite automatically exposes variables prefixed with `VITE_` to the client bundle.

- `VITE_API_MOCKING` — toggles the MSW mock layer (`on`/`off`, defaults to `on` in `.env.example`)
- `VITE_API_DELAY_MS` — optional global latency (milliseconds) applied by the mock middleware

## Verification Checklist

After fresh checkout or dependency changes, validate the scaffold with:

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run dev
```

Confirm the dev server is reachable at `http://localhost:5173` (or the port you configured) and renders the baseline shell.

## Next Steps

- Implement the Express API wrapper that will consume the seeded [`mocks/db.json`](../mocks/db.json) dataset.
- Expand routing and feature modules following the structure outlined in the PRD (e.g., create `src/routes`, `src/lib`).
- Wire `start:all` once both frontend and server scripts are available.

With this foundation in place, trainees can begin adding routes, feature flows, and Cypress scenarios incrementally.

## Mock API Layer

The frontend ships with an MSW-powered mock API so feature work can start before the Express/json-server wrapper exists.

- [`src/mocks/db.ts`](src/mocks/db.ts) — deterministic fixtures and CRUD helpers
- [`src/mocks/handlers`](src/mocks/handlers) — REST handlers for auth, programs, applications
- [`src/mocks/utils.ts`](src/mocks/utils.ts) — latency/error simulation helpers (query/header driven)
- [`src/mocks/browser.ts`](src/mocks/browser.ts) — registers handlers with `setupWorker` for dev
- [`src/mocks/server.ts`](src/mocks/server.ts) — registers handlers with `setupServer` for Node-based tests
- [`src/main.tsx`](src/main.tsx) — bootstraps the worker when `import.meta.env.DEV && VITE_API_MOCKING !== 'off'`

### Usage

1. Ensure `.env.development` contains `VITE_API_MOCKING=on`.
2. Run `npm run dev` — MSW starts automatically and intercepts calls to `/auth/*`, `/programs`, `/applications`.
3. Toggle latency/errors via query params (`?__delay=250`, `?__error=500`) or headers (`x-sim-delay`, `x-sim-error`).
4. For Node-based tests, import helpers from [`src/mocks/setupTests.ts`](src/mocks/setupTests.ts) to start/stop the server and reset fixture state.

Set `VITE_API_MOCKING=off` to hit a real backend when the Express wrapper is ready. When working against json-server, keep [`mocks/db.json`](../mocks/db.json) in sync by re-running `npm run seed` whenever fixture changes are required; MSW continues to rely on the in-memory seeds defined in [`src/mocks/db/seeds.ts`](src/mocks/db/seeds.ts).
