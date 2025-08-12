const ProjectService = require('./project.service');

exports.createProject = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.owner = req.user._id;
    const project = await ProjectService.create(payload);
    res.status(201).json(project);
  } catch (err) { next(err); }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await ProjectService.getById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await ProjectService.update(req.params.id, req.body);
    res.json(project);
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await ProjectService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.listProjects = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const result = await ProjectService.list({ q, page, limit });
    res.json(result);
  } catch (err) { next(err); }
};
