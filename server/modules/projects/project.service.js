const Project = require('./project.model');
const redisClient = require('../../config/redis');
const SearchIndexer = require('../../integrations/search.indexer');

async function create(payload) {
  const project = await Project.create(payload);

  await redisClient.set(`project:${project._id}`, JSON.stringify(project), { EX: 60 * 5 });

  try { await SearchIndexer.indexProject(project); } catch (e) { console.warn('ES index project error', e.message); }
  return project;
}

async function getById(id) {
  const cache = await redisClient.get(`project:${id}`);
  if (cache) return JSON.parse(cache);
  const project = await Project.findById(id).populate('owner members', '-password');
  if (project) await redisClient.set(`project:${id}`, JSON.stringify(project), { EX: 60 * 5 });
  return project;
}

async function update(id, payload) {
  const project = await Project.findByIdAndUpdate(id, payload, { new: true });
  await redisClient.del(`project:${id}`);
  try { await SearchIndexer.indexProject(project); } catch (e) { console.warn('ES update project error', e.message); }
  return project;
}

async function remove(id) {
  await Project.findByIdAndDelete(id);
  await redisClient.del(`project:${id}`);
  try { await SearchIndexer.deleteProjectFromIndex(id); } catch (e) { console.warn('ES delete project error', e.message); }
}

async function list({ q = '', page = 1, limit = 20 }) {

  if (q && q.length > 1) {
    try {
      return await SearchIndexer.searchProjects(q, { page, limit });
    } catch (e) {
      console.warn('ES search failed, fallback to DB', e.message);
    }
  }
  const skip = (page - 1) * limit;
  const total = await Project.countDocuments({});
  const rows = await Project.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('owner', '-password');
  return { total, page, limit, rows };
}

module.exports = { create, getById, update, remove, list };
