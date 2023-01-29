import {
  SIGN_IN_FAILED,
  SIGN_IN_SUCCESS,
  SIGN_OUT_FAILED,
  SIGN_OUT_SUCCESS,
} from "../actions/types";

const user = JSON.parse(localStorage.getItem("user-data"));

const initialState = user
  ? {
      isLoggedIn: true,
      user: user.name,
      username: user.username,
    }
  : {
      isLoggedIn: false,
      user: null,
      username: null,
    };

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.name,
        username: payload.username
      };
    case SIGN_IN_FAILED:
      return {
        ...state,
        isLoggedIn: false,
      };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case SIGN_OUT_FAILED:
      return {
        ...state,
        isLoggedIn: false,
      };
    default:
      return state;
  }
}
