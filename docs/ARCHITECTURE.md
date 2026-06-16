# Architecture

## Frontend

The frontend is a Next.js App Router application. Public routes live at `/login` and `/register`. Protected routes live under `src/app/(app)` and are wrapped by `AppShell`, which checks the Zustand auth store before rendering.

TanStack Query owns server state. React Hook Form and Zod validate auth, goal, habit, and task forms. Tailwind CSS provides the calm SaaS visual system with rounded cards, subtle borders, and soft purple/blue accents.

## Backend

The backend is a feature-based NestJS API. Each domain module owns its controller, service, and DTOs:

- Auth
- Users
- Dashboard
- Goals and milestones
- Habits and check-ins
- Tasks, subtasks, and comments
- Calendar
- Learning and study logs
- Journal
- Activity logs

Global guards enforce JWT authentication and role checks. Services scope all user-owned reads and writes by `userId`.

## Database

PostgreSQL stores all application data. Prisma provides migrations, generated types, and a seed script. Most user content uses `deletedAt` for soft delete.

## Authentication Flow

1. User registers or logs in.
2. Backend verifies credentials and returns user data, access token, and refresh token.
3. Frontend stores the session in Zustand persistence.
4. API requests attach `Authorization: Bearer <accessToken>`.
5. Backend validates tokens through the global `JwtAuthGuard`.

## Activity Log Flow

Domain services call `ActivityLogsService.create` after important actions such as registration, login, goal creation, milestone completion, habit check-in, task move/completion, learning creation, and journal creation.

## Deployment Structure

Docker Compose runs three services:

- `postgres`
- `backend`
- `frontend`

GitHub Actions installs dependencies, generates Prisma client, lints, runs backend unit tests, and builds both apps.
