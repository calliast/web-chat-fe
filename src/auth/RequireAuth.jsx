import SignedIn from "./SignedIn";
import { Fragment } from "react";

export default function RequireAuth({ children }) {
  return (
    <Fragment>
      <SignedIn />
      <Fragment>{children}</Fragment>
    </Fragment>
  );
}
