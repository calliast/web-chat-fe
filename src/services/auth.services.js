import api from "./apiAxios";

const userSignIn = async ({ username }) => {
  try {
    const { data: response } = await api.post("/api/auth/signin", { username });
    if (!response.success) throw response;

    setAuthentication(response.data);
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
    const response = await api.post("/api/auth/signout");

    if (!response.data.success) throw response;
    setAuthentication(null, false);
    return response;
  } catch (error) {
    console.log(
      `SERVICE AUTH FAILED\nError\t: ${error.name}\nCode\t: ${error.code}\nMessage\t: ${error.message}`
    );
    // console.log("error saat signout request", error);
    setAuthentication(null, false);

    return error;
  }
};

const setAuthentication = (data, set = true) => {
  return set
    ? localStorage.setItem("user-data", JSON.stringify(data))
    : localStorage.removeItem("user-data");
};

export default {
  userSignIn,
  userSignOut,
  setAuthentication,
};
