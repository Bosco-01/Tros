# Trios Admin

This project is a modern web application built with Next.js, React, TypeScript, and Tailwind CSS. It was bootstrapped with create-next-app using the App Router structure and the new Tailwind-based template.

## Project Purpose

This repository is intended to serve as a starter/admin frontend project. Use it as a foundation for building internal dashboards, management screens, or other UI-driven web applications.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ESLint
- App Router architecture

## Project Structure

```text
.
├── public/                # Static assets
├── src/
│   └── app/
│       ├── globals.css    # Tailwind and global styles
│       ├── layout.tsx     # Root layout
│       └── page.tsx       # Home page
├── package.json           # Scripts and dependencies
├── tsconfig.json          # TypeScript config
├── next.config.ts         # Next.js config
├── postcss.config.mjs     # PostCSS/Tailwind config
└── eslint.config.mjs     # ESLint config
```

## Prerequisites

Make sure you have the following installed:

- Node.js 18+ (recommended: latest LTS)
- npm

## Installation

From the project root, install dependencies:

```bash
npm install
```

## Development

Start the local development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev     # start development server
npm run build   # create production build
npm run start   # run production build locally
npm run lint    # run ESLint checks
```

## Styling

This project uses Tailwind CSS via the App Router setup. Global styles are defined in [src/app/globals.css](src/app/globals.css), and Tailwind classes should be used for UI styling.

## Important Development Notes for an Agent

When making changes to this project:

- Prefer the existing App Router structure under [src/app](src/app).
- Keep components simple, typed, and reusable.
- Use TypeScript for new code.
- Prefer Tailwind utility classes over custom CSS where possible.
- Preserve existing project conventions unless a change is explicitly requested.
- If adding new pages, create them under [src/app](src/app) using the pattern `src/app/<route>/page.tsx`.
- If adding shared UI, place reusable components in a logical folder such as `src/components` if needed.
- Avoid unnecessary dependency changes unless clearly requested.

## Current Starter State

The app currently includes:

- A default home page in [src/app/page.tsx](src/app/page.tsx)
- A global layout in [src/app/layout.tsx](src/app/layout.tsx)
- Tailwind-enabled global styles in [src/app/globals.css](src/app/globals.css)

## Common Tasks

### Add a new page

Create a new folder under [src/app](src/app) with a `page.tsx` file.

Example:

```text
src/app/dashboard/page.tsx
```

### Add a new component

Create a component in a logical location such as:

```text
src/components/YourComponent.tsx
```

### Update styling

Edit [src/app/globals.css](src/app/globals.css) for global styling, or use Tailwind utility classes directly in components.

## Deployment

This app can be deployed to Vercel or any host that supports Next.js. For Vercel, the standard Next.js deployment flow applies.

## Notes

- The project is intentionally lightweight and clean as a starting point.
- If you need to add authentication, data fetching, state management, or a backend, that can be introduced incrementally.
- For future work, keep the README updated as the project evolves.
