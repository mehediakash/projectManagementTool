const Task = require('./task.model');
const User = require('../users/user.model');
const NotificationService = require('../notifications/notification.service');

const PriorityQueue = require('../../utils/priorityQueue');

const taskQueue = new PriorityQueue((a,b) => a.priority - b.priority); 

async function create(payload, actor) {
  const task = await Task.create({ ...payload, createdBy: actor._id });

  taskQueue.enqueue(task);

  if (task.assignees?.length) {
    for (const uid of task.assignees) {
      await NotificationService.push(uid, {
        type: 'task_assigned',
        title: `New task: ${task.title}`,
        taskId: task._id
      });
    }
  }
  return task;
}

async function getById(id) {
  const task = await Task.findById(id).populate('assignees project createdBy');
  return task;
}

async function update(id, payload, actor) {
  const task = await Task.findByIdAndUpdate(id, payload, { new: true });

  if (task.assignees && task.assignees.length) {
    task.assignees.forEach(uid => NotificationService.push(uid, { type: 'task_updated', taskId: id }));
  }
  return task;
}

async function remove(id) {
  await Task.findByIdAndDelete(id);
}

async function list(query, actor) {
  const q = {};
  if (query.project) q.project = query.project;

  if (actor.role === 'member') {
    q.$or = [
      { assignees: actor._id },
      { createdBy: actor._id }
    ];
  }

  return Task.find(q).populate('assignees project createdBy').limit(50).sort({ createdAt: -1 });
}

async function listAll(query) {
  const q = {};
  if (query.project) q.project = query.project;
  return Task.find(q).populate('assignees project createdBy').limit(50).sort({ createdAt: -1 });
}

async function assign(id, assigneeId, actor) {
  const task = await Task.findById(id);
  if (!task) throw new Error('Task not found');
  task.assignees.push(assigneeId);
  await task.save();
  await NotificationService.push(assigneeId, { type: 'task_assigned', taskId: id });
  return task;
}

module.exports = { create, getById, update, remove, list, listAll, assign };
