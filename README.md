# TaskFlow API

Team task management platform. JWT auth, project-based RBAC, task lifecycle enforcement.

## Auth
| Method | Path | Status |
|--------|------|--------|
| POST | /api/auth/register | ✅ Implemented |
| POST | /api/auth/login | ✅ Implemented |
| GET  | /api/auth/me | ✅ Implemented |
| POST | /api/auth/reset-password | ❌ 501 — v1.1 |
| POST | /api/auth/refresh | ❌ 501 — v1.1 |

## Projects
| Method | Path | Status |
|--------|------|--------|
| POST | /api/projects | ✅ Implemented |
| GET  | /api/projects | ✅ Implemented |
| GET  | /api/projects/:id | ✅ Implemented |
| PATCH | /api/projects/:id | ✅ Implemented |
| POST | /api/projects/:id/members | ✅ Implemented |
| DELETE | /api/projects/:id | ❌ 501 — v1.1 (REQ-012) |

## Tasks
| Method | Path | Status |
|--------|------|--------|
| POST | /api/tasks | ✅ Implemented |
| GET  | /api/tasks | ✅ Implemented |
| GET  | /api/tasks/:id | ✅ Implemented |
| PATCH | /api/tasks/:id/status | ✅ Implemented — transitions enforced |
| PATCH | /api/tasks/:id | ✅ Implemented |
| DELETE | /api/tasks/:id | ❌ 501 — v1.1 (REQ-019) |
| PATCH | /api/tasks/bulk | ❌ 501 — v1.1 (REQ-020) |

## Comments
| Method | Path | Status |
|--------|------|--------|
| POST | /api/tasks/:taskId/comments | ✅ Implemented |
| GET  | /api/tasks/:taskId/comments | ✅ Implemented |
| PATCH | /api/comments/:id | ❌ 501 — v1.1 (REQ-023) |
| DELETE | /api/comments/:id | ❌ 501 — v1.1 (REQ-024) |

## Notifications
All notification endpoints return 501. Planned for v1.1. (REQ-026 to REQ-030)

## Task Status Transitions
```
todo → in-progress, cancelled
in-progress → in-review, todo, cancelled
in-review → done, in-progress, cancelled
done → in-progress
cancelled → todo
```
