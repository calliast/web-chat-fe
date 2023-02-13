import { io } from "socket.io-client";
import Auth from "../services/auth.services";
import {
  CLEAN_UP_SESSION,
  CONNECT_SOCKET,
  SIGN_IN_FAILED,
  SIGN_IN_SUCCESS,
  SIGN_OUT_FAILED,
  SIGN_OUT_SUCCESS,
} from "./types";

export const connectSocket = () => async (dispatch, getState) => {
  const { isLoggedIn, username } = getState().user;
  const currentTimestamp = new Date().getTime() / 1000;
  try {
    if (isLoggedIn) {
      const socket = io("http://192.168.1.30:3036", {
        query: { username, timestamp: currentTimestamp },
      });
      socket.on("connect", () => {
        dispatch({
          type: CONNECT_SOCKET,
          socket,
        });
      });
    }
  } catch (error) {
    console.log("error when connecting socket", error);
  }
};

export const closeSocket = (event) => (dispatch, getState) => {
  const { socket } = getState().user;
  if (socket) {
    socket.close(event);
    console.log(`Closing socket ${event}`);
  }
};

export const offSocket = (event) => (dispatch, getState) => {
  const { socket } = getState().user;
  if (socket) {
    socket.off(event);
    console.log(`Turning off socket ${event}`);
  }
};

export const signIn = (username, callback) => async (dispatch, getState) => {
  try {
    const request = await Auth.userSignIn({ username });
    if (!request?.success) throw request;
    dispatch({
      type: SIGN_IN_SUCCESS,
      payload: request.data,
    });
    setTimeout(callback, 100);
  } catch ({ name, message, code, config, request }) {
    console.log(
      `REQUEST FAILED\nError\t: ${name}\nCode\t: ${code}\nMessage\t: ${message}`
    );
    dispatch({
      type: SIGN_IN_FAILED,
    });
  }
};

export const signOut = (callback) => async (dispatch, getState) => {
  try {
    const request = await Auth.userSignOut();
    if (!request.data?.success) throw request;

    await dispatch({
      type: CLEAN_UP_SESSION,
    });
    dispatch({
      type: SIGN_OUT_SUCCESS,
    });
    setTimeout(callback, 200);
  } catch ({ name, message, code, config, request }) {
    console.log(
      `Signout failed\nError\t: ${name}\nCode\t: ${code}\nMessage\t: ${message}`
    );
    await dispatch({
      type: CLEAN_UP_SESSION,
    });
    dispatch({
      type: SIGN_OUT_FAILED,
    });
    setTimeout(callback, 200);
  }
};
