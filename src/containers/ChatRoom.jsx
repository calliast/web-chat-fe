import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import ChatItem from "../components/ChatItem";
import ChatAddMe from "../components/ChatAddMe";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveMessage, sendMessage } from "../actions/action";

export const socket = io("http://192.168.1.7:3036");

export default function ChatRoom() {
  const newMessageSent = useRef(null);
  const [input, setInput] = useState("");
  const [displayMessage, setDisplayMessage] = useState([]);
  const dispatch = useDispatch();
  const db = useSelector((state) => state.db);
  const user = useSelector((state) => state.user);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [notify, setNotify] = useState("");
  const [broadcastID, setBroadcastID] = useState("");

  useEffect(() => {
    // console.log("useeffect chatRoom ke trigger", user);
    if (user.isLoggedIn) {
      socket.on("connect", () => {
        setIsConnected(true);
        // setNotify(`You are connected with ID: ${socket.id}`);
        console.log(`You are connected with ID: ${socket.id}`);
        socket.emit("join-room", user.username);
      });

      socket.on(`receive-chat`, (payload) => {
        console.log("payload diterima", payload);
        if (payload.roomID.split("$_&_$").length === 1) {
          payload.roomID = `${payload.sentBy}$_&_$${payload.roomID}`;
        }
        dispatch(receiveMessage(payload));
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      // socket.on("public-server", ({ id }) => {
      //   console.log("someone broadcasted their ID", id);
      //   setBroadcastID(id);
      // });

      // socket.on("new-message", (newMessage) => {
      //   setDisplayMessage((prevMessage) => [...prevMessage, newMessage]);
      // });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("receive-chat");
        socket.off("new-message");
      };
    }
  }, [user.isLoggedIn]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      message: input,
      sentBy: user.username,
      receiverID: db.selectedContact,
      roomID: db.selectedChat.roomID,
      // ? db.selectedChat.roomID
      // : db.selectedContact,
    };
    // setDisplayMessage((prevMessage) => [...prevMessage, input]);
    dispatch(sendMessage(payload));
    sendMessageSocket(payload);
    setInput("");
    newMessageSent.current.scrollTo(0, newMessageSent.current.scrollHeight);
  };

  const sendMessageSocket = (payload) => {
    socket.emit("send-chat", payload);
  };

  const test = () => {
    const payload = {
      message: input,
      sentBy: user.username,
      receiverID: db.selectedContact,
      roomID: db.selectedChat.roomID
        ? db.selectedChat.roomID
        : db.selectedContact,
    };
    console.log("check payload", payload);
    console.log("check selected chat", db);
  };

  const addMe = () => {
    console.log(broadcastID);
  };
  // console.log(db.selectedChat.conversations, 'cek');

  return (
    <Fragment>
      <div className="col-8 bg-white">
        <div className="card border-0 mw-100">
          <div className="card-header text-center border-0">
            <h2 className="p-3">Receiver Name</h2>
          </div>
          <button type="button" onClick={test} className="btn btn-secondary">
            test
          </button>
        </div>
        <div className="card mt-4 border-0 mw-100 bg-grey">
          <div className="card-body p-2">
            {db.selectedContact ? (
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
                  {/* {notify && <ChatItem message={notify} />}
                  {broadcastID && (
                    <ChatAddMe addMe={() => addMe(broadcastID)} />
                  )} */}
                  {
                    // showMessage &&
                    db.selectedChat.conversations.map((item, index) => {
                      return (
                        <ChatItem
                          key={index + 1}
                          message={item.message}
                          sentBy={item.sentBy}
                        />
                      );
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
                  // minHeight: "40vh",
                  // maxHeight: "100vh",
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
              <button className="btn btn-primary" onClick={test}>
                Yes
              </button>
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
