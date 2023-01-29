import {
  ADD_CONTACT_FAILED,
  ADD_CONTACT_SUCCESS,
  RECEIVE_NEW_MESSAGE,
  SEND_NEW_MESSAGE,
  SELECT_CONTACT,
} from "../actions/types";

const initialState = {
  selectedContact: null,
  selectedChat: {
    contactName: null,
    roomID: null,
    conversations: [],
  },
  contacts: [],
  chat: [
    {
      contactName: null,
      roomID: null,
      conversations: [
        // {
        //   message: null,
        //   sentBy: null,
        //   receivedBy: null,
        //   timestamp: null,
        // },
      ],
    },
  ],
};

export default function dbReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: [
          ...state.contacts,
          {
            username: payload.id,
          },
        ],
        chat: [
          ...state.chat,
          {
            contactName: payload.id,
            roomID: payload.roomID ? payload.roomID : payload.id,
            conversations: [],
          },
        ],
      };
    case ADD_CONTACT_FAILED:
      return state;
    case SELECT_CONTACT:
      console.log(payload, "payload select contact reducer");
      return {
        ...state,
        selectedContact: payload.contactName,
        selectedChat: {
          ...state.selectedChat,
          contactName: payload.contactName,
          roomID: payload.roomID,
          conversations: payload.conversations,
        },
      };
    case SEND_NEW_MESSAGE:
    //   console.log(payload, "payload send message reducer");
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          conversations: [
            ...state.selectedChat.conversations,
            {
              message: payload.message,
              sentBy: payload.sentBy,
              receivedBy: payload.receiverID,
            },
          ],
        },
        chat: state.chat.map((item) => {
          if (item.contactName === payload.receiverID) {
            item.conversations = [
              ...item.conversations,
              {
                message: payload.message,
                sentBy: payload.sentBy,
                receivedBy: payload.receiverID,
              },
            ];
          }
          return item;
        }),
      };
    case RECEIVE_NEW_MESSAGE:
      console.log(payload, "payload waktu received new message");
      return {
        ...state,
        selectedChat: {
          ...state.selectedChat,
          roomID: payload.roomID,
          conversations: [
            ...state.selectedChat.conversations,
            {
              message: payload.message,
              sentBy: payload.sentBy,
              receivedBy: payload.receiverID,
            },
          ],
        },
        chat: state.chat.map((item) => {
          if (item.contactName === payload.sentBy) {
            item.conversations = [
              ...item.conversations,
              {
                message: payload.message,
                sentBy: payload.sentBy,
                receivedBy: payload.receiverID,
              },
            ];
          }
          return item;
        }),
      };
    default:
      return state;
  }
}
