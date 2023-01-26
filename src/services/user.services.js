import { api } from "./auth.services";

export const getUserData = (id, query) => api.post(`/users/${id}`, { query });
