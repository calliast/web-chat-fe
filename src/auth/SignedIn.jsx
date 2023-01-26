import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function SignedIn() {
  const data = JSON.parse(localStorage.getItem("user-data"));
  let location = useLocation();

  if (data) return

  return (
    <Fragment>
      <Navigate to="/login" state={{ from: location }} replace />
    </Fragment>
  );
}