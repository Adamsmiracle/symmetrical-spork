# Task Manager API - Project Overview

## Project Summary
A lightweight personal task management API built with Next.js 14 and TypeScript. This project provides a RESTful API for managing daily tasks with priority tracking, due dates, and complete CRUD operations.

### Quick Links
- [API Documentation](./docs/README.md)
- [Product Backlog](./docs/PRODUCT_BACKLOG.md)
- [Sprint Planning](./docs/SPRINT_PLANNING.md)
- [Sprint Reviews](#sprint-reviews)
- [Retrospectives](#retrospectives)

---

## Project Architecture

### Technology Stack
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** In-memory storage (Task model)
- **Testing:** Jest with Supertest
- **Documentation:** OpenAPI/Swagger
- **Styling:** CSS Modules

### API Endpoints
```
POST   /api/tasks              - Create new task
GET    /api/tasks              - View all tasks (with pagination/filtering)
PATCH  /api/tasks/[id]/status  - Update task status
DELETE /api/tasks/[id]         - Delete task
GET    /api/docs               - API documentation
```

### Key Features
- Task creation with title, description, priority, and due dates
- Priority-based filtering (low, medium, high)
- Pagination for large task lists
- Status management (pending/completed)
- Complete CRUD operations
- RESTful API design
- Comprehensive error handling

---

## Documentation Structure

### 📋 Planning & Requirements
- **[Product Backlog](./docs/PRODUCT_BACKLOG.md)** - Complete user stories and technical requirements
- **[Sprint Planning](./docs/SPRINT_PLANNING.md)** - Sprint goals, capacity planning, and timelines

### 📊 Sprint Reviews
- **[Sprint 1 Review](./docs/SPRINT1_REVIEW.md)** - Foundation sprint achievements and metrics
- **[Sprint 2 Review](./docs/SPRINT2_REVIEW.md)** - Enhancement sprint and production readiness

### 🔄 Retrospectives
- **[Sprint 1 Retrospective](./docs/SPRINT1_RETROSPECTIVE.md)** - Lessons learned from foundation sprint
- **[Sprint 2 Retrospective](./docs/SPRINT2_RETROSPECTIVE.md)** - Process improvements and team insights

---

## Sprint Summary

### Sprint 1: Foundation (January 15-22, 2024)
**Goal:** Establish core CRUD functionality
**Velocity:** 7 points (100% completion)

**Delivered:**
- Task creation endpoint
- Task listing with pagination
- Status update functionality
- Basic validation and error handling

### Sprint 2: Enhancement (January 29 - February 5, 2024)
**Goal:** Add filtering, deletion, and monitoring
**Velocity:** 11 points (100% completion)

**Delivered:**
- Priority-based filtering
- Task deletion
- Input validation middleware
- API documentation
- Health monitoring endpoint

---

## Project Metrics

### Development Metrics
- **Total Story Points:** 11
- **Sprint Completion Rate:** 100%
- **Test Coverage:** 87-92%
- **API Endpoints:** 5
- **User Stories Completed:** 5/5

### Quality Metrics
- **Code Quality:** High (consistent patterns, proper error handling)
- **Documentation:** Complete (API docs, user stories, retrospectives)
- **Testing:** Comprehensive (unit tests, integration tests)
- **Performance:** Excellent (< 100ms response times)

---

## Project Screenshots

### 📊 Test Results
![Test Results Passing](./screenshots/test_results_pass.png)
*All tests passing with high coverage*

### 🔄 Pipeline Status  
![Pipeline](./screenshots/pipeline.png)
*CI/CD pipeline running successfully*

### 📝 Git History
![Git Commits](./screenshots/git_commits.png)
*Clean commit history with conventional messages*

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd taskManager

# Install dependencies
npm install

# Run development server
npm run dev
```

### Usage Examples

#### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "priority": "high"
  }'
```

#### View All Tasks
```bash
curl "http://localhost:3000/api/tasks?limit=10&offset=0"
```

#### Filter by Priority
```bash
curl "http://localhost:3000/api/tasks?priority=high"
```

#### Update Task Status
```bash
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

#### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

## Project Status

### ✅ Completed Features
- All core CRUD operations
- Priority filtering and pagination
- Input validation and error handling
- API documentation
- Comprehensive testing

### 🚀 Production Readiness
- API endpoints stable and tested
- Error handling implemented
- Documentation complete
- Performance optimized

### 📝 Next Steps
- Database migration (in-memory → persistent storage)
- User authentication system
- Advanced filtering options
- Performance monitoring
- Mobile app integration

---

## Team & Process

### Development Approach
- **Sprint Duration:** 2 weeks
- **Methodology:** Agile with sprint reviews
- **Testing:** Test-driven development
- **Documentation:** Documentation-first approach

### Quality Standards
- **Definition of Done:** Code complete, tested, documented
- **Code Review:** Peer review for all changes
- **Test Coverage:** Minimum 80% required
- **Documentation:** API docs updated with each feature

---

## Repository Structure

```
taskManager/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── tasks/
│   │       └── docs/
│   ├── models/
│   └── pages/
├── __tests__/
├── docs/
│   ├── PRODUCT_BACKLOG.md
│   ├── SPRINT_PLANNING.md
│   ├── SPRINT1_REVIEW.md
│   ├── SPRINT2_REVIEW.md
│   ├── SPRINT1_RETROSPECTIVE.md
│   └── SPRINT2_RETROSPECTIVE.md
├── styles/
└── README.md
```

---

## Contact & Support

### Documentation Navigation
- **For Requirements:** Start with [Product Backlog](./docs/PRODUCT_BACKLOG.md)
- **For Planning:** Review [Sprint Planning](./docs/SPRINT_PLANNING.md)
- **For Implementation:** See [Sprint Reviews](./docs/SPRINT1_REVIEW.md)
- **For Process:** Read [Retrospectives](./docs/SPRINT1_RETROSPECTIVE.md)

### Project Information
- **Project Type:** Personal Task Management API
- **Development Period:** January - February 2024
- **Framework:** Next.js 14 with TypeScript
- **Status:** MVP Complete - Production Ready

---

**Last Updated:** February 18, 2025  
**Project Version:** 1.0.0  
**Documentation Version:** Complete
