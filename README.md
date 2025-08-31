# CodePath WEB103 Prework

This repository contains my submission for the CodePath WEB103 prework.

Use this README to understand the app, run it locally, and view what user stories are completed. Sections marked with TODO are placeholders for you to update with details from your implementation.

---

## Table of Contents
- Overview
- Demo
- Features
- Tech Stack
- Project Structure
- Prerequisites
- Local Setup
- Environment Variables
- Running Tests
- Linting and Formatting
- Deployment
- API Endpoints (if applicable)
- User Stories
- Stretch Features
- Known Issues
- Resources
- Acknowledgements
- License

---

## Overview

- App Name: TODO
- Short Description: TODO — a brief description of what your app does and who it’s for.
- Status: In Progress / Complete
- Course: CodePath WEB103 Prework
- Author: @salman-khan03

### Objectives
- Demonstrate familiarity with modern web tooling and workflows.
- Implement core features required by the prework.
- Deploy the app and document the setup process.

---

## Demo

- Deployed App: TODO (Add your production URL here, e.g., Vercel/Netlify/Render link)
- GIF Walkthrough(s): Add GIFs that show your app’s required user stories.

Tips:
- Record with LICEcap or Kap.
- Keep each GIF under ~10MB.
- Place the files in a walkthrough/ folder and reference them below.

Example:
- walkthrough/feature-1.gif — User can create an item
- walkthrough/feature-2.gif — User can update/delete an item

---

## Features

- TODO: High-level bullet list of the main features
  - Example: User authentication (sign up, log in, log out)
  - Example: CRUD operations on items
  - Example: Responsive design and accessible UI

---

## Tech Stack

Core:
- Frontend: TODO (e.g., React + Vite, Next.js, Vanilla JS)
- Styling: TODO (e.g., Tailwind CSS, CSS Modules, Chakra UI)
- Backend: TODO (e.g., Node.js + Express, Next.js API routes)
- Database: TODO (e.g., PostgreSQL, MongoDB, Supabase, Firebase)

Tooling:
- Package Manager: npm / pnpm / yarn
- Linting/Formatting: ESLint, Prettier
- Testing: TODO (e.g., Jest, Vitest, React Testing Library)
- Deployment: TODO (e.g., Vercel, Netlify, Render, Railway)

---

## Project Structure

If single app:
```
.
├─ src/
├─ public/
├─ .env.example
├─ package.json
└─ README.md
```

If full stack (client + server):
```
.
├─ client/
│  ├─ src/
│  ├─ public/
│  └─ package.json
├─ server/
│  ├─ src/
│  └─ package.json
├─ .env.example
└─ README.md
```

Update this section to match your repository layout, noting key directories and responsibilities.

---

## Prerequisites

- Node.js: >= 18.x
- npm/pnpm/yarn: latest
- (Optional) Database service running locally or a cloud DB URL
- (Optional) Git LFS if storing large media files

---

## Local Setup

Single app:
1. Clone the repo:
   - git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   - cd YOUR_REPO
2. Install dependencies:
   - npm install
3. Configure environment:
   - cp .env.example .env
   - Fill in values in .env
4. Start dev server:
   - npm run dev
5. Visit:
   - http://localhost:5173 or http://localhost:3000 (depends on your setup)

Client + server:
1. Clone the repo:
   - git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   - cd YOUR_REPO
2. Install dependencies:
   - cd client && npm install
   - cd ../server && npm install
3. Configure environment:
   - cp .env.example .env (top-level or per app if applicable)
   - Add DB/API keys
4. Start servers:
   - In one terminal: cd server && npm run dev
   - In another: cd client && npm run dev
5. Visit:
   - http://localhost:5173 (client) and http://localhost:3001 (server) or as configured

---

## Environment Variables

Copy .env.example to .env and fill in values:
- VITE_API_BASE_URL=...
- DATABASE_URL=...
- JWT_SECRET=...
- NEXT_PUBLIC_... or VITE_... for client-exposed variables

Never commit secrets. Use .gitignore to exclude .env.

---

## Running Tests

- Unit/Component tests:
  - npm test or npm run test
- E2E tests (if any):
  - TODO (e.g., Playwright/Cypress commands)

---

## Linting and Formatting

- Lint:
  - npm run lint
- Format:
  - npm run format

Configure pre-commit hooks (optional):
- Husky + lint-staged to enforce code quality.

---

## Deployment

Choose one of the following (or your own):

Vercel (frontend or Next.js full stack):
- Push to GitHub
- Import repo on Vercel
- Add environment variables
- Set build command (e.g., npm run build) and output directory (e.g., dist/.next)

Netlify (frontend):
- Connect GitHub repo
- Build: npm run build
- Publish directory: dist

Render/Railway (backend):
- Create a new web service
- Set start command: npm start
- Add environment variables
- Add a persistent database if needed

Remember to update CORS and API base URLs for production.

---

## API Endpoints (if applicable)

Document your backend endpoints. Example:
- GET /api/items — List items
- POST /api/items — Create item
- PATCH /api/items/:id — Update item
- DELETE /api/items/:id — Delete item
- Auth routes (if any): /api/auth/register, /api/auth/login, /api/auth/logout

Include sample requests/responses where helpful.

---

## User Stories

Required (mark with [x] when complete):
-
