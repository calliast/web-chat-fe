import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import ChatItem from "../components/ChatItem";
import { useEffect, useRef, useCallback, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMessageNotice,
  receiveMessage,
  sendMessage,
  updateReadNotice,
  deleteMessage,
  loadUserData,
  addContact,
} from "../actions/action";
import {
  connectSocket,
  closeSocket,
  offSocket,
  newAccount,
} from "../actions/action.auth";

export default function ChatRoom() {
  const newMessageSent = useRef(null);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [removeMessageID, setRemoveMessageID] = useState({
    _id: "",
    message: "",
    sentID: "",
    receiverID: "",
    sentStatus: "",
  });
  const db = useSelector((state) => state.db);
  const user = useSelector((state) => state.user);
  const { socket, isNew } = user;
  let run = 0;

  useEffect(() => {
    console.log("run render");
    if (run === 1) {
      dispatch(connectSocket());
      if (isNew) {
        dispatch(
          newAccount({
            _id: user._id,
            name: user.name,
            username: user.username,
          })
        );
      }
      dispatch(loadUserData());
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
      socket.on("receive-read-notice", ({ payload }) => {
        console.log("payload dari receive-read-notice", payload);
        dispatch(updateReadNotice(payload));
      });
      socket.on("receive-notice-new-account", (payload) => {
        console.log("payload dari receive-notice-new-account", payload);
        dispatch(addContact(payload));
      });
      return () => {
        dispatch(offSocket("receive-chat"));
        dispatch(offSocket("receive-delete-notice"));
        dispatch(offSocket("receive-read-notice"));
        dispatch(offSocket("receive-notice-new-account"));
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

  const handleRemoveMessage = useCallback(() => {
    const payload = {
      _id: removeMessageID._id,
      sentID: removeMessageID.sentID,
      receiverID: removeMessageID.receiverID,
    };
    dispatch(deleteMessage(payload, removeMessageID.sentStatus));
    setTimeout(() => {
      setRemoveMessageID({
        _id: "",
        message: "",
        sentID: "",
        receiverID: "",
        sentStatus: "",
      });
    }, 500);
  }, [removeMessageID, dispatch]);

  return (
    <Fragment>
      <div
        className="card mw-100 mh-100 border-0"
        style={{ height: "15vh", maxHeight: "15vh" }}
      >
        <div className="card-header bg-grey d-flex justify-content-center align-items-center border-0 h-100 rounded-3 border-0">
          <h1>
            {db.selectedContact?.username
              ? db.selectedContact?.username
              : "Receiver Name"}
          </h1>
        </div>
      </div>
      <div
        className="card mw-100 mh-100 border-0"
        style={{ height: "77vh", maxHeight: "77vh", marginTop: "4vh" }}
      >
        <div className="card-body bg-grey rounded-4 border-0">
          <div className="bg-white bg-white rounded-4 border-0">
            {db.selectedContact._id ? (
              <>
                <div
                  id="chat-room"
                  className="d-flex flex-column overflow-auto"
                  style={{ height: "63vh" }}
                  ref={newMessageSent}
                >
                  {db.selectedChat.map((item, index) => {
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
                        handleRemove={setRemoveMessageID}
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
                style={{ height: "73vh" }}
              >
                <h6 className="lead text-secondary">
                  <em>Select chat to start messaging</em>
                </h6>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteMessage">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Delete confirmation</h4>
            </div>
            <div className="modal-body d-flex flex-column justify-content-between align-items-center">
              <span>Are you sure you want to delete this message?</span>
              <div
                className={`bg-blue text-white px-5 py-2 my-1 rounded-2${
                  removeMessageID.message ? `` : ` visually-hidden`
                }`}
              >
                {removeMessageID.message}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn bg-blue text-white text-wrap"
                data-bs-dismiss="modal"
                onClick={handleRemoveMessage}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() =>
                  setTimeout(() => {
                    setRemoveMessageID({
                      _id: "",
                      message: "",
                      sentID: "",
                      receiverID: "",
                      sentStatus: "",
                    });
                  }, 500)
                }
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
