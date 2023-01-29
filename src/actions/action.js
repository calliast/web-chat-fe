import { socket } from "../containers/ChatRoom";
import { getUserData } from "../services/user.services";
import {
  ADD_CONTACT_SUCCESS,
  RECEIVE_NEW_MESSAGE,
  SELECT_CONTACT,
  SEND_NEW_MESSAGE,
} from "./types";

export const load_ContactList = (id) => async (dispatch, getState) => {
  try {
    const response = await getUserData(id, "friends");
    if (!response.success) throw response;
  } catch (error) {
    console.log(error);
  }
};

export const addContact =
  ({ id, roomID = null }) =>
  async (dispatch, getState) => {
    const state = getState();
    const room = `${state.user.username}$_&_$${id}`;
    try {
      dispatch({
        type: ADD_CONTACT_SUCCESS,
        payload: { id, roomID },
      });
      joinRoom(room);
    } catch (error) {
      console.log("Error saat add", error);
    }
  };

export const selectContact = (contactID) => async (dispatch, getState) => {
  const state = getState();
  try {
    const contactData = state.db.chat.filter(
      (item) => item.contactName === contactID
    );
    console.log(contactData, "chat ketika select");
    dispatch({
      type: SELECT_CONTACT,
      payload: contactData[0],
    });
    if (contactData[0].roomID.split("$_&_$").length === 1) {
      joinRoom(contactID);
    }
    // socket.emit("join-room", contactID);
  } catch (error) {
    console.log("error saat select contact", error);
  }
};

export const sendMessage = (payload) => async (dispatch, getState) => {
  const state = getState();
  try {
    console.log(payload, "payload saat sendMessage");
    dispatch({
      type: SEND_NEW_MESSAGE,
      payload,
    });
    if (state.db.selectedChat.roomID.split("$_&_$").length === 1) {
      leaveRoom(payload.receiverID);
    }
  } catch (error) {
    console.log("error saat sendMessage", error);
  }
};

export const receiveMessage = (payload) => async (dispatch, getState) => {
  const state = getState().db;
  try {
    if (
      state.contacts.filter((item) => item.username === payload.sentBy)
        .length === 0
    ) {
      dispatch(addContact({ id: payload.sentBy, roomID: payload.roomID }));
    }
    dispatch({
      type: RECEIVE_NEW_MESSAGE,
      payload,
    });
  } catch (error) {
    console.log("error saat newMessage", error);
  }
};

const joinRoom = (id) => socket.emit("join-room", id);

const leaveRoom = (id) => socket.emit("leave-room", id);
