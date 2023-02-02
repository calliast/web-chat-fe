import {
  apiAddContact,
  apiGetData,
  apiReceiveMessage,
  apiRemoveMessage,
  apiSendMessage,
} from "../services/user.services";
import {
  ADD_CONTACT_SUCCESS,
  DELETE_MESSAGE,
  DELETE_MESSAGE_FAILED,
  DELETE_MESSAGE_RECEIPT,
  DELETE_MESSAGE_UNSENT,
  LOAD_USER_DATA_FAILED,
  LOAD_USER_DATA_SUCCESS,
  RECEIVE_NEW_MESSAGE,
  RESEND_MESSAGE,
  SELECT_CONTACT,
  SEND_MESSAGE_READ_NOTICE,
  SEND_MESSAGE_SOCKET,
  SEND_NEW_MESSAGE_BE_FAILED,
  SEND_NEW_MESSAGE_BE_SUCCESS,
  SEND_NEW_MESSAGE_FE,
} from "./types";

export const loadUserData = () => async (dispatch, getState) => {
  try {
    const { isLoggedIn, username } = getState().user;
    if (isLoggedIn) {
      const response = await apiGetData(username);
      if (!response.data.success) throw response;
      const newResponse = response.data.data.contacts.map((contact) => {
        let unreadCount = 0;

        response.data.data.chats.forEach((chat) => {
          if (chat.contactName.split("$_&_$").includes(contact.username)) {
            unreadCount += chat.conversation.filter(
              (message) => !message.readStatus && message.sentID === contact._id
            ).length;
          }
        });

        return {
          ...contact,
          unreadCount,
        };
      });

      dispatch({
        type: LOAD_USER_DATA_SUCCESS,
        payload: {
          contacts: newResponse,
          chats: response.data.data.chats,
        },
      });
    }
  } catch (error) {
    console.log("error saat load user data", error);
    dispatch({
      type: LOAD_USER_DATA_FAILED,
      error,
    });
  }
};

export const addContact =
  (contactUsername, chatID = null) =>
  async (dispatch, getState) => {
    const username = getState().user.username;
    try {
      const getContact = await apiAddContact(username, {
        contactUsername,
        chatID,
      });
      if (!getContact.data.success) throw getContact;
      dispatch({
        type: ADD_CONTACT_SUCCESS,
        payload: getContact.data.data,
      });
    } catch (error) {
      console.log(
        `ADD CONTACT FAILED\nError\t: ${error.name}\nCode\t: ${error.code}\nMessage\t: ${error.message}`
      );
    }
  };

export const selectContact =
  (contact, chatID) => async (dispatch, getState) => {
    let contactData;
    const state = getState().db;
    try {
      if (!chatID) {
        contactData = state.chat.filter((item) =>
          item.contactName.split("$_&_$").includes(contact.username)
        );
      } else {
        contactData = state.chat.filter((item) => item._id === chatID);
      }
      dispatch({
        type: SELECT_CONTACT,
        payload: {
          contact,
          chat: contactData[0],
        },
      });
    } catch (error) {
      console.log("error saat select contact", error);
    }
  };

const sendMessageSocket = (payload) => async (dispatch, getState) => {
  const socket = getState().user.socket;
  try {
    console.log(payload, "payload socket");
    socket.emit("send-chat", payload);
    dispatch({
      type: SEND_MESSAGE_SOCKET,
    });
  } catch (error) {
    console.log("error saat sendMessageSocket", error);
  }
};

export const sendMessage = (payload) => async (dispatch, getState) => {
  const state = getState();
  const _id = Date.now();
  const chatID = state.db.selectedChat._id;
  const newPayload = {
    message: payload.message,
    sentID: state.user._id,
    receiverID: state.db.selectedContact._id,
    sentStatus: true,
    readStatus: false,
    deleteStatus: false,
  };

  try {
    //. Sent message to the front-end
    dispatch({
      type: SEND_NEW_MESSAGE_FE,
      payload: {
        _id,
        ...newPayload,
      },
    });

    //. Store message to database
    const sendChat = await apiSendMessage(chatID, newPayload);
    if (!sendChat.data.success) throw sendChat;
    dispatch({
      type: SEND_NEW_MESSAGE_BE_SUCCESS,
      payload: {
        messageID: _id,
        response: sendChat.data.data,
      },
    });

    //. Send Message through socket.io
    newPayload._id = sendChat.data.data.message._id;
    newPayload.chatID = chatID;
    newPayload.sentID = state.user.username;
    newPayload.receiverID = state.db.selectedContact.username;
    dispatch(sendMessageSocket(newPayload));
  } catch (error) {
    console.log("error saat sendMessage", error);
    newPayload.sentStatus = false;
    dispatch({
      type: SEND_NEW_MESSAGE_BE_FAILED,
      payload: {
        messageID: _id,
      },
    });
  }
};

export const resendMessageRedux =
  (_id, payload) => async (dispatch, getState) => {
    const state = getState();
    const chatID = getState().db.selectedChat._id;
    try {
      const sendChat = await apiSendMessage(chatID, payload);
      if (!sendChat.data.success) throw sendChat;
      dispatch({
        type: RESEND_MESSAGE,
        payload: {
          messageID: _id,
          response: sendChat.data.data,
        },
      });
      payload._id = sendChat.data.data.message._id;
      payload.chatID = chatID;
      payload.sentID = state.user.username;
      payload.receiverID = state.db.selectedContact.username;
      dispatch(sendMessageSocket(payload));
    } catch (error) {
      console.log("error saat resend message", error);
    }
  };

export const receiveMessage = (payload) => async (dispatch, getState) => {
  const state = getState().db;
  let increaseUnreadCount = true;
  try {
    //. Check if contact exist in contact list
    if (
      state.contacts.filter((item) => item.username === payload.sentID)
        .length === 0
    ) {
      // if no, then add as new contact
      dispatch(addContact(payload.sentID, payload.chatID));
    }

    //. Check the chatroom address that the user currently seeing
    if (state.selectedContact.username === payload.sentID) {
      //. 1. if user currently opening the chatroom where message intended on being delivered to, then make request to update readStatus in db
      payload.readStatus = true;
      increaseUnreadCount = false;
      const updateReadStatus = await apiReceiveMessage(payload._id);
      if (!updateReadStatus.data.success) throw updateReadStatus;
    }

    //. Dispatch an action to update message state, read status of the message, and unread count of the message
    dispatch({
      type: RECEIVE_NEW_MESSAGE,
      payload: {
        message: payload,
        increase: increaseUnreadCount,
      },
    });
  } catch (error) {
    console.log("error saat receive message", error);
  }
};

export const sendReadNotice = (_id, payload) => async (dispatch, getState) => {
  const socket = getState().user.socket;
  try {
    socket.emit("send-message-read", payload);
    dispatch({
      type: SEND_MESSAGE_READ_NOTICE,
    });
  } catch (error) {
    console.log("ini error saat send read notif", error);
  }
};

export const deleteMessage =
  (payload, sentStatus) => async (dispatch, getState) => {
    const socket = getState().user.socket;
    try {
      if (sentStatus) {
        const deleteChatItem = await apiRemoveMessage(payload._id);
        if (!deleteChatItem.data.success) throw deleteChatItem;
        console.log(
          "🚀 ~ file: action.js:119 ~ deleteMessage ~ deleteChatItem",
          deleteChatItem
        );
        dispatch({
          type: DELETE_MESSAGE,
          payload: deleteChatItem.data.data,
        });
        socket.emit("sent-delete-chat", payload);
      } else {
        dispatch({
          type: DELETE_MESSAGE_UNSENT,
          payload,
        });
      }
    } catch (error) {
      console.log("error saat delete message", error);
      dispatch({
        type: DELETE_MESSAGE_FAILED,
        error,
      });
    }
  };

export const deleteMessageReceipt = (payload) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_MESSAGE_RECEIPT,
      payload,
    });
  } catch (error) {
    console.log("error saat delete message receipt", error);
  }
};
