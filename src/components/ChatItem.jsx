import { Fragment, useCallback, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckDouble,
  faExclamation,
  faExclamationCircle,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { resendMessageRedux } from "../actions/action";
import moment from "moment";

export default function ChatItem(props) {
  const user = useSelector((state) => state.user);
  const db = useSelector((state) => state.db);
  const dispatch = useDispatch();
  const isSentID = props.sentID === user._id;
  const messagePosition = isSentID ? " align-self-end" : "";
  const messageColor = isSentID ? " bg-blue" : " bg-grey-1";
  const textColor = isSentID ? " text-white" : "";
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const resendMessage = () => {
    dispatch(
      resendMessageRedux(props._id, {
        message: props.message,
        sentID: props.sentID,
        receiverID: props.receiverID,
        sentStatus: true,
        readStatus: props.readStatus,
        deleteStatus: props.deleteStatus,
      })
    );
  };

  const handleSetRemoveMessageID = useCallback(() => {
    props.handleRemove((prevState) => {
      return {
        _id: props._id,
        message: props.message,
        receiverID: db.selectedContact.username,
        chatID: db.selectedChat._id,
        sentStatus: props.sentStatus,
      };
    });
  }, [
    props._id,
    props.sentStatus,
    db.selectedContact.username,
    db.selectedChat._id,
  ]);

  return (
    <Fragment>
      <div
        className={`px-3 ${messagePosition} d-flex`}
        style={{ maxWidth: "60vw" }}
      >
        {isSentID && !props.deleteStatus && isButtonVisible && (
          <button
            className="btn bg-white rounded-circle border-0"
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
            onClick={handleSetRemoveMessageID}
            data-bs-toggle="modal"
            data-bs-target="#deleteMessage"
          >
            <FontAwesomeIcon icon={faTrash} color="grey" />
          </button>
        )}
        {isSentID && !props.deleteStatus && !props.sentStatus && (
          <button
            className="btn bg-white rounded-circle border-0"
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
            onClick={() => resendMessage()}
            title="Resend this message"
          >
            <FontAwesomeIcon icon={faUndo} color="grey" />
          </button>
        )}
        <div className="d-inline-block my-1">
          <div
            className={`d-flex ${
              props.message.length > 34 ? "flex-column" : "flex-row"
            } px-2 py-2 border-0${messageColor}`}
            style={{ borderRadius: 10 }}
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
          >
            <Markdown
              children={props.message}
              className={`${
                props.message.length > 34 ? "mx-2 " : "mx-2 "
              }${textColor}`}
              style={{ fontSize: "14px", maxWidth: "32vw" }}
            ></Markdown>
            <div className="d-flex flex-row-reverse">
              {isSentID && props.sentStatus && (
                <>
                  <div
                    className="bg-blue rounded-circle border-0 align-self-end p-2"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "0.4em",
                      height: "0.4em",
                      marginLeft: "3px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={props.readStatus ? faCheckDouble : faCheck}
                      color={props.readStatus ? `cyan` : `yellow`}
                      className="fa-sm"
                    />
                  </div>
                </>
              )}
              <div
                className="rounded-circle border-0 align-self-end p-2 mx-2"
                style={{
                  display: "flex",
                  width: "1em",
                  height: "0.4em",
                  marginLeft: "3px",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: 12,
                }}
              >
                {moment(props.sentTime).format("hh:mm")}
              </div>
            </div>
          </div>
        </div>
        {isSentID && !props.sentStatus && (
          <div className="btn pt-2 bg-white rounded-circle border-0 align-items-center">
            <FontAwesomeIcon icon={faExclamation} color="orange" className="fa-lg"/>
          </div>
        )}
      </div>
    </Fragment>
  );
}
