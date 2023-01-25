import { useEffect } from "react";
import { useState } from "react";
import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const authHeader = () => {
  const data = JSON.parse(localStorage.getItem("user-data"));

  if (data && data.token) {
    return { Authorization: "Bearer " + data.token };
  } else {
    return {};
  }
};

export const LoggedIn = () => {
  const data = JSON.parse(localStorage.getItem("user-data"));
  let location = useLocation();
  const [isAuth, setAuth] = useState(!!data)

  useEffect(() => {
    console.log('check storage pada loggedIn', data);
    if (data) {

    }
  }, [])

  return (
    <Fragment>
      {!data && <Navigate to="/login" state={{ from: location }} replace />}
    </Fragment>
  );
};
