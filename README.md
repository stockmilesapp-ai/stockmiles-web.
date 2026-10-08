# stockmiles-web

Web app for StockMiles, a POS and inventory platform for retail businesses that restock through purchase trips. Built with React, TypeScript, Vite, Tailwind CSS v4, React Router and Zustand.

The app never talks to the database. It calls the StockMiles API through `/api` on its own origin.

## What you need

| Tool | Version |
|---|---|
| Node.js | 22 or newer |
| pnpm | 10 or newer |

## First-time setup

```bash
git clone https://github.com/stockmilesapp-ai/stockmiles-web..git stockmiles-web
cd stockmiles-web
pnpm install
```

## Developer commands

| Task | Command |
|---|---|
| Run the dev server | `pnpm dev` |
| Type-check and build | `pnpm build` |
| Lint | `pnpm lint` |
| Preview the production build | `pnpm preview` |

The dev server runs at `http://localhost:5173`.

## How the app reaches the API

The browser only calls `/api/*` on the web app's own origin, so there is no CORS setup and cookies stay first-party.

- **In development**, the Vite dev server forwards `/api/*` to the deployed API, `https://stockmiles-api.vercel.app`. To use another API, set `API_PROXY_TARGET`:

  ```bash
  API_PROXY_TARGET=http://localhost:8000 pnpm dev
  ```

- **In production**, `vercel.json` rewrites `/api/*` to the deployed API. It also sends every other path to `index.html`, so client-side routes such as `/status` work when opened directly.

## Project layout

```
src/
  app/                 App entry and the router that combines feature routes
  features/
    <feature>/
      <feature>.routes.tsx   Routes owned by the feature
      <feature>.store.tsx    Zustand store owned by the feature
      pages/                 Route-level components
      components/            Components used only by this feature
  shared/
    components/        Components used by more than one feature
    layouts/           Page shells (header, footer, outlet)
  index.css            Tailwind import and design tokens
public/                Static files served as-is
```

A feature has a routes file only if it has pages, and a store file only if it has state.

Import from `src` with the `@/` alias, for example `@/shared/components/Container`.

## Design tokens

Colours and fonts are defined once in `src/index.css` under `@theme` and used as Tailwind classes, for example `bg-surface`, `text-fg-muted` and `text-brand-green-500`.
