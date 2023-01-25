import axios from "axios";
import { authHeader } from "./header";

const api = axios.create({
  baseURL: "http://localhost:3036/users",
  timout: 1000,
  headers: authHeader(),
});

export const authenticator = {
  token: null,
  async logIn(username, callback) {
    try {
      const {
        data: { data, success },
      } = await api.post("/auth", { username });
      if (!success) throw { message: data, code: 401 };
      api.defaults.headers.common["Authorization"] = `Bearer ` + data.token;
      localStorage.setItem("user-data", JSON.stringify(data));
      console.log(
        api.defaults.headers.common["Authorization"],
        "check header axios saat login"
      );
      setTimeout(callback, 100);
    } catch ({ name, message, code, config, api }) {
      console.log(`${name}: ${code} when authenticating.`);
    }
  },
  async logOut(callback) {
    try {
      console.log(
        api.defaults.headers.common["Authorization"],
        "check header axios saat logout"
      );
      const {
        data: { data, success },
      } = await api.post("/logout");
      if (!success) throw { message: data, code: 401 };
      localStorage.removeItem("user-data");
      api.defaults.headers.common["Authorization"] = null;
      setTimeout(callback, 100);
    } catch ({ name, message, code, config }) {
      console.log(`${name}: ${code} when logging out.`);
      localStorage.removeItem("user-data");
      api.defaults.headers.common["Authorization"] = null;
      setTimeout(callback, 100);
    }
  },
  async validate() {
    return 'hello validate'
  }
};

/*
ALGORITHM:

    1. confirm the end-session by request post to server
      2. if success:
          a. remove token from localStorage
          b. set default headers to null
          c. set this.token to null
          d. invoke callback
      3. if failed:
          a. throw error "error when logging out"
          b. for security purpose, do the same step as success
    
    */
