import api from "./apiAxios";

export const apiGetData = (username) => api.get(`/chat/${username}`);

export const apiAddContact = (id, payload) => api.post(`/chat/${id}`, payload);

export const apiSendMessage = (payload) =>
  api.post(`/chat/message/send`, payload);

export const apiUpdateReadStatus = (messageIDs) =>
  api.put(`/chat/message/read`, { messageIDs });

export const apiUpdateDeleteStatus = (messageID) =>
  api.delete(`/chat/message/${messageID}`);
