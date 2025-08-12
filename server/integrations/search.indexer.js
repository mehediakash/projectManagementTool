const { client, ensureIndex } = require('./elasticsearch');


const TASK_INDEX = 'tasks';
const PROJECT_INDEX = 'projects';
const USER_INDEX = 'users';


const TASK_MAPPING = {
  mappings: {
    properties: {
      title: { type: 'text' },
      description: { type: 'text' },
      project: { type: 'keyword' },
      assignees: { type: 'keyword' },
      priority: { type: 'integer' },
      status: { type: 'keyword' },
      createdAt: { type: 'date' }
    }
  }
};

const PROJECT_MAPPING = {
  mappings: {
    properties: {
      name: { type: 'text' },
      description: { type: 'text' },
      owner: { type: 'keyword' },
      members: { type: 'keyword' },
      createdAt: { type: 'date' }
    }
  }
};

const USER_MAPPING = {
  mappings: {
    properties: {
      name: { type: 'text' },
      email: { type: 'keyword' },
      skills: { type: 'text' }
    }
  }
};

async function init() {
  await ensureIndex(TASK_INDEX, TASK_MAPPING);
  await ensureIndex(PROJECT_INDEX, PROJECT_MAPPING);
  await ensureIndex(USER_INDEX, USER_MAPPING);
}


async function indexTask(task) {
  await client.index({
    index: TASK_INDEX,
    id: String(task._id),
    body: {
      title: task.title,
      description: task.description || '',
      project: task.project ? String(task.project) : null,
      assignees: (task.assignees || []).map(a => String(a)),
      priority: task.priority || 3,
      status: task.status || 'todo',
      createdAt: task.createdAt || new Date()
    }
  });
  await client.indices.refresh({ index: TASK_INDEX });
}

async function deleteTaskFromIndex(taskId) {
  await client.delete({ index: TASK_INDEX, id: String(taskId) }).catch(() => {});
}

async function searchTasks(query, { page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit;
  const resp = await client.search({
    index: TASK_INDEX,
    body: {
      from,
      size: limit,
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'description']
        }
      }
    }
  });
  const hits = resp.hits.hits.map(h => ({ id: h._id, score: h._score, ...h._source }));
  return { total: resp.hits.total.value || 0, page, limit, hits };
}


async function indexProject(project) {
  await client.index({
    index: PROJECT_INDEX,
    id: String(project._id),
    body: {
      name: project.name,
      description: project.description || '',
      owner: project.owner ? String(project.owner) : null,
      members: (project.members || []).map(m => String(m)),
      createdAt: project.createdAt || new Date()
    }
  });
  await client.indices.refresh({ index: PROJECT_INDEX });
}

async function deleteProjectFromIndex(projectId) {
  await client.delete({ index: PROJECT_INDEX, id: String(projectId) }).catch(() => {});
}

async function searchProjects(query, { page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit;
  const resp = await client.search({
    index: PROJECT_INDEX,
    body: {
      from,
      size: limit,
      query: {
        multi_match: {
          query,
          fields: ['name^3', 'description']
        }
      }
    }
  });
  const hits = resp.hits.hits.map(h => ({ id: h._id, score: h._score, ...h._source }));
  return { total: resp.hits.total.value || 0, page, limit, hits };
}


async function indexUser(user) {
  if (!user) return;
  await client.index({
    index: USER_INDEX,
    id: String(user._id),
    body: {
      name: user.name,
      email: user.email,
      skills: user.skills || []
    }
  });
  await client.indices.refresh({ index: USER_INDEX });
}

async function deleteUserFromIndex(userId) {
  await client.delete({ index: USER_INDEX, id: String(userId) }).catch(() => {});
}

async function searchUsers(query, { page = 1, limit = 20 } = {}) {
  const from = (page - 1) * limit;
  const resp = await client.search({
    index: USER_INDEX,
    body: {
      from,
      size: limit,
      query: {
        multi_match: {
          query,
          fields: ['name^2', 'skills']
        }
      }
    }
  });
  const hits = resp.hits.hits.map(h => ({ id: h._id, score: h._score, ...h._source }));
  return { total: resp.hits.total.value || 0, page, limit, hits };
}

module.exports = {
  init,
  indexTask,
  deleteTaskFromIndex,
  searchTasks,
  indexProject,
  deleteProjectFromIndex,
  searchProjects,
  indexUser,
  deleteUserFromIndex,
  searchUsers
};
