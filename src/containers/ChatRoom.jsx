import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import ChatItem from "../components/ChatItem";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMessageNotice,
  receiveMessage,
  sendMessage,
  updateReadNotice,
} from "../actions/action";
import { connectSocket, closeSocket, offSocket } from "../actions/action.auth";

export default function ChatRoom() {
  const newMessageSent = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const db = useSelector((state) => state.db);
  const user = useSelector((state) => state.user);
  const socket = useSelector((state) => state.user.socket);
  let run = 0;

  useEffect(() => {
    if (run === 1) {
      dispatch(connectSocket());
      return () => {
        dispatch(closeSocket("connect"));
      };
    }
    run++;
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receive-chat", (payload) => {
        dispatch(receiveMessage(payload));
      });
      socket.on("receive-delete-notice", (payload) => {
        console.log("payload dari send-delete-notice", payload);
        dispatch(deleteMessageNotice(payload));
      });
      socket.on("receive-read-notice", ({sentID, receiverID, payload}) => {
        console.log("payload dari receive-read-notice", payload);
        dispatch(updateReadNotice(payload));
      });
      return () => {
        dispatch(offSocket("receive-chat"));
        dispatch(offSocket("receive-delete-notice"));
        dispatch(offSocket("receive-read-notice"));
      };
    }
  }, [socket, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      sendMessage({
        message: newMessage,
      })
    );

    setNewMessage("");
    newMessageSent.current.scrollIntoView({ smooth: true });
  };

  const test = () => {
    const payload = {
      message: newMessage,
      sentID: user.username,
      receiverID: db.selectedContact,
    };
    console.log("check payload", payload);
    console.log("check db", db);
    console.log("check user", user);
  };

  return (
    <Fragment>
      <div className="col-8 bg-white">
        <div className="card border-0 mw-100">
          <div className="card-header text-center border-0">
            <h2 className="p-3">
              {db.selectedContact?.username
                ? db.selectedContact?.username
                : "Receiver Username"}
            </h2>
          </div>
          <button type="button" onClick={test} className="btn btn-secondary">
            test
          </button>
        </div>
        <div className="card mt-4 border-0 mw-100 bg-grey">
          <div className="card-body p-2">
            {db.selectedContact._id ? (
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
                  {db.selectedChat.conversation.map((item, index) => {
                    return (
                      <ChatItem
                        key={index}
                        _id={item._id}
                        message={item.message}
                        sentID={item.sentID}
                        receiverID={item.receiverID}
                        sentStatus={item.sentStatus}
                        readStatus={item.readStatus}
                        deleteStatus={item.deleteStatus}
                        sentTime={item.createdAt}
                      />
                    );
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
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
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
