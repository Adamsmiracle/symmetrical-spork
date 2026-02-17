// Simple in-memory task storage
let tasks = [];
let nextId = 1;

class TaskModel {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.title = data.title;
    this.description = data.description || '';
    this.priority = data.priority || 'medium';
    this.status = data.status || 'pending';
    this.dueDate = data.dueDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateId() {
    return (nextId++).toString();
  }

  static async findAll(options = {}) {
    let filteredTasks = [...tasks];
    
    // Sort by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    if (options.limit || options.offset) {
      const limit = parseInt(options.limit) || 10;
      const offset = parseInt(options.offset) || 0;
      filteredTasks = filteredTasks.slice(offset, offset + limit);
    }

    return {
      rows: filteredTasks,
      count: tasks.length
    };
  }

  static async findByPk(id) {
    const task = tasks.find(t => t.id === id);
    return task ? new TaskModel(task) : null;
  }

  static async create(taskData) {
    const newTask = new TaskModel(taskData);
    tasks.push(newTask);
    return newTask;
  }

  async save() {
    const index = tasks.findIndex(t => t.id === this.id);
    if (index !== -1) {
      this.updatedAt = new Date().toISOString();
      tasks[index] = this;
    }
    return this;
  }
}

module.exports = TaskModel;
