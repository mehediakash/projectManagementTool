const Task = require('./task.model');
const User = require('../users/user.model');
const NotificationService = require('../notifications/notification.service');
const redisClient = require('../../config/redis');
const PriorityQueue = require('../../utils/priorityQueue');

const taskQueue = new PriorityQueue((a,b) => a.priority - b.priority); 

async function create(payload, actor) {
  const task = await Task.create(payload);

  await redisClient.set(`task:${task._id}`, JSON.stringify(task), { EX: 60 * 5 });

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
  const cache = await redisClient.get(`task:${id}`);
  if (cache) return JSON.parse(cache);
  const task = await Task.findById(id).populate('assignees project');
  await redisClient.set(`task:${id}`, JSON.stringify(task), { EX: 60 * 5 });
  return task;
}

async function update(id, payload, actor) {
  const task = await Task.findByIdAndUpdate(id, payload, { new: true });
  await redisClient.set(`task:${id}`, JSON.stringify(task), { EX: 60 * 5 });

  if (task.assignees && task.assignees.length) {
    task.assignees.forEach(uid => NotificationService.push(uid, { type: 'task_updated', taskId: id }));
  }
  return task;
}

async function remove(id) {
  await Task.findByIdAndDelete(id);
  await redisClient.del(`task:${id}`);
}

async function list(query) {

  const q = {};
  if (query.project) q.project = query.project;
  return Task.find(q).limit(50).sort({ createdAt: -1 });
}

async function assign(id, assigneeId, actor) {
  const task = await Task.findById(id);
  if (!task) throw new Error('Task not found');
  task.assignees.push(assigneeId);
  await task.save();
  await redisClient.del(`task:${id}`);
  await NotificationService.push(assigneeId, { type: 'task_assigned', taskId: id });
  return task;
}

module.exports = { create, getById, update, remove, list, assign };
