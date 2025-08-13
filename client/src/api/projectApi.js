import axiosClient from './axiosClient';

const projectApi = {
  createProject: (data) => {
    return axiosClient.post('/projects', data);
  },
  getProject: (id) => {
    return axiosClient.get(`/projects/${id}`);
  },
  updateProject: (id, data) => {
    return axiosClient.put(`/projects/${id}`, data);
  },
  deleteProject: (id) => {
    return axiosClient.delete(`/projects/${id}`);
  },
  listProjects: () => {
    return axiosClient.get('/projects');
  },
};

export default projectApi;
