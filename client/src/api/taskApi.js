import axiosClient from './axiosClient';

const taskApi = {
  listTasks: (projectId) => {
    return axiosClient.get('/tasks', { params: { project: projectId } });
  },
  // Add other task-related API calls here as needed
};

export default taskApi;
