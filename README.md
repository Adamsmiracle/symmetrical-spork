# Task Manager API (Next.js)

A lightweight personal task management API built with Next.js 14 and TypeScript. This project provides a RESTful API for managing daily tasks with priority tracking, due dates, and complete CRUD operations.

## 📋 Project Overview

**Start here:** [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Complete project documentation and navigation

## Quick Links

- **[Project Overview](./PROJECT_OVERVIEW.md)** - Main documentation hub
- **[Product Backlog](./docs/PRODUCT_BACKLOG.md)** - User stories and requirements
- **[API Documentation](./docs/README.md)** - Technical API reference
- **[Sprint Planning](./docs/SPRINT_PLANNING.md)** - Sprint goals and timelines
- **[Sprint Reviews](./docs/SPRINT1_REVIEW.md)** - Sprint achievements and metrics
- **[Retrospectives](./docs/SPRINT1_RETROSPECTIVE.md)** - Lessons learned and improvements

## 🚀 Getting Started

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

### API Usage Examples

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

## 📊 Project Status

### 📸 Project Screenshots

#### Test Results
![Test Results Passing](./screenshots/test_results_pass.png)
*All tests passing with high coverage*

#### CI/CD Pipeline
![Pipeline](./screenshots/pipeline.png)
*GitHub Actions pipeline running successfully*

#### Git History
![Git Commits](./screenshots/git_commits.png)
*Clean commit history with conventional messages*

### ✅ Completed Features
- Complete CRUD operations for tasks
- Priority-based filtering and pagination
- Input validation and error handling
- Comprehensive API documentation
- High test coverage (87-92%)

### 🎯 Technology Stack
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** In-memory storage (Task model)
- **Testing:** Jest with Supertest
- **Documentation:** OpenAPI/Swagger
- **Styling:** CSS Modules

### 📁 Repository Structure
```
taskManager/
├── src/
│   ├── app/
│   │   └── api/
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
├── PROJECT_OVERVIEW.md
└── README.md
```

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📖 Documentation

For complete project documentation, including sprint planning, reviews, and retrospectives, please refer to the **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** file.

---

**Project Version:** 1.0.0  
**Last Updated:** February 18, 2025  
**Status:** MVP Complete - Production Ready
