import { combineReducers } from "redux";
import userReducer from "./user";
import dbReducer from "./db";

export default combineReducers({
    user: userReducer,
    db: dbReducer,
})