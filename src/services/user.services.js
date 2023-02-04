import { api } from "./auth.services";

export const apiGetData = (username) => api.get(`/chat/${username}`);

export const apiAddContact = (id, payload) => api.post(`/chat/${id}`, payload);

export const apiSendMessage = (params, payload) =>
  api.post(`/chat/message/${params}`, payload);

export const apiUpdateReadStatus = (messageIDs) =>
  api.put(`/chat/message/status`, { messageIDs });

export const apiUpdateDeleteStatus = (messageID) =>
  api.delete(`/chat/message/status/`, { _id: messageID });
