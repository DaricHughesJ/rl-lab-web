# MechLab Web

Marketing site, beta onboarding, Supabase authentication, and player dashboard for MechLab.

## Account setup

1. Create or select a Supabase project and enable Email authentication.
2. Add the local and production website URLs under Authentication → URL Configuration.
3. Copy `.env.example` to `.env.local` and fill in the project URL and **publishable** browser key.
4. Run `pnpm install` and `pnpm dev`.

The browser must never receive a Supabase secret or `service_role` key. Beta profile fields are stored as user metadata for onboarding and display only; they are not used for authorization.

## Development

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
