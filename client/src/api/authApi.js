import axiosClient from './axiosClient';

const authApi = {
  signup: (data) => {
    return axiosClient.post('/auth/signup', data);
  },
};

export default authApi;
