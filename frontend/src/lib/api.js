import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sipekaes_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
      localStorage.removeItem('sipekaes_token');
      localStorage.removeItem('sipekaes_user');
      if (!window.location.pathname.includes('/login')) window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  me: () => api.get('/auth/me'),
};

export const crud = (entity) => ({
  list: (params) => api.get(`/${entity}`, { params }),
  get: (id) => api.get(`/${entity}/${id}`),
  create: (data) => api.post(`/${entity}`, data),
  update: (id, data) => api.put(`/${entity}/${id}`, data),
  remove: (id) => api.delete(`/${entity}/${id}`),
});

export const simpatisanApi = crud('simpatisan');
export const kaderApi = crud('kader');
export const saksiApi = crud('saksi');
export const dpcApi = crud('pengurus-dpc');
export const dpraApi = crud('pengurus-dpra');
export const peloporApi = crud('pelopor');
export const rkiApi = crud('rki');
export const usersApi = { list: () => api.get('/users') };
export const statsApi = {
  summary: () => api.get('/stats/summary'),
  perKecamatan: () => api.get('/stats/per-kecamatan'),
};

export const excelApi = {
  downloadTemplate: () => api.get('/simpatisan/template/excel', { responseType: 'blob' }),
  import: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/simpatisan/import/excel', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export default api;
