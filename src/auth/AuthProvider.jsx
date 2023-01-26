import { signIn, signOut } from "../helpers/utils";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {

  let value = {
    signIn: (username, callback) => {
      return signIn(username, () => {
        callback();
      });
    },
    signOut: (callback) => {
      return signOut(() => {
        callback();
      });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
