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
} from "../actions/types";

const initialState = {
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
      return {
        ...state,
        contacts: [...payload.contacts],
        chat: [...payload.chats],
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
            chatID: payload.chat._id,
            unreadCount: payload.isNew ? 1 : 0,
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
      console.log(
        "selectcontact - reducer - berikut adalah payload ketika select contact",
        payload
      );
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
      console.log(
        "sendmessage - reducer - berikut adalah payload ketika sendmessage berhasil",
        payload
      );
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
          if (item._id === payload.response.chat._id) {
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
      console.log(
        "resendmessage - reducer - berikut adalah payload ketika resend message",
        payload
      );
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
            console.log("resendmessage - reducer - item convo lv 1", item);
            return {
              ...item,
              conversation: item.conversation.map((item) => {
                console.log("resendmessage - reducer - item convo lv 2", item);
                if (item._id === payload.messageID) {
                  console.log(
                    "resendmessage - reducer - item convo lv 3",
                    item
                  );
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
      state.contacts.forEach((contact) => {
        if (contact.username === payload.message.sentID) {
          payload.message.sentID = contact._id
        }
      })
      if (state.selectedChat._id === payload.chatID) {
        console.log('receivemessage - reducer - user sedang melihat chatID yang sama', payload)
        return {
          ...state,
          selectedChat: {
            ...state.selectedChat,
            conversation: [
              ...state.selectedChat.conversation,
              { ...payload.message },
            ],
          },
          chat: state.chat.map((item) => {
            if (item._id === payload.chatID) {
              return {
                ...item,
                conversation: [
                  ...item.conversation,
                  {
                    ...payload.message,
                  },
                ],
              };
            }
            return item;
          }),
        };
      } else {
        console.log('receivemessage - reducer - user sedang tidak melihat chat yang sama', payload)
        return {
          ...state,
          contacts: state.contacts.map((contact) => {
            if (contact._id === payload.message.sentID) {
              contact.unreadCount += 1;
              return contact;
            }
            return contact;
          }),
          chat: state.chat.map((item) => {
            if (item._id === payload.chatID) {
              console.log("receivemessage - reducer - sedang memasukkan payload", payload)
              return {
                ...item,
                conversation: [
                  ...item.conversation,
                  {
                    ...payload.message,
                  },
                ],
              };
            }
            return item;
          }),
        };
      }
    case DELETE_MESSAGE:
      console.log("deletemessage - reducer - payload", payload);
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
    case DELETE_MESSAGE_NOTICE:
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
            if (item._id === payload.chatID) {
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
            if (item._id === payload.chatID) {
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
    case UPDATE_READ_STATUS:
      console.log(
        "updatereadstatus - reducer - berikut adalah payload yang akan diupdate",
        payload
      );
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversation: state.selectedChat.conversation.map((message) => {
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
        },
        contacts: state.contacts.map((contact) => {
          if (contact._id === state.selectedContact._id) {
            console.log("updatereadstatus - reducer - ini jumlah unreadCount", contact.unreadCount)
            contact.unreadCount = 0;
            return contact;
          }
          return contact;
        }),
        chat: state.chat.map((item) => {
          if (item._id === state.selectedChat._id) {
            return {
              ...item,
              conversation: item.conversation.map((message) => {
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
          return item;
        }),
      };
      case UPDATE_READ_NOTICE:
        if (state.selectedChat._id === payload.chatID) {
          return {
            ...state,
            selectedChat: {
              ...state.selectedChat,
              conversation: state.selectedChat.conversation.map((message) => {
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
            },
            chat: state.chat.map((item) => {
              if (item._id === payload.chatID) {
                return {
                  ...item,
                  conversation: item.conversation.map((message) => {
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
              return item;
            }),
          };
        } else {
          return  {
            ...state,
            chat: state.chat.map((item) => {
              if (item._id === payload.chatID) {
                return {
                  ...item,
                  conversation: item.conversation.map((message) => {
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
              return item;
            }),
          }
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
        chat: [],
      };
    default:
      return state;
  }
}
