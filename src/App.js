import { useContext, Fragment, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import {authenticator} from "./helpers/utils";
import { useState } from "react";
import { LoggedIn } from "./helpers/header";

import Login from "./components/Login";
import ChatBox from "./components/ChatBox";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <ChatBox />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

const AuthContext = createContext({
  logIn: (username, callback) => {},
  logOut: (callback) => {},
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  let value = {
    logIn: (username, callback) => {
      setUser(username);
      return authenticator.logIn(username, () => {
        setUser(username);
        callback();
      });
    },
    logOut: (callback) => {
      return authenticator.logOut(() => {
        setUser(null);
        callback();
      });
    },
    validate: () => {
      return authenticator.validate()
    }
  };

  value.user = user;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }) {
  return (
    <Fragment>
      <LoggedIn />
      <Fragment>{children}</Fragment>
    </Fragment>
  );
}
