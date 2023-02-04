import {
  CONNECT_SOCKET,
  DISCONNECT_SOCKET,
  SIGN_IN_FAILED,
  SIGN_IN_SUCCESS,
  SIGN_OUT_FAILED,
  SIGN_OUT_SUCCESS,
} from "../actions/types";

const user = JSON.parse(localStorage.getItem("user-data"));

const initialState = user
  ? {
      isLoggedIn: true,
      _id: user._id,
      user: user.name,
      username: user.username,
      socket: null,
    }
    : {
      isLoggedIn: false,
      _id: null,
      user: null,
      username: null,
      socket: null
    };

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        _id: payload._id,
        user: payload.name,
        username: payload.username,
      };
    case SIGN_IN_FAILED:
      return {
        ...state,
        isLoggedIn: false,
      };
    case SIGN_OUT_SUCCESS:
      return {
        isLoggedIn: false,
        _id: null,
        user: null,
        username: null,
        socket: null
      }
    case SIGN_OUT_FAILED:
      return {
        isLoggedIn: false,
        _id: null,
        user: null,
        username: null,
        socket: null
      }
    case CONNECT_SOCKET:
      return {
        ...state,
        socket: action.socket
      }
    case DISCONNECT_SOCKET:
      return {
        ...state,
        socket: null
      }
    default:
      return state;
  }
}
