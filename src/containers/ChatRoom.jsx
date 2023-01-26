import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import ChatItem from "../components/ChatItem";
import ChatAddMe from "../components/ChatAddMe";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

export const socket = io("http://localhost:3136");

export default function ChatRoom() {
  const newMessageSent = useRef(null);
  const [input, setInput] = useState("");
  const [displayMessage, setDisplayMessage] = useState([]);
  const [chat, setChat] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [notify, setNotify] = useState("");
  const [broadcastID, setBroadcastID] = useState("");
  const [sentID, setSentID] = useState(crypto.randomUUID());

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log(`this session ID: ${socket.id}`);
      setNotify(`You are connected with ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("public-server", ({ id }) => {
      console.log("someone broadcasted their ID", id);
      setBroadcastID(id);
    });

    socket.on("new-message", (newMessage) => {
      setDisplayMessage((prevMessage) => [...prevMessage, newMessage]);
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
    setDisplayMessage((prevMessage) => [...prevMessage, input]);
    sendMessage(input);
    setInput("");
    // newMessageSent.current.scrollIntoView({behavior: "smooth"})
    newMessageSent.current.scrollTo(0, newMessageSent.current.scrollHeight);
  };

  const sendMessage = (message) => {
    socket.emit("message", message, sentID);
  };

  const test = (event) => {
    console.log("scroll bro");
  };

  const addMe = () => {
    console.log(broadcastID);
  };

  return (
    <Fragment>
      <div className="col-8 mh-100 bg-white">
        <div className="card border-0 mw-100">
          <div className="card-header text-center border-0">
            <h2 className="p-3">Receiver Name</h2>
          </div>
        </div>
        <div className="card mt-4 border-0 mw-100 max-vh-83 bg-grey">
          <div className="card-body p-2 mw-100">
            {chat ? (
              <>
                <div
                  id="chat-room"
                  className="d-flex flex-column border-0 rounded bg-white"
                  style={{
                    overflowY: "scroll",
                    height: 480,
                    minHeight: "40vh",
                    maxHeight: "70vh",
                  }}
                  ref={newMessageSent}
                >
                  {notify && <ChatItem message={notify} />}
                  {broadcastID && (
                    <ChatAddMe addMe={() => addMe(broadcastID)} />
                  )}
                  {
                    // showMessage &&
                    displayMessage.map((item, index) => {
                      return <ChatItem key={index + 1} message={item} />;
                    })
                  }
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
                        required
                      />
                      <div className="input-group-append">
                        <button
                          className="btn bg-blue rounded-circle border-0"
                          type="submit"
                        >
                          <FontAwesomeIcon icon={faPaperPlane} color="white" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div
                className="d-flex flex-column border-0 rounded bg-white align-items-center justify-content-center"
                style={{
                  overflowY: "scroll",
                  height: 550,
                  minHeight: "40vh",
                  maxHeight: "80vh",
                }}
              >
                <h6 className="lead text-secondary">
                  <em>Select chat to start messaging</em>
                </h6>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal fade" id="addme">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4>New contact</h4>
            </div>
            <div className="modal-body">Add into contact list?</div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={test}>Yes</button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
