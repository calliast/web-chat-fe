import Auth from "../services/auth.services";
import { SIGN_IN_FAILED, SIGN_IN_SUCCESS } from "./types";

export const signIn = (username, callback) => async (dispatch, getState) => {
  try {
    const data = await Auth.userSignIn({ username });
    if (!data?.success) throw data;
    dispatch({
        type: SIGN_IN_SUCCESS,
        payload: data.data
    })
    setTimeout(callback, 100);
  } catch ({ name, message, code, config, request }) {
    console.log(
      `REQUEST FAILED\nError\t: ${name}\nCode\t: ${code}\nMessage\t: ${message}`
    );
    dispatch({
        type: SIGN_IN_FAILED
    })
  }
};

export const signOut = (callback) => async (dispatch, getState) => {
  try {
    const data = await Auth.userSignOut();
    if (!data?.success) throw data;
    setTimeout(callback, 100);
  } catch ({ name, message, code, config, request }) {
    console.log(
      `Signout failed\nError\t: ${name}\nCode\t: ${code}\nMessage\t: ${message}`
    );
    setTimeout(callback, 100);
  }
};
