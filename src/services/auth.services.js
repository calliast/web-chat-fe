import axios from "axios";
import { authHeader } from "../helpers/utils";

export const api = axios.create({
  baseURL: "http://localhost:3036",
  timout: 3000,
  headers: authHeader(),
});

const userSignIn = async ({ username }) => {
  try {
    const { data: response } = await api.post("/api/auth/signin", { username });
    if (!response.success) throw response;

    setAuthentication(response.data.token);
    return response;
  } catch (error) {
    console.log(
      `SERVICE AUTH FAILED\nError\t: ${error.name}\nCode\t: ${error.code}\nMessage\t: ${error.message}`
    );
    return error;
  }
};

const userSignOut = async () => {
  try {
    const { data: response } = await api.post("/api/auth/signout");

    if (!response.success) throw response;
    setAuthentication(null, "remove");
    return response;
  } catch (error) {
    console.log(
      `SERVICE AUTH FAILED\nError\t: ${error.name}\nCode\t: ${error.code}\nMessage\t: ${error.message}`
    );
    setAuthentication(null, "remove");

    return error;
  }
};

const setAuthentication = (token, set = "set") => {
  set === "set"
    ? localStorage.setItem("user-data", JSON.stringify(token))
    : localStorage.removeItem("user-data");
  return (api.defaults.headers.common["Authorization"] =
    token === null ? null : `Bearer ${token}`);
};

export default {
  userSignIn,
  userSignOut,
  setAuthentication,
};
