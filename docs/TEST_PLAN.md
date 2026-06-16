# Test Plan

## Scope

Testing covers the core portfolio flows: authentication, dashboard summary, goals, habits, tasks, and protected frontend routing.

## Strategy

- Unit tests validate service behavior with mocked Prisma dependencies.
- Integration tests are scaffolded for API endpoint coverage and can be enabled against a test PostgreSQL database.
- Playwright verifies public auth pages and protected-route redirects.

## Backend Unit Test Cases

- AuthService rejects duplicate registration email.
- AuthService rejects missing login user.
- GoalsService creates user-scoped goals and writes activity logs.
- HabitsService marks check-ins complete when value reaches target.
- TasksService moves tasks and records completion activity.
- DashboardService calculates life score from weighted signals.

## Backend Integration Test Cases

- Register user.
- Login user.
- Create goal.
- Create habit.
- Check in habit.
- Create task.
- Move task.
- Fetch dashboard summary.

## Frontend E2E Test Cases

- Register page renders.
- Login page renders.
- Unauthenticated users are redirected from Goals to Login.
- Unauthenticated users are redirected from Habits to Login.
- Unauthenticated users are redirected from Tasks to Login.
- Unauthenticated users are redirected from Journal to Login.

## Expected Result

All unit tests pass in CI. Full integration and authenticated Playwright flows should be run locally or in a future CI job with a seeded PostgreSQL database and backend service.
