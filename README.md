# LifeOS

LifeOS is a calm personal life management system for organizing goals, habits, tasks, learning, and daily reflection in one structured place.

## Problem Statement

Most productivity tools reward urgency and overload. LifeOS focuses on clarity: it gives users a daily operating view without adding pressure.

## Features

- JWT authentication with refresh tokens
- Protected dashboard with life score, goals, habits, tasks, learning, and activity widgets
- Goals with milestones and automatic progress updates
- Habits with daily check-ins, streaks, and success rate
- Tasks with Kanban board, subtasks, comments, due dates, and priorities
- Calendar month view for tasks, milestones, and habit reminders
- Learning tracker with study logs
- Journal with one entry per day
- Activity log timeline
- PostgreSQL, Prisma migrations, seed data, Docker Compose, CI, and tests

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, TanStack Query, Zustand
- Backend: NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT, class-validator
- Testing: Jest, Supertest test placeholder, Playwright
- DevOps: Docker, Docker Compose, GitHub Actions

## Architecture

The repository is a monorepo with `frontend`, `backend`, and `docs` folders. The frontend calls the backend REST API directly using a typed fetch wrapper and stores the authenticated session in Zustand. The backend uses feature-based Nest modules and Prisma for all database access.

## Folder Structure

```text
lifeos/
  frontend/
  backend/
  docs/
  docker-compose.yml
  .github/workflows/ci.yml
```

## Run Locally

```bash
cd lifeos
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up -d postgres
cd backend && npx prisma migrate dev && npm run prisma:seed
cd ..
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:3001`

Demo login after seeding:

- Email: `demo@lifeos.dev`
- Password: `Password123!`

## Run With Docker

```bash
cd lifeos
docker compose up --build
```

## Environment Variables

Backend variables are documented in `backend/.env.example`.
Frontend variables are documented in `frontend/.env.example`.

## Tests

```bash
cd lifeos
npm run test --workspace backend
npm run test:e2e --workspace frontend
```

## Screenshots

Screenshots placeholder: add dashboard, Kanban, habit check-in, and journal images after deploying a demo.

## Demo Link

Demo link placeholder: add hosted URL after deployment.

## Future Improvements

- Production refresh-token rotation with HTTP-only cookies
- Rich drag-and-drop Kanban ordering
- Notification/reminder module
- Admin dashboard
- More exhaustive integration tests against ephemeral PostgreSQL
