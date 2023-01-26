// import Api from "../services/auth.services";

// export async function signIn(username, callback) {
//   try {
//     const {
//       data: { data, success },
//     } = await Api.userSignIn({ username });
//     if (!success) throw { message: data, code: 401 };
//     Api.setAuthentication(data.token);
//     localStorage.setItem("user-data", JSON.stringify(data));
//     setTimeout(callback, 100);
//   } catch ({ name, message, code, config, request }) {
//     console.log(
//       `Authentication failed\nError\t: ${name}\nCode\t: ${code}\nMessage\t: ${message}`
//     );
//   }
// }

// export async function signOut(callback) {
//   try {
//     const {
//       data: { data, success },
//     } = await Api.userSignOut();
//     if (!success) throw { message: data, code: 401 };
//     localStorage.removeItem("user-data");
//     Api.setAuthentication(null);
//     setTimeout(callback, 100);
//   } catch ({ name, message, code, config, request }) {
//     console.log(
//       `Signout failed\nError\t: ${name}\nCode\t: ${code}\nMessage\t: ${message}`
//     );
//     localStorage.removeItem("user-data");
//     Api.setAuthentication(null);
//     setTimeout(callback, 100);
//   }
// }

export function authHeader() {
  const data = JSON.parse(localStorage.getItem("user-data"));

  if (data && data.token) {
    return { Authorization: "Bearer " + data.token };
  } else {
    return {};
  }
}
