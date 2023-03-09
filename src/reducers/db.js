import {
  ADD_CONTACT_SUCCESS,
  RECEIVE_NEW_MESSAGE,
  SEND_NEW_MESSAGE_BE_SUCCESS,
  SELECT_CONTACT,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAILED,
  DELETE_MESSAGE,
  DELETE_MESSAGE_FAILED,
  DELETE_MESSAGE_NOTICE,
  SEND_NEW_MESSAGE_FE,
  SEND_NEW_MESSAGE_BE_FAILED,
  RESEND_MESSAGE,
  SEND_MESSAGE_SOCKET,
  DELETE_MESSAGE_UNSENT,
  UPDATE_READ_NOTICE,
  UPDATE_READ_STATUS,
  CLEAN_UP_SESSION,
  RESEND_MESSAGE_FAILED,
} from "../actions/types";

const initialState = {
  selectedContact: {
    _id: null,
    username: null,
    name: null,
    unreadCount: 0,
  },
  selectedChat: [],
  contacts: [],
  chats: [
    // {
    //   contactName: null,
    //   conversation: [
    // {
    //   message: null,
    //   sentID: null,
    //   receiverID: null,
    //   timestamp: null,
    // },
    // ],
    // },
  ],
};

export default function dbReducer(state = initialState, action) {
  const { type, payload, error } = action;
  switch (type) {
    case LOAD_USER_DATA_SUCCESS:
      console.log("🚀 ~ file: db.js:47 ~ dbReducer ~ payload", payload);
      return {
        ...state,
        contacts: [...payload.contacts],
        chats: [...payload.chats],
      };
    case LOAD_USER_DATA_FAILED:
      console.log("error saat load user data", error);
      return state;
    case ADD_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: [
          ...state.contacts,
          {
            _id: payload.contact._id,
            username: payload.contact.username,
            name: payload.contact.name,
            unreadCount: payload.isUnknownContact ? 1 : 0,
          },
        ],
      };
    case SELECT_CONTACT:
      console.log("🚀 ~ state select contact", state);
      console.log(
        "selectcontact - reducer - berikut adalah payload ketika select contact",
        payload
      );
      return {
        ...state,
        selectedContact: { ...payload.contact },
        selectedChat: payload.chat,
      };
    case SEND_NEW_MESSAGE_FE:
      return {
        ...state,
        selectedChat: [
          ...state.selectedChat,
          {
            ...payload,
          },
        ],
        chats: [
          ...state.chats,
          {
            ...payload,
          },
        ],
      };
    case SEND_NEW_MESSAGE_BE_SUCCESS:
      console.log(
        "sendmessage - reducer - berikut adalah payload ketika sendmessage berhasil",
        payload
      );
      return {
        ...state,
        selectedChat: state.selectedChat.map((item) => {
          if (item._id === payload.messageID) {
            return {
              ...item,
              ...payload.response.message,
              _id: payload.response.message._id,
              sentStatus: true,
            };
          }
          return item;
        }),
        chats: state.chats.map((item) => {
          if (item._id === payload.messageID) {
            return {
              ...item,
              ...payload.response.message,
              _id: payload.response.message._id,
              sentStatus: true,
            };
          }
          return item;
        }),
      };
    case SEND_NEW_MESSAGE_BE_FAILED:
      return {
        ...state,
        selectedChat: state.selectedChat.map((item) => {
          if (item._id === payload.messageID) {
            item.sentStatus = false;
          }
          return item;
        }),
        chats: state.chats.map((item) => {
          if (item._id === payload.messageID) {
            item.sentStatus = false;
          }
          return item;
        }),
      };
    case RESEND_MESSAGE:
      console.log(
        "resendmessage - reducer - berikut adalah payload ketika resend message",
        payload
      );
      return {
        ...state,
        selectedChat: state.selectedChat.map((item) => {
          if (item._id === payload.messageID) {
            item._id = payload.response.message._id;
            item.sentStatus = true;
          }
          return item;
        }),
        chats: state.chats.map((item) => {
          if (item._id === payload.messageID) {
            item._id = payload.response.message._id;
            item.sentStatus = true;
          }
          return item;
        }),
      };
    case RESEND_MESSAGE_FAILED:
      return state;
    case RECEIVE_NEW_MESSAGE:
      console.log(
        "dbReducer - berikut adalah state ketika receive message",
        state
      );
      if (state.selectedContact._id === payload.message.sentID) {
        console.log(
          "receivemessage - reducer - user sedang melihat chatID yang sama",
          payload
        );
        return {
          ...state,
          selectedChat: [...state.selectedChat, { ...payload.message }],
          chats: [...state.chats, { ...payload.message }],
        };
      } else {
        console.log(
          "receivemessage - reducer - user sedang tidak melihat chat yang sama",
          payload
        );
        return {
          ...state,
          contacts: state.contacts.map((contact) => {
            if (contact._id === payload.message.sentID) {
              contact.unreadCount += 1;
              return contact;
            }
            return contact;
          }),
          chats: [
            ...state.chats,
            {
              ...payload.message,
            },
          ],
        };
      }
    case DELETE_MESSAGE:
      console.log("deletemessage - reducer - payload", payload);
      return {
        ...state,
        selectedChat: state.selectedChat.map((item) => {
          if (item._id === payload._id) {
            item.message = "_This message was deleted._";
            item.deleteStatus = true;
            return item;
          }
          return item;
        }),
        chats: state.chats.map((item) => {
          if (item._id === payload._id) {
            item.message = "_This message was deleted._";
            item.deleteStatus = true;
            return item;
          }
          return item;
        }),
      };
    case DELETE_MESSAGE_UNSENT:
      return {
        ...state,
        selectedChat: state.selectedChat.filter(
          (item) => item._id !== payload._id
        ),
        chats: state.chats.filter((item) => item._id !== payload._id),
      };
    case DELETE_MESSAGE_FAILED:
      console.log(error, "error saat delete");
      return state;
    case DELETE_MESSAGE_NOTICE:
      if (state.selectedContact._id === payload.sentID) {
        return {
          ...state,
          selectedChat: state.selectedChat.map((item) => {
            if (item._id === payload._id) {
              item.message = "_This message was deleted._";
              item.deleteStatus = true;
              return item;
            }
            return item;
          }),
          chats: state.chats.map((item) => {
            if (item._id === payload._id) {
              item.message = "_This message was deleted._";
              item.deleteStatus = true;
              return item;
            }
            return item;
          }),
        };
      } else {
        return {
          ...state,
          chats: state.chats.map((item) => {
            if (item._id === payload._id) {
              item.message = "_This message was deleted._";
              item.deleteStatus = true;
              return item;
            }
            return item;
          }),
        };
      }
    case UPDATE_READ_STATUS:
      console.log(
        "updatereadstatus - reducer - berikut adalah payload yang akan diupdate",
        payload
      );
      return {
        ...state,
        selectedChat: state.selectedChat.map((message) => {
          let newMessage = {};
          payload.newMessageIDs.forEach((newData) => {
            if (message._id === newData._id) {
              newMessage = {
                ...message,
                ...newData,
                readStatus: newData.readStatus,
              };
            }
          });
          if (Object.keys(newMessage).length) {
            return newMessage;
          }
          return message;
        }),
        contacts: state.contacts.map((contact) => {
          if (contact._id === state.selectedContact._id) {
            console.log(
              "updatereadstatus - reducer - ini jumlah unreadCount",
              contact.unreadCount
            );
            contact.unreadCount = 0;
            return contact;
          }
          return contact;
        }),
        chats: state.chats.map((message) => {
          let newMessage = {};
          payload.newMessageIDs.forEach((newData) => {
            if (message._id === newData._id) {
              newMessage = {
                ...message,
                ...newData,
                readStatus: newData.readStatus,
              };
            }
          });
          if (Object.keys(newMessage).length) {
            return newMessage;
          }
          return message;
        }),
      };
    case UPDATE_READ_NOTICE:
      console.log("🚀 ~ file: db.js:362 ~ dbReducer ~ ", state.selectedContact);
      if (state.selectedContact._id === payload.newMessageIDs[0].receiverID) {
        return {
          ...state,
          selectedChat: state.selectedChat.map((message) => {
            let newMessage = {};
            payload.newMessageIDs.forEach((newData) => {
              if (message._id === newData._id) {
                console.log(
                  "🚀 ~ file: db.js:368 ~ payload.newMessageIDs.forEach ~ message._id",
                  message._id
                );
                newMessage = {
                  ...message,
                  ...newData,
                  readStatus: newData.readStatus,
                };
              }
            });
            if (Object.keys(newMessage).length) {
              return newMessage;
            }
            return message;
          }),
          chats: state.chats.map((message) => {
            let newMessage = {};
            payload.newMessageIDs.forEach((newData) => {
              if (message._id === newData._id) {
                newMessage = {
                  ...message,
                  ...newData,
                  readStatus: newData.readStatus,
                };
              }
            });
            if (Object.keys(newMessage).length) {
              return newMessage;
            }
            return message;
          }),
        };
      } else {
        return {
          ...state,
          chats: state.chats.map((message) => {
            let newMessage = {};
            payload.newMessageIDs.forEach((newData) => {
              if (message._id === newData._id) {
                newMessage = {
                  ...message,
                  ...newData,
                  readStatus: newData.readStatus,
                };
              }
            });
            if (Object.keys(newMessage).length) {
              return newMessage;
            }
            return message;
          }),
        };
      }
    case SEND_MESSAGE_SOCKET:
      return state;
    case CLEAN_UP_SESSION:
      return {
        ...state,
        selectedContact: {
          _id: null,
          username: null,
          name: null,
          unreadCount: 0,
        },
        selectedChat: {
          contactName: null,
          conversation: [],
        },
        contacts: [],
        chats: [],
      };
    default:
      return state;
  }
}
