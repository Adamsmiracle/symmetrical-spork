const { createMocks } = require('node-mocks-http');
const handler = require('../../../src/app/api/tasks/[id]/status/route');

// Mock the Task model
jest.mock('../../../src/models/Task', () => ({
  findByPk: jest.fn()
}));

// Mock dbConnect
jest.mock('../../../src/lib/dbConnect', () => jest.fn().mockResolvedValue());

const Task = require('../../../src/models/Task');

describe('/api/tasks/[id]/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH', () => {
    test('should update task status successfully', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };
      
      mockTask.save.mockResolvedValue({
        ...mockTask,
        status: 'completed'
      });

      Task.findByPk.mockResolvedValue(mockTask);

      const requestBody = { status: 'completed' };

      const { req } = createMocks({
        method: 'PATCH',
        body: requestBody,
        headers: {
          'content-type': 'application/json'
        }
      });

      const params = Promise.resolve({ id: '1' });

      const response = await handler.PATCH(req, { params });
      const data = await response.json();

      expect(Task.findByPk).toHaveBeenCalledWith('1');
      expect(mockTask.status).toBe('completed');
      expect(mockTask.save).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(data.status).toBe('completed');
    });

    test('should return 400 for invalid status', async () => {
      const requestBody = { status: 'invalid' };

      const { req } = createMocks({
        method: 'PATCH',
        body: requestBody,
        headers: {
          'content-type': 'application/json'
        }
      });

      const params = Promise.resolve({ id: '1' });

      const response = await handler.PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid status. Must be pending or completed');
      expect(Task.findByPk).not.toHaveBeenCalled();
    });

    test('should return 404 for non-existent task', async () => {
      Task.findByPk.mockResolvedValue(null);

      const requestBody = { status: 'completed' };

      const { req } = createMocks({
        method: 'PATCH',
        body: requestBody,
        headers: {
          'content-type': 'application/json'
        }
      });

      const params = Promise.resolve({ id: '999' });

      const response = await handler.PATCH(req, { params });
      const data = await response.json();

      expect(Task.findByPk).toHaveBeenCalledWith('999');
      expect(response.status).toBe(404);
      expect(data.error).toBe('Task not found');
    });

    test('should handle save errors', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        status: 'pending',
        save: jest.fn().mockRejectedValue(new Error('Save failed'))
      };
      
      Task.findByPk.mockResolvedValue(mockTask);

      const requestBody = { status: 'completed' };

      const { req } = createMocks({
        method: 'PATCH',
        body: requestBody,
        headers: {
          'content-type': 'application/json'
        }
      });

      const params = Promise.resolve({ id: '1' });

      const response = await handler.PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update task');
    });

    test('should handle database connection errors', async () => {
      Task.findByPk.mockRejectedValue(new Error('Database error'));

      const requestBody = { status: 'completed' };

      const { req } = createMocks({
        method: 'PATCH',
        body: requestBody,
        headers: {
          'content-type': 'application/json'
        }
      });

      const params = Promise.resolve({ id: '1' });

      const response = await handler.PATCH(req, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update task');
    });
  });
});
