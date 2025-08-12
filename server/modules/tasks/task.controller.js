const TaskService = require('./task.service');

exports.createTask = async (req, res, next) => {
  try {
    const task = await TaskService.create(req.body, req.user);
    res.status(201).json(task);
  } catch (err) { next(err); }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await TaskService.getById(req.params.id);
    res.json(task);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.update(req.params.id, req.body, req.user);
    res.json(task);
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await TaskService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.listTasks = async (req, res, next) => {
  try {
    const tasks = await TaskService.list(req.query);
    res.json(tasks);
  } catch (err) { next(err); }
};

exports.assignTask = async (req, res, next) => {
  try {
    const task = await TaskService.assign(req.params.id, req.body.assigneeId, req.user);
    res.json(task);
  } catch (err) { next(err); }
};
