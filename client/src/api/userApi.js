import axiosClient from './axiosClient';

const userApi = {
  listUsers: () => {
    return axiosClient.get('/users');
  },
};

export default userApi;
