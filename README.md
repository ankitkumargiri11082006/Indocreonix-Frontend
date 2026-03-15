# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Live Chatbot Setup

1. Copy `.env.example` to `.env`.
2. For ChatGPT, set `VITE_CHAT_PROVIDER=openai` and add `VITE_OPENAI_API_KEY`.
3. Optionally change `VITE_CHAT_MODEL` (example: `gpt-4o-mini`).
4. Optional fallback: set `VITE_GEMINI_API_KEY` with `VITE_CHAT_PROVIDER=gemini`.
5. Optional fallback: set `VITE_OPENROUTER_API_KEY` with `VITE_CHAT_PROVIDER=openrouter`.
6. Start the app with `npm run dev`.

The website assistant uses a live AI chat request and website context to answer customer questions about services, pages, careers, and contact details.

## Admin + Backend Connection

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL=http://localhost:5000/api` (or your backend URL).
3. Run frontend: `npm run dev`.
4. Run backend separately from `../Backend` with `npm run dev`.

### Auth Routes

- `/login`
- `/signup`

### Admin Routes

- `/admin`
- `/admin/analytics`
- `/admin/users`
- `/admin/leads`
- `/admin/content`
- `/admin/media`
- `/admin/integrations`
- `/admin/settings`
- `/admin/profile`
