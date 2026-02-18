# Product Backlog - Task Manager API

## Product Vision
A lightweight personal task management API built with Next.js that helps individuals organize daily tasks with priority tracking and due date management, accessible via a simple REST interface.

## Epics
- **EPIC-1**: Core Task Management (Sprint 1)
- **EPIC-2**: Task Organization & Monitoring (Sprint 2)

---

## User Stories

### US-01: Create a new task
| Field | Value |
|-------|-------|
| **As a** | user |
| **I want** | to create a new task with a title and description |
| **So that** | I can capture things I need to do |
| **Priority** | High |
| **Estimate** | 3 story points |
| **Sprint** | Sprint 1 |

**Acceptance Criteria:**
- [x] Endpoint: POST /api/tasks
- [x] Request body includes title (required), description (optional), dueDate (optional), priority (optional, default: medium)
- [x] Returns 201 Created with the created task object
- [x] Returns 400 Bad Request if title is missing
- [x] Task is persisted in database

---

### US-02: View all tasks
| Field | Value |
|-------|-------|
| **As a** | user |
| **I want** | to see a list of all my tasks |
| **So that** | I can review what needs to be done |
| **Priority** | High |
| **Estimate** | 2 story points |
| **Sprint** | Sprint 1 |

**Acceptance Criteria:**
- [x] Endpoint: GET /api/tasks
- [x] Returns 200 OK with array of tasks
- [x] Each task includes id, title, description, dueDate, priority, status, createdAt
- [x] Empty array returned if no tasks exist
- [x] Results are paginated (limit/offset query parameters)

---

### US-03: Update task status
| Field | Value |
|-------|-------|
| **As a** | user |
| **I want** | to mark a task as complete or incomplete |
| **So that** | I can track my progress |
| **Priority** | Medium |
| **Estimate** | 2 story points |
| **Sprint** | Sprint 1 |

**Acceptance Criteria:**
- [x] Endpoint: PATCH /api/tasks/[id]/status
- [x] Request body includes status (completed/pending)
- [x] Returns 200 OK with updated task
- [x] Returns 404 Not Found if task doesn't exist
- [x] Returns 400 Bad Request if invalid status value

---

### US-04: Filter tasks by priority
| Field | Value |
|-------|-------|
| **As a** | user |
| **I want** | to filter tasks by priority level |
| **So that** | I can focus on what's most important |
| **Priority** | Medium |
| **Estimate** | 3 story points |
| **Sprint** | Sprint 2 |

**Acceptance Criteria:**
- [x] Endpoint: GET /api/tasks?priority=high
- [x] Returns tasks matching the specified priority
- [x] Priority values: low, medium, high
- [x] Returns 200 OK with filtered results
- [x] Returns 400 for invalid priority values
- [x] Empty array if no matches

---

### US-05: Delete a task
| Field | Value |
|-------|-------|
| **As a** | user |
| **I want** | to delete a task I no longer need |
| **So that** | I can keep my list clean |
| **Priority** | Low |
| **Estimate** | 1 story point |
| **Sprint** | Sprint 2 |

**Acceptance Criteria:**
- [x] Endpoint: DELETE /api/tasks/[id]
- [x] Returns 204 No Content on successful deletion
- [x] Returns 404 Not Found if task doesn't exist
- [x] Task is removed from database

---

## Technical Debt & Improvements

### TEC-01: Input Validation Middleware
| Field | Value |
|-------|-------|
| **Description** | Add request validation for all endpoints |
| **Priority** | High |
| **Sprint** | Sprint 2 |

**Acceptance Criteria:**
- [x] Validate query parameters (priority, limit, offset)
- [x] Validate request body fields
- [x] Return 400 with detailed error messages

### TEC-02: Database Migrations
| Field | Value |
|-------|-------|
| **Description** | Implement version-controlled database schema changes |
| **Priority** | High |
| **Sprint** | Sprint 2 |

**Acceptance Criteria:**
- [x] Migration files for schema creation
- [x] Rollback capability
- [x] Automated migrations in CI/CD

### TEC-03: Health Monitoring
| Field | Value |
|-------|-------|
| **Description** | Add health check endpoint and logging |
| **Priority** | Medium |
| **Sprint** | Sprint 2 |

**Acceptance Criteria:**
-  GET /api/health endpoint
-  Database connection check
-  Structured logging
-  Request logging middleware

---

## Backlog Summary

| ID | Story | Priority | Estimate | Status |
|----|-------|----------|----------|--------|
| US-01 | Create task | High | 3 | Done |
| US-02 | View tasks | High | 2 | Done |
| US-03 | Update status | Medium | 2 | Done |
| US-04 | Filter by priority | Medium | 3 | Done |
| US-05 | Delete task | Low | 1 | Done |

**Total Story Points:** 11  
**Completed:** 5/5 stories (100%)
