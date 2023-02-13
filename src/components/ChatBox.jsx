import { Fragment } from "react";
import "../styles/ChatBox.css";
import ContactList from "../containers/ContactList";
import ChatRoom from "../containers/ChatRoom";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ChatBox() {
  const { isLoggedIn } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <Fragment>
      <div className="container border min-vw-100">
        <div className="row pt-4">
          <div
            className="col-4"
            style={{ height: "100vh", maxHeight: "100vh" }}
          >
            <ContactList/>
          </div>
          <div
            className="col-8"
            style={{ height: "100vh", maxHeight: "100vh" }}
          >
            <ChatRoom/>
          </div>
        </div>
      </div>

    </Fragment>
  );
}
