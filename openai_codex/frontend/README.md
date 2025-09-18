# Frontend (React + TypeScript)

React SPA that talks to the Laravel backend through REST or GraphQL.

## Getting started

1. Make sure Node.js 18+ and npm (or pnpm/yarn) are installed.
2. Initialize the app in this directory with your preferred tooling. For example, using Vite:
   ```bash
   cd frontend
   npm create vite@latest . -- --template react-ts
   npm install
   npm run dev
   ```
3. Configure environment variables (such as `VITE_API_BASE_URL`) to point to the Laravel API endpoint.
4. Keep shared types in a dedicated folder (e.g., `src/types`) to sync contracts with the backend.

Add routing, state management, and UI component libraries as the project grows.
