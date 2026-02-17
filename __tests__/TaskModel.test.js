const TaskModel = require('../src/models/Task');

describe('TaskModel', () => {
  beforeEach(() => {
    // Clear in-memory tasks before each test
    TaskModel.tasks = [];
    TaskModel.nextId = 1;
  });

  describe('Constructor', () => {
    test('should create task with required fields', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high'
      };
      
      const task = new TaskModel(taskData);
      
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.priority).toBe('high');
      expect(task.status).toBe('pending');
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    test('should use default values for optional fields', () => {
      const taskData = { title: 'Minimal Task' };
      
      const task = new TaskModel(taskData);
      
      expect(task.description).toBe('');
      expect(task.priority).toBe('medium');
      expect(task.status).toBe('pending');
      expect(task.dueDate).toBeNull();
    });

    test('should generate sequential IDs', () => {
      const task1 = new TaskModel({ title: 'Task 1' });
      const task2 = new TaskModel({ title: 'Task 2' });
      
      expect(task1.id).toBe('1');
      expect(task2.id).toBe('2');
    });
  });

  describe('findAll', () => {
    test('should return empty result when no tasks exist', async () => {
      const result = await TaskModel.findAll();
      
      expect(result.rows).toEqual([]);
      expect(result.count).toBe(0);
    });

    test('should return all tasks sorted by creation date (newest first)', async () => {
      const task1 = await TaskModel.create({ title: 'First Task', priority: 'low' });
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      const task2 = await TaskModel.create({ title: 'Second Task', priority: 'high' });
      
      const result = await TaskModel.findAll();
      
      expect(result.rows).toHaveLength(2);
      expect(result.count).toBe(2);
      expect(result.rows[0].title).toBe('Second Task'); // Newest first
      expect(result.rows[1].title).toBe('First Task');
    });

    test('should apply pagination correctly', async () => {
      for (let i = 1; i <= 5; i++) {
        await TaskModel.create({ title: `Task ${i}` });
      }
      
      const result = await TaskModel.findAll({ limit: 2, offset: 1 });
      
      expect(result.rows).toHaveLength(2);
      expect(result.count).toBe(5);
      expect(result.rows[0].title).toBe('Task 4'); // Sorted newest first, then paginated
      expect(result.rows[1].title).toBe('Task 3');
    });
  });

  describe('findByPk', () => {
    test('should find task by ID', async () => {
      const createdTask = await TaskModel.create({ title: 'Find Me' });
      
      const foundTask = await TaskModel.findByPk(createdTask.id);
      
      expect(foundTask).not.toBeNull();
      expect(foundTask.title).toBe('Find Me');
      expect(foundTask.id).toBe(createdTask.id);
    });

    test('should return null for non-existent ID', async () => {
      const foundTask = await TaskModel.findByPk('999');
      
      expect(foundTask).toBeNull();
    });
  });

  describe('create', () => {
    test('should create new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        priority: 'high'
      };
      
      const task = await TaskModel.create(taskData);
      
      expect(task.title).toBe('New Task');
      expect(task.description).toBe('Description');
      expect(task.priority).toBe('high');
      expect(task.status).toBe('pending');
      expect(task.id).toBeDefined();
    });

    test('should add task to in-memory storage', async () => {
      await TaskModel.create({ title: 'Stored Task' });
      
      const result = await TaskModel.findAll();
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].title).toBe('Stored Task');
    });
  });

  describe('save', () => {
    test('should update existing task', async () => {
      const task = await TaskModel.create({ title: 'Original Title' });
      const originalUpdatedAt = task.updatedAt;
      
      task.title = 'Updated Title';
      task.status = 'completed';
      
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      const savedTask = await task.save();
      
      expect(savedTask.title).toBe('Updated Title');
      expect(savedTask.status).toBe('completed');
      expect(savedTask.updatedAt).not.toBe(originalUpdatedAt);
    });

    test('should not update if task not found in storage', async () => {
      const task = new TaskModel({ title: 'Orphan Task' });
      task.id = '999';
      
      const savedTask = await task.save();
      
      expect(savedTask.title).toBe('Orphan Task');
    });
  });

  describe('generateId', () => {
    test('should generate unique sequential IDs', () => {
      const task1 = new TaskModel({ title: 'Task 1' });
      const task2 = new TaskModel({ title: 'Task 2' });
      
      expect(task1.generateId()).toBe('3'); // Next ID after 1 and 2
      expect(task2.generateId()).toBe('4');
    });
  });
});
