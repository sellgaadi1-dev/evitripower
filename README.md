# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

This project uses [bun](https://bun.sh) (`bun install`, `bun run dev`); `npm install`
currently fails on the `overrides` entry in `package.json`.

## Deploying to Vercel

1. Import this GitHub repo in Vercel. No settings need changing: bun is detected from
   `bun.lock`, and the build auto-targets Vercel.
2. In the Vercel project, open **Storage → Create Database → Neon** (free plan) and connect
   it to the project. This sets `DATABASE_URL`.
3. Redeploy (environment variables only reach new deployments), then open
   `/api/health`. It should return `{"ok":true,"database":"connected"}` and creates the
   `enquiries` table if it is missing.

Contact-form enquiries are saved to the `enquiries` table, which you can browse from the
Vercel Storage tab or Neon's SQL editor. The form is public (no sign-in), validates every
field as the visitor types, re-checks on the server, and ignores bots via a hidden
honeypot field. If saving fails, the visitor is offered a pre-filled email to
Team@evtripower.com instead, so no lead is lost.

Images are mirrored into `public/__l5e/assets-v1/` so they load outside Lovable's
hosting. If you add or replace an image in Lovable, copy the new file there too.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
