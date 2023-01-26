import { combineReducers } from "redux";
import userReducer from "./user";
import contactsReducer from "./contacts";
import chatReducer from "./chat";

export default combineReducers({
    user: userReducer,
    contacts: contactsReducer,
    chat: chatReducer
})