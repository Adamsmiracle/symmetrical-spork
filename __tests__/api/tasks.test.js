const { createMocks } = require('node-mocks-http');
const handler = require('../../src/app/api/tasks/route');

// Mock the Task model
jest.mock('../../src/models/Task', () => ({
  findAll: jest.fn(),
  create: jest.fn()
}));

// Mock dbConnect
jest.mock('../../src/lib/dbConnect', () => jest.fn().mockResolvedValue());

const Task = require('../../src/models/Task');

describe('/api/tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    test('should return paginated tasks', async () => {
      const mockTasks = {
        rows: [
          { id: '1', title: 'Task 1', status: 'pending' },
          { id: '2', title: 'Task 2', status: 'completed' }
        ],
        count: 2
      };
      
      Task.findAll.mockResolvedValue(mockTasks);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/tasks?limit=10&offset=0'
      });

      const response = await handler.GET(req);
      const data = await response.json();

      expect(Task.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0
      });
      expect(data).toEqual({
        total: 2,
        tasks: mockTasks.rows
      });
      expect(response.status).toBe(200);
    });

    test('should use default pagination values', async () => {
      Task.findAll.mockResolvedValue({ rows: [], count: 0 });

      const { req } = createMocks({
        method: 'GET',
        url: '/api/tasks'
      });

      const response = await handler.GET(req);

      expect(Task.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0
      });
    });

    test('should handle errors', async () => {
      Task.findAll.mockRejectedValue(new Error('Database error'));

      const { req } = createMocks({
        method: 'GET',
        url: '/api/tasks'
      });

      const response = await handler.GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch tasks');
    });
  });

  describe('POST', () => {
    test('should create new task', async () => {
      const newTask = {
        id: '1',
        title: 'New Task',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      };
      
      Task.create.mockResolvedValue(newTask);

      const requestBody = {
        title: 'New Task',
        description: 'Description',
        priority: 'high'
      };

      const { req } = createMocks({
        method: 'POST',
        body: requestBody,
        headers: {
          'content-type': 'application/json'
        }
      });

      const response = await handler.POST(req);
      const data = await response.json();

      expect(Task.create).toHaveBeenCalledWith(requestBody);
      expect(data).toEqual(newTask);
      expect(response.status).toBe(201);
    });

    test('should return 400 for missing title', async () => {
      const requestBody = {
        description: 'No title task'
      };

      const { req } = createMocks({
        method: 'POST',
        body: requestBody,
        headers: {
          'content-type': 'application/json'
        }
      });

      const response = await handler.POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Title is required');
      expect(Task.create).not.toHaveBeenCalled();
    });

    test('should handle create errors', async () => {
      Task.create.mockRejectedValue(new Error('Create failed'));

      const { req } = createMocks({
        method: 'POST',
        body: { title: 'Test Task' },
        headers: {
          'content-type': 'application/json'
        }
      });

      const response = await handler.POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create task');
    });
  });
});
