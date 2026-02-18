const { createMocks } = require('node-mocks-http');

// Mock NextResponse before importing the handlers
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init = {}) => ({
      status: init.status || 200,
      json: async () => data,
      headers: new Map()
    }))
  }
}));

// Mock the Task model
jest.mock('../../src/models/Task', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn()
}));

// Mock dbConnect
jest.mock('../../src/lib/dbConnect', () => jest.fn().mockResolvedValue());

const { NextResponse } = require('next/server');
const tasksHandler = require('../../src/app/api/tasks/route');
const taskByIdHandler = require('../../src/app/api/tasks/[id]/route');
const taskStatusHandler = require('../../src/app/api/tasks/[id]/status/route');

const Task = require('../../src/models/Task');

describe('Task Manager Integration Tests - Sprint 2 Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Task CRUD Workflow', () => {
    test('should create, read, update status, and delete a task', async () => {
      // Step 1: Create a task
      const newTask = {
        id: '1',
        title: 'Integration Test Task',
        description: 'Testing complete workflow',
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      Task.create.mockResolvedValue(newTask);

      const createRequest = {
        method: 'POST',
        json: async () => ({
          title: 'Integration Test Task',
          description: 'Testing complete workflow',
          priority: 'high'
        })
      };

      const createResponse = await tasksHandler.POST(createRequest);
      const createData = await createResponse.json();

      expect(createResponse.status).toBe(201);
      expect(createData).toEqual(newTask);
      expect(Task.create).toHaveBeenCalledWith({
        title: 'Integration Test Task',
        description: 'Testing complete workflow',
        priority: 'high'
      });

      // Step 2: Get all tasks (should include the new task)
      const mockTasksList = {
        rows: [newTask],
        count: 1
      };
      Task.findAll.mockResolvedValue(mockTasksList);

      const getRequest = {
        method: 'GET',
        url: 'http://localhost:3000/api/tasks'
      };

      const getResponse = await tasksHandler.GET(getRequest);
      const getData = await getResponse.json();

      expect(getResponse.status).toBe(200);
      expect(getData.tasks).toHaveLength(1);
      expect(getData.tasks[0]).toEqual(newTask);

      // Step 3: Update task status
      const updatedTask = {
        ...newTask,
        status: 'completed',
        updatedAt: new Date().toISOString()
      };
      
      const mockTaskInstance = {
        ...newTask,
        status: 'completed',
        save: jest.fn().mockResolvedValue(updatedTask)
      };
      
      Task.findByPk.mockResolvedValue(mockTaskInstance);

      const updateRequest = {
        method: 'PATCH',
        json: async () => ({ status: 'completed' })
      };

      const updateResponse = await taskStatusHandler.PATCH(updateRequest, {
        params: Promise.resolve({ id: '1' })
      });
      const updateData = await updateResponse.json();

      expect(updateResponse.status).toBe(200);
      expect(updateData.status).toBe('completed');
      expect(Task.findByPk).toHaveBeenCalledWith('1');

      // Step 4: Delete the task
      Task.findByPk.mockResolvedValue(mockTaskInstance);
      Task.destroy.mockResolvedValue(true);

      const deleteRequest = {
        method: 'DELETE'
      };

      const deleteResponse = await taskByIdHandler.DELETE(deleteRequest, {
        params: Promise.resolve({ id: '1' })
      });
      const deleteData = await deleteResponse.json();

      expect(deleteResponse.status).toBe(200);
      expect(deleteData.message).toBe('Task deleted successfully');
      expect(Task.destroy).toHaveBeenCalledWith('1');
    });
  });

  describe('Task Filtering and Pagination', () => {
    test('should filter tasks by priority', async () => {
      const highPriorityTask = {
        id: '1',
        title: 'High Priority Task',
        priority: 'high',
        status: 'pending'
      };

      const lowPriorityTask = {
        id: '2',
        title: 'Low Priority Task',
        priority: 'low',
        status: 'pending'
      };

      const mockFilteredTasks = {
        rows: [highPriorityTask],
        count: 2
      };
      
      Task.findAll.mockResolvedValue(mockFilteredTasks);

      const request = {
        method: 'GET',
        url: 'http://localhost:3000/api/tasks?priority=high'
      };

      const response = await tasksHandler.GET(request);
      const data = await response.json();

      expect(Task.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        priority: 'high'
      });
      expect(data.tasks).toHaveLength(1);
      expect(data.tasks[0].priority).toBe('high');
      expect(data.filters.priority).toBe('high');
    });

    test('should paginate tasks correctly', async () => {
      const mockTasks = {
        rows: [
          { id: '1', title: 'Task 1' },
          { id: '2', title: 'Task 2' }
        ],
        count: 25
      };
      
      Task.findAll.mockResolvedValue(mockTasks);

      const request = {
        method: 'GET',
        url: 'http://localhost:3000/api/tasks?limit=2&offset=10'
      };

      const response = await tasksHandler.GET(request);
      const data = await response.json();

      expect(Task.findAll).toHaveBeenCalledWith({
        limit: 2,
        offset: 10
      });
      expect(data.tasks).toHaveLength(2);
      expect(data.total).toBe(25);
    });

    test('should combine filtering and pagination', async () => {
      const mockTasks = {
        rows: [
          { id: '1', title: 'Medium Task 1', priority: 'medium' },
          { id: '2', title: 'Medium Task 2', priority: 'medium' }
        ],
        count: 15
      };
      
      Task.findAll.mockResolvedValue(mockTasks);

      const request = {
        method: 'GET',
        url: 'http://localhost:3000/api/tasks?priority=medium&limit=2&offset=5'
      };

      const response = await tasksHandler.GET(request);
      const data = await response.json();

      expect(Task.findAll).toHaveBeenCalledWith({
        limit: 2,
        offset: 5,
        priority: 'medium'
      });
      expect(data.tasks).toHaveLength(2);
      expect(data.total).toBe(15);
      expect(data.filters.priority).toBe('medium');
    });
  });

  describe('Task Status Management', () => {
    test('should update task from pending to completed', async () => {
      const task = {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Task.findByPk.mockResolvedValue(task);

      const request = {
        method: 'PATCH',
        json: async () => ({ status: 'completed' })
      };

      const response = await taskStatusHandler.PATCH(request, {
        params: Promise.resolve({ id: '1' })
      });
      const data = await response.json();

      expect(Task.findByPk).toHaveBeenCalledWith('1');
      expect(task.status).toBe('completed');
      expect(task.save).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(data.status).toBe('completed');
    });

    test('should update task from completed to pending', async () => {
      const task = {
        id: '1',
        title: 'Test Task',
        status: 'completed',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Task.findByPk.mockResolvedValue(task);

      const request = {
        method: 'PATCH',
        json: async () => ({ status: 'pending' })
      };

      const response = await taskStatusHandler.PATCH(request, {
        params: Promise.resolve({ id: '1' })
      });
      const data = await response.json();

      expect(Task.findByPk).toHaveBeenCalledWith('1');
      expect(task.status).toBe('pending');
      expect(task.save).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(data.status).toBe('pending');
    });
  });

  describe('Error Handling and Validation', () => {
    test('should return 404 when updating non-existent task status', async () => {
      Task.findByPk.mockResolvedValue(null);

      const request = {
        method: 'PATCH',
        json: async () => ({ status: 'completed' })
      };

      const response = await taskStatusHandler.PATCH(request, {
        params: Promise.resolve({ id: '999' })
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Task not found');
    });

    test('should return 404 when deleting non-existent task', async () => {
      Task.findByPk.mockResolvedValue(null);

      const request = {
        method: 'DELETE'
      };

      const response = await taskByIdHandler.DELETE(request, {
        params: Promise.resolve({ id: '999' })
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Task not found');
    });

    test('should validate task creation with missing title', async () => {
      const request = {
        method: 'POST',
        json: async () => ({
          description: 'Task without title',
          priority: 'high'
        })
      };

      const response = await tasksHandler.POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'title is required',
            param: 'title'
          })
        ])
      );
      expect(Task.create).not.toHaveBeenCalled();
    });

    test('should validate invalid priority in task creation', async () => {
      const request = {
        method: 'POST',
        json: async () => ({
          title: 'Test Task',
          priority: 'urgent'
        })
      };

      const response = await tasksHandler.POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'priority must be one of: low, medium, high',
            param: 'priority'
          })
        ])
      );
      expect(Task.create).not.toHaveBeenCalled();
    });

    test('should validate invalid status in status update', async () => {
      const request = {
        method: 'PATCH',
        json: async () => ({ status: 'in-progress' })
      };

      const response = await taskStatusHandler.PATCH(request, {
        params: Promise.resolve({ id: '1' })
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'status must be one of: pending, completed',
            param: 'status'
          })
        ])
      );
      expect(Task.findByPk).not.toHaveBeenCalled();
    });

    test('should validate pagination parameters', async () => {
      const request = {
        method: 'GET',
        url: 'http://localhost:3000/api/tasks?limit=-1&offset=-5'
      };

      const response = await tasksHandler.GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'limit must be at least 1',
            param: 'limit'
          }),
          expect.objectContaining({
            msg: 'offset must be at least 0',
            param: 'offset'
          })
        ])
      );
      expect(Task.findAll).not.toHaveBeenCalled();
    });

    test('should validate priority filter parameter', async () => {
      const request = {
        method: 'GET',
        url: 'http://localhost:3000/api/tasks?priority=urgent'
      };

      const response = await tasksHandler.GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'priority must be one of: low, medium, high',
            param: 'priority'
          })
        ])
      );
      expect(Task.findAll).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle empty task list', async () => {
      Task.findAll.mockResolvedValue({ rows: [], count: 0 });

      const request = {
        method: 'GET',
        url: 'http://localhost:3000/api/tasks'
      };

      const response = await tasksHandler.GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toHaveLength(0);
      expect(data.total).toBe(0);
    });

    test('should handle task with all optional fields', async () => {
      const taskWithAllFields = {
        id: '1',
        title: 'Complete Task',
        description: 'Full description',
        priority: 'low',
        status: 'pending',
        dueDate: '2024-12-31',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      Task.create.mockResolvedValue(taskWithAllFields);

      const request = {
        method: 'POST',
        json: async () => ({
          title: 'Complete Task',
          description: 'Full description',
          priority: 'low',
          dueDate: '2024-12-31'
        })
      };

      const response = await tasksHandler.POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(taskWithAllFields);
    });

    test('should use default priority when not provided', async () => {
      const taskWithDefaultPriority = {
        id: '1',
        title: 'Task without priority',
        priority: 'medium',
        status: 'pending'
      };
      
      Task.create.mockResolvedValue(taskWithDefaultPriority);

      const request = {
        method: 'POST',
        json: async () => ({
          title: 'Task without priority'
        })
      };

      const response = await tasksHandler.POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.priority).toBe('medium');
      expect(Task.create).toHaveBeenCalledWith({
        title: 'Task without priority',
        description: undefined,
        dueDate: undefined,
        priority: 'medium'
      });
    });
  });
});
