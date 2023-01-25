import { Fragment } from "react";
import "../styles/ChatBox.css";
import ContactList from "./ContactList";
import ChatRoom from "./ChatRoom";

export default function ChatBox() {

  return (
    <Fragment>
      <div className="container-fluid h-100 w-100 bg-white pt-5">
        <div className="row p-2">
          <div className="col-4" style={{ backgroundColor: "#fff" }}>
            <ContactList />
          </div>
            <ChatRoom />
          </div>
      </div>
    </Fragment>
  );
}
