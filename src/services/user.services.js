import { api } from "./auth.services";

export const apiGetData = (username) => api.get(`/chat/${username}`);

export const apiAddContact = (id, payload) => api.post(`/chat/${id}`, payload);

export const apiSendMessage = (params, payload) => api.post(`/chat/message/${params}`, payload);

export const apiReceiveMessage = (params) => api.put(`/chat/message/${params}`)

export const apiRemoveMessage = (messageId) => api.delete(`/chat/message/${messageId}`);
