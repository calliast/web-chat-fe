import { Fragment } from "react";
import "../styles/ChatBox.css";
import ContactList from "../containers/ContactList";
import ChatRoom from "../containers/ChatRoom";

export default function ChatBox() {
  return (
    <Fragment>
      <div className="container-fluid h-100 w-100 bg-white pt-5">
        <div className="row p-2">
          <div className="col-4 bg-white">
            <ContactList />
          </div>
          <ChatRoom />
        </div>
      </div>
    </Fragment>
  );
}
