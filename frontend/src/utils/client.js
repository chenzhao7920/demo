import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`API ${method} request to ${url} failed`, error);
    throw error.response ? error.response.data : new Error('Network error');
  }
};

const Client = {
     get: (url, config = {}) => apiRequest('get', url, null, config),
     post: (url, data, config = {}) => apiRequest('post', url, data, config),
     put: (url, data, config = {}) => apiRequest('put', url, data, config),
     del: (url, config = {}) => apiRequest('delete', url, null, config),

}
export default Client;