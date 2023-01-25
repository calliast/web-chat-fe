import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import ChatItem from "./ChatItem";
import ChatAddMe from "./ChatAddMe";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

export const socket = io("http://localhost:3136");

export default function ChatRoom() {
  const newMessageSent = useRef(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [notify, setNotify] = useState("");
  const [broadcastID, setBroadcastID] = useState("");
  const [sentID, setSentID] = useState(crypto.randomUUID());
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log(`this session ID: ${socket.id}`);
      setNotify(`You are connected with ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("public-server", ({id}) => {
      console.log("someone broadcasted their ID", id);
      setBroadcastID(id);
    });

    socket.on("new-message", (newMessage) => {
      setMessage([...message, newMessage]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("broadcast-id");
      socket.off("new-message");
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage([...message, input]);
    sendMessage(input);
    setInput("");
    newMessageSent.current.scrollTop = newMessageSent.current.scrollHeight;
  };

  const sendMessage = (message) => {
    socket.emit("message", message, sentID);
  };

  return (
    <Fragment>
      <div className="col-8 mh-100 bg-white">
        <div className="card border-0 mw-100">
          <div className="card-header text-center border-0">
            <h2 className="p-3">Receiver Name</h2>
          </div>
        </div>
        <div
          className="card mt-4 border-0 mw-100 max-vh-83"
          style={{
            backgroundColor: "#f8f8f8",
          }}
        >
          <div className="card-body p-2 mw-100">
            <div
              className="d-flex flex-column border-0 rounded bg-white"
              style={{
                overflowY: "scroll",
                height: 600,
                minHeight: "40vh",
                maxHeight: "69vh",
              }}
              ref={newMessageSent}
            >
              {notify && <ChatItem message={notify} />}
              {broadcastID && <ChatAddMe userId={broadcastID} />}
              {message.map((item, index) => {
                return <ChatItem key={index + 1} message={item} />;
              })}
            </div>
            <div className="form-group mb-0 bg-white rounded">
              <form className="w-auto" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    name="chat"
                    id="chat"
                    className="form-control mx-2 rounded-pill bg-white"
                    placeholder="Write a message..."
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary rounded-circle border-0"
                      type="submit"
                      style={{ backgroundColor: "#1c94f7" }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} color="white" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
