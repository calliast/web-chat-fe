import axios from "axios";

async function authInterceptor(config) {
  const data = localStorage.getItem("user-data");
  const parsedData = JSON.parse(data);
  if (parsedData && parsedData.token) {
    config.headers.Authorization = `Bearer ${parsedData.token}`;
  }
  return config;
}

const api = axios.create({
  baseURL: "http://192.168.8.108:3036",
  timeout: 3000,
});

api.interceptors.request.use(authInterceptor);

export default api;
