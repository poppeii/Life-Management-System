# API Specification

Base URL: `http://localhost:3001`

All endpoints except `/auth/register`, `/auth/login`, and `/auth/refresh` require `Authorization: Bearer <accessToken>`.

## Auth

| Method | URL | Body |
| --- | --- | --- |
| POST | `/auth/register` | `{ "name": "Pat", "email": "pat@example.com", "password": "Password123" }` |
| POST | `/auth/login` | `{ "email": "pat@example.com", "password": "Password123" }` |
| POST | `/auth/logout` | none |
| POST | `/auth/refresh` | `{ "refreshToken": "..." }` |
| GET | `/auth/me` | none |

Success example:

```json
{ "user": { "id": "u1", "name": "Pat", "email": "pat@example.com", "role": "USER" }, "accessToken": "...", "refreshToken": "..." }
```

Error example:

```json
{ "statusCode": 401, "message": "Invalid email or password", "error": "Unauthorized" }
```

## Dashboard

| Method | URL | Description |
| --- | --- | --- |
| GET | `/dashboard/summary` | Returns life score, widgets, today views, learning summary, recent activity |

## Goals and Milestones

| Method | URL | Auth | Description |
| --- | --- | --- | --- |
| GET | `/goals?status=&category=&search=&sort=` | Yes | List goals |
| POST | `/goals` | Yes | Create goal |
| GET | `/goals/:id` | Yes | Goal detail |
| PATCH | `/goals/:id` | Yes | Update goal |
| DELETE | `/goals/:id` | Yes | Soft delete goal |
| POST | `/goals/:goalId/milestones` | Yes | Create milestone |
| PATCH | `/goals/:goalId/milestones/:milestoneId` | Yes | Update milestone |
| DELETE | `/goals/:goalId/milestones/:milestoneId` | Yes | Soft delete milestone |
| PATCH | `/goals/:goalId/milestones/:milestoneId/complete` | Yes | Complete milestone and recalculate progress |

Goal body:

```json
{ "title": "Build portfolio", "category": "CAREER", "priority": "HIGH", "status": "IN_PROGRESS", "targetDate": "2026-08-01" }
```

## Habits and Check-ins

| Method | URL | Description |
| --- | --- | --- |
| GET | `/habits` | List habits with stats |
| POST | `/habits` | Create habit |
| GET | `/habits/:id` | Habit detail |
| PATCH | `/habits/:id` | Update habit |
| DELETE | `/habits/:id` | Soft delete habit |
| PATCH | `/habits/:id/archive` | Archive habit |
| POST | `/habits/:habitId/check-ins` | Create or update daily check-in |
| GET | `/habits/:habitId/check-ins` | List check-ins |
| PATCH | `/habits/:habitId/check-ins/:checkInId` | Update check-in |
| DELETE | `/habits/:habitId/check-ins/:checkInId` | Delete check-in |

Check-in body:

```json
{ "checkInDate": "2026-06-16", "value": 1, "note": "Done gently" }
```

## Tasks and Kanban

| Method | URL | Description |
| --- | --- | --- |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Task detail |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Soft delete task |
| GET | `/tasks/kanban` | Group tasks by Kanban status |
| PATCH | `/tasks/:id/move` | Move task between columns |
| POST | `/tasks/:id/subtasks` | Create subtask |
| PATCH | `/tasks/:id/subtasks/:subtaskId` | Update subtask |
| DELETE | `/tasks/:id/subtasks/:subtaskId` | Delete subtask |
| POST | `/tasks/:id/comments` | Create comment |
| GET | `/tasks/:id/comments` | List comments |

Move body:

```json
{ "status": "DONE", "order": 1 }
```

## Calendar

| Method | URL | Description |
| --- | --- | --- |
| GET | `/calendar?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Normalized events from tasks, milestones, and habits |

Event example:

```json
{ "id": "task-t1", "type": "TASK", "title": "Plan week", "date": "2026-06-16T00:00:00.000Z", "status": "TODO", "category": "HIGH", "sourceId": "t1" }
```

## Learning

| Method | URL | Description |
| --- | --- | --- |
| GET | `/learning` | List learning items |
| POST | `/learning` | Create learning item |
| GET | `/learning/:id` | Learning detail |
| PATCH | `/learning/:id` | Update learning item |
| DELETE | `/learning/:id` | Soft delete learning item |
| POST | `/learning/:id/study-logs` | Add study log |
| GET | `/learning/:id/study-logs` | List study logs |

## Journal

| Method | URL | Description |
| --- | --- | --- |
| GET | `/journal?search=` | List journal entries |
| POST | `/journal` | Create or update same-day entry |
| GET | `/journal/:id` | Journal detail |
| PATCH | `/journal/:id` | Update entry |
| DELETE | `/journal/:id` | Soft delete entry |

## Activity Log

| Method | URL | Description |
| --- | --- | --- |
| GET | `/activity-logs` | Timeline of important actions |
