const EventEmitter = require('node:events');

class TaskService extends EventEmitter {
  #tasks = new Map();
  #nextId = 1;

  create(title) {
    if (typeof title !== 'string' || title.trim() === '') {
      this.emit('error', new Error('title requis'));
      return null;
    }
    const task = { id: this.#nextId++, title: title.trim(), done: false };
    this.#tasks.set(task.id, task);
    this.emit('created', task);
    return task;
  }

  complete(id) {
    const task = this.#tasks.get(id);
    if (!task) return null;
    task.done = true;
    this.emit('completed', task);
    return task;
  }

  remove(id) {
    const task = this.#tasks.get(id);
    if (!task) return false;
    this.#tasks.delete(id);
    this.emit('removed', task);
    return true;
  }

  list() {
    return [...this.#tasks.values()];
  }
}

module.exports = TaskService;
