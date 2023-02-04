import { Fragment, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckDouble,
  faExclamationCircle,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { resendMessageRedux } from "../actions/action";
import moment from "moment";

export default function ChatItem(props) {
  const user = useSelector((state) => state.user);
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

  return (
    <Fragment>
      <div
        className={`px-3 ${messagePosition} d-flex`}
        style={{ maxWidth: "60vw" }}
      >
        {isSentID && isButtonVisible && (
          <button
            className="btn bg-white rounded-circle border-0"
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
            onClick={props.removeMessage}
          >
            <FontAwesomeIcon icon={faTrash} color="grey" />
          </button>
        )}
        {isSentID && !props.sentStatus && (
          <button
            className="btn bg-white rounded-circle border-0"
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
            onClick={() => resendMessage()}
          >
            <FontAwesomeIcon icon={faUndo} color="grey" />
          </button>
        )}
        <div className="d-inline-block my-1">
          <div
            className={`d-flex ${props.message.length > 34 ? 'flex-column': 'flex-row'} px-3 py-2 border-0${messageColor}`}
            style={{ borderRadius: 10 }}
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
          >
            <Markdown
              children={props.message}
              className={`${props.message.length > 34 ? '': 'mx-2 '}${props.deleteStatus ? `grey` : textColor}`}
              style={{ fontSize: "14px", maxWidth: "32vw" }}
            ></Markdown>
            <div className="d-flex flex-row-reverse">
              {isSentID && props.sentStatus && (
                <>
                  <div
                    className="bg-blue rounded-circle border-0 align-self-end p-2"
                    onClick={() => resendMessage()}
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
                onClick={() => resendMessage()}
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
          <div className="btn bg-white rounded-circle border-0">
            <FontAwesomeIcon icon={faExclamationCircle} color="orange" />
          </div>
        )}
      </div>
    </Fragment>
  );
}
