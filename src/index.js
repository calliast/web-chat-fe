import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import rootReducers from "./reducers";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = createStore(rootReducers, applyMiddleware(thunk));

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
);