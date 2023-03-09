export function authHeader() {
  const data = JSON.parse(localStorage.getItem("user-data"));

  if (data && data.token) {
    console.log("🚀 ~ file: utils.js:3 ~ authHeader ~ data", data);
    return { Authorization: "Bearer " + data.token };
  } else {
    return {};
  }
}
