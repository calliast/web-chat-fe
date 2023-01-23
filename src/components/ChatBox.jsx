import { Fragment } from "react";
import "./ChatBox.css";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";

export default function ChatBox() {
  return (
    <Fragment>
      <div className="container-fluid h-100 w-100 bg-white pt-5">
        <div className="row p-4 border border-warning">
          <div className="col col-md-4" style={{ backgroundColor: "#fff" }}>
            <ChatList />
          </div>
          <div
            className="col-12 col-md-8 h-100"
            style={{ backgroundColor: "#fff" }}
          >
            <ChatRoom/>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
