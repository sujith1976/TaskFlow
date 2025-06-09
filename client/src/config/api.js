import config from './config';
export const API_URL = config.apiUrl;

export const endpoints = {
  signup: `${API_URL}/auth/signup`,
  login: `${API_URL}/auth/login`,
  tasks: `${API_URL}/tasks`,
  meetings: `${API_URL}/meetings`,
};