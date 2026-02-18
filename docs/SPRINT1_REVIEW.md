# Sprint 1 Review - Task Manager API (Next.js)

## Delivered Features
- ✅ Create Task (POST /api/tasks)
- ✅ View All Tasks (GET /api/tasks with pagination)
- ✅ Update Task Status (PATCH /api/tasks/[id]/status)

## Demo

### POST /api/tasks
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete project", "priority": "high"}'
Response: 201 Created with task object
```

### GET /api/tasks
```bash
curl "http://localhost:3000/api/tasks?limit=5&offset=0"
Response: 200 OK with paginated results
```

### PATCH /api/tasks/[id]/status
```bash
curl -X PATCH http://localhost:3000/api/tasks/123/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
Response: 200 OK with updated task
```

## Metrics
- Stories completed: 3/3
- Test coverage: 87%
- Tests: 12 passing
- API endpoints: 3
