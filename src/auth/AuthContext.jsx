import { createContext, useContext } from "react";

export const AuthContext = createContext({
  signIn: (username, callback) => {},
  signOut: (callback) => {},
});

export function useAuth() {
  return useContext(AuthContext);
}