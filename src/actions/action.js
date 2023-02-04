import {
  apiAddContact,
  apiGetData,
  apiUpdateReadStatus,
  apiUpdateDeleteStatus,
  apiSendMessage,
} from "../services/user.services";
import {
  ADD_CONTACT_SUCCESS,
  DELETE_MESSAGE,
  DELETE_MESSAGE_FAILED,
  DELETE_MESSAGE_NOTICE,
  DELETE_MESSAGE_UNSENT,
  LOAD_USER_DATA_FAILED,
  LOAD_USER_DATA_SUCCESS,
  RECEIVE_NEW_MESSAGE,
  RESEND_MESSAGE,
  SELECT_CONTACT,
  SEND_READ_NOTICE,
  SEND_MESSAGE_SOCKET,
  SEND_NEW_MESSAGE_BE_FAILED,
  SEND_NEW_MESSAGE_BE_SUCCESS,
  SEND_NEW_MESSAGE_FE,
  UPDATE_READ_NOTICE,
} from "./types";

export const loadUserData = () => async (dispatch, getState) => {
  try {
    const { isLoggedIn, username } = getState().user;
    //. Check first if there's a login session
    if (isLoggedIn) {
      //. If it is, Fetch data from api to get user's data
      const response = await apiGetData(username);
      if (!response.data.success) throw response;
      //. If request succeeded, map over the data responses to count for number of unread messages
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
      //. then dispatch action to update the db state with user's data
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
  (contactUsername, chatID = null, isNew = null) =>
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
        payload: {
          contact: getContact.data.data.contact,
          chat: getContact.data.data.chat,
          isNew,
        },
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
    let unreadMessageIDs;
    const state = getState().db;
    try {
      if (!chatID) {
        contactData = state.chat.filter((item) =>
          item.contactName.split("$_&_$").includes(contact.username)
        );
      } else {
        contactData = state.chat.filter((item) => item._id === chatID);
      }

      unreadMessageIDs = contactData[0].conversation.filter(
        (item) => !item.readStatus
      );
      // Make an array of data for any unread messages
      if (unreadMessageIDs.length > 0) {
        updateReadNotice(unreadMessageIDs);
        sendReadNotice();
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
  const state = getState();
  const socket = getState().user.socket;
  try {
    payload.chatID = state.db.selectedChat._id;
    payload.sentID = state.user.username;
    payload.receiverID = state.db.selectedContact.username;
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
  console.log("🚀 ~ file: action.js:205 ~ receiveMessage ~ payload", payload);
  const state = getState().db;
  const chatID = payload.chatID;
  delete payload.chatID;
  try {
    //. Check if contact exist in contact list
    if (
      state.contacts.filter((item) => {
        return item.username === payload.sentID;
      }).length === 0
    ) {
      // if no, then add as new contact
      dispatch(addContact(payload.sentID, chatID, true));
    }

    //. Dispatch an action to update state with the new message,
    dispatch({
      type: RECEIVE_NEW_MESSAGE,
      payload: {
        message: payload,
        chatID,
      },
    });

    //. Check if user currently seeing the same chatID where message intended on being delivered to,
    if (state.selectedChat._id === chatID) {
      dispatch(updateReadNotice([payload], true));
      dispatch(sendReadNotice(payload));
    }
  } catch (error) {
    console.log("error saat receive message", error);
  }
};

//. send notice that message has been read to the sender
export const sendReadNotice = (payload) => async (dispatch, getState) => {
  const socket = getState().user.socket;
  const user = getState().user.username;
  const contact = getState().db.selectedContact.username;

  const messageIDs = payload.map((item) => {
    item.sentID = user;
    item.receiverID = contact;
  });
  try {
    dispatch(updateReadNotice(messageIDs));
    socket.emit("send-read-notice", messageIDs);
  } catch (error) {
    console.log("ini error saat send read notif", error);
  }
};

//. notification that message has been read by receiver
export const updateReadNotice =
  (messageIDs, isReceiver = null) =>
  async (dispatch, getState) => {
    let newMessageIDs = messageIDs;
    if (isReceiver) {
      const updatedMessageIDs = await apiUpdateReadStatus(messageIDs);
      if (!updatedMessageIDs.data.success) throw updatedMessageIDs;
      newMessageIDs = updatedMessageIDs.data.data;
    }

    try {
      dispatch({
        type: UPDATE_READ_NOTICE,
        payload: {
          newMessageIDs,
        },
      });
    } catch (error) {
      console.log("ini error saat receive read notice", error);
    }
  };

export const deleteMessage =
  (payload, sentStatus) => async (dispatch, getState) => {
    const socket = getState().user.socket;
    try {
      if (sentStatus) {
        const deleteChatItem = await apiUpdateDeleteStatus(payload._id);
        if (!deleteChatItem.data.success) throw deleteChatItem;
        console.log(
          "🚀 ~ file: action.js:119 ~ deleteMessage ~ deleteChatItem",
          deleteChatItem
        );
        dispatch({
          type: DELETE_MESSAGE,
          payload: deleteChatItem.data.data,
        });
        socket.emit("send-delete-notice", payload);
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

export const deleteMessageNotice = (payload) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_MESSAGE_NOTICE,
      payload,
    });
  } catch (error) {
    console.log("error saat delete message receipt", error);
  }
};

const updateReadStatus = async (payload) => {
  try {
    const updateMessage = await apiUpdateReadStatus();
  } catch (error) {
    console.log("error sewaktu update read status");
  }
};
