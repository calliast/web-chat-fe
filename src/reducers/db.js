import {
  ADD_CONTACT_FAILED,
  ADD_CONTACT_SUCCESS,
  RECEIVE_NEW_MESSAGE,
  SEND_NEW_MESSAGE_BE_SUCCESS,
  SELECT_CONTACT,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAILED,
  DELETE_MESSAGE,
  DELETE_MESSAGE_FAILED,
  DELETE_MESSAGE_RECEIPT,
  SEND_NEW_MESSAGE_FE,
  SEND_NEW_MESSAGE_BE_FAILED,
  RESEND_MESSAGE,
  SEND_MESSAGE_SOCKET,
  DELETE_MESSAGE_UNSENT,
  SEND_MESSAGE_READ_NOTICE,
} from "../actions/types";

const initialState = {
  selectedContact: null,
  selectedChat: {
    contactName: null,
    conversation: [],
  },
  contacts: [],
  chat: [
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
      console.log(payload, "payload load user");
      return {
        ...state,
        contacts: [...payload.contacts],
        chat: [...payload.chats],
      };
    case LOAD_USER_DATA_FAILED:
      console.log("error saat load user data", error);
      return state;
    case ADD_CONTACT_SUCCESS:
      console.log(payload, "payload add contact");
      return {
        ...state,
        contacts: [
          ...state.contacts,
          {
            _id: payload.contact._id,
            username: payload.contact.username,
            name: payload.contact.name,
            chatID: payload.chat._id,
            unreadCount: 0,
          },
        ],
        chat: [
          ...state.chat,
          {
            ...payload.chat,
          },
        ],
      };
    case SELECT_CONTACT:
      console.log(payload, "payload di reducer select");
      return {
        ...state,
        selectedContact: payload.contact,
        selectedChat: {
          ...state.selectedChat,
          _id: payload.chat._id,
          contactName: payload.chat.contactName,
          conversation: payload.chat.conversation,
        },
      };
    case SEND_NEW_MESSAGE_FE:
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversation: [
            ...state.selectedChat.conversation,
            {
              ...payload,
            },
          ],
        },
        chat: state.chat.map((item) => {
          if (item._id === state.selectedChat._id) {
            return {
              ...item,
              conversation: [
                ...item.conversation,
                {
                  ...payload,
                },
              ],
            };
          }
          return item;
        }),
      };
    case SEND_NEW_MESSAGE_BE_SUCCESS:
      console.log(payload, "payload_reducer_send_message_BE_SUCCESS");
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversation: state.selectedChat.conversation.map((item) => {
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
        },
        chat: state.chat.map((item) => {
          if (item._id === payload.response._id) {
            return {
              ...item,
              conversation: item.conversation.map((item) => {
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
          }
          return item;
        }),
      };
    case SEND_NEW_MESSAGE_BE_FAILED:
      console.log(payload, "payload_reducer_send_message_BE_FAILED");
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversation: state.selectedChat.conversation.map((item) => {
            if (item._id === payload.messageID) {
              item.sentStatus = false;
            }
            return item;
          }),
        },
        chat: state.chat.map((item) => {
          if (item._id === state.selectedChat._id) {
            return {
              ...item,
              conversation: item.conversation.map((item) => {
                if (item._id === payload.messageID) {
                  item.sentStatus = false;
                }
                return item;
              }),
            };
          }
          return item;
        }),
      };
    case RESEND_MESSAGE:
      console.log(payload, "payload_reducer_send_message_BE_SUCCESS");
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversation: state.selectedChat.conversation.map((item) => {
            if (item._id === payload.messageID) {
              item._id = payload.response.message._id;
              item.sentStatus = true;
            }
            return item;
          }),
        },
        chat: state.chat.map((item) => {
          if (item._id === payload.response._id) {
            console.log("item convo lv 1", item);
            return {
              ...item,
              conversation: item.conversation.map((item) => {
                console.log("item convo lv 2", item);
                if (item._id === payload.messageID) {
                  console.log("item convo lv 3", item);
                  item._id = payload.response.message._id;
                  item.sentStatus = true;
                }
                return item;
              }),
            };
          }
          return item;
        }),
      };
    case RECEIVE_NEW_MESSAGE:
      console.log(payload, "payload waktu received new message");
      return {
        ...state,
        selectedContact: {
          ...state.selectedContact,
          unreadCount: payload.increase
            ? state.selectedContact.unreadCount + 1
            : state.selectedContact.unreadCount - 1,
        },
        selectedChat: {
          ...state.selectedChat,
          conversation: [
            ...state.selectedChat.conversation,
            {
              ...payload.message,
              sentStatus: payload.increase ? false : true,
            },
          ],
        },
        chat: state.chat.map((item) => {
          if (
            item.contactName.split("$_&_$").includes(payload.message.sentID)
          ) {
            return {
              ...item,
              conversation: [
                ...item.conversation,
                {
                  ...payload.message,
                  sentStatus: payload.increase ? false : true,
                },
              ],
            };
          }
          return item;
        }),
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversation: state.selectedChat.conversation.map((item) => {
            if (item._id === payload._id) {
              item.message = "_This message was deleted._";
              item.deleteStatus = true;
              return item;
            }
            return item;
          }),
        },
        chat: state.chat.map((item) => {
          if (item._id === state.selectedChat._id) {
            return {
              ...item,
              conversation: item.conversation.map((item) => {
                if (item._id === payload._id) {
                  item.message = "_This message was deleted._";
                  item.deleteStatus = true;
                  return item;
                }
                return item;
              }),
            };
          }
          return item;
        }),
      };
    case DELETE_MESSAGE_UNSENT:
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversation: state.selectedChat.conversation.filter(
            (item) => item._id !== payload._id
          ),
        },
        chat: state.chat.map((item) => {
          if (item._id === state.selectedChat._id) {
            return {
              ...item,
              conversation: item.conversation.filter(
                (item) => item._id !== payload._id
              ),
            };
          }
          return item;
        }),
      };
    case DELETE_MESSAGE_FAILED:
      console.log(error, "error saat delete");
      return state;
    case DELETE_MESSAGE_RECEIPT:
      if (state.selectedChat._id === payload.chatID) {
        return {
          ...state,
          selectedChat: {
            ...state.selectedChat,
            conversation: state.selectedChat.conversation.map((item) => {
              if (item._id === payload._id) {
                item.message = "_This message was deleted._";
                item.deleteStatus = true;
                return item;
              }
              return item;
            }),
          },
          chat: state.chat.map((item) => {
            if (item._id === state.selectedChat._id) {
              return {
                ...item,
                conversation: item.conversation.map((item) => {
                  if (item._id === payload._id) {
                    item.message = "_This message was deleted._";
                    item.deleteStatus = true;
                    return item;
                  }
                  return item;
                }),
              };
            }
            return item;
          }),
        };
      } else {
        return {
          ...state,
          chat: state.chat.map((item) => {
            if (item._id === state.selectedChat._id) {
              return {
                ...item,
                conversation: item.conversation.map((item) => {
                  if (item._id === payload._id) {
                    item.message = "_This message was deleted._";
                    item.deleteStatus = true;
                    return item;
                  }
                  return item;
                }),
              };
            }
            return item;
          }),
        };
      }
    case SEND_MESSAGE_SOCKET:
      return state;
    case SEND_MESSAGE_READ_NOTICE:
      return state;
    default:
      return state;
  }
}
