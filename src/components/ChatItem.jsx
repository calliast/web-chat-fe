import { Fragment, useState } from "react";
import Markdown from "markdown-to-jsx";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faExclamationCircle, faExclamationTriangle, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { resendMessageRedux } from "../actions/action";

export default function ChatItem(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const messagePosition = props.sentID === user._id ? " align-self-end" : "";
  const messageColor = props.sentID === user._id ? " bg-blue" : " bg-grey-1";
  const textColor = props.sentID === user._id ? " text-white" : "";
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
      <div className={`px-3${messagePosition}`}>
        {messagePosition && isButtonVisible && (
          <button
            className="btn bg-white rounded-circle border-0"
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
            onClick={props.removeMessage}
          >
            <FontAwesomeIcon icon={faTrash} color="grey" />
          </button>
        )}
        {messagePosition && !props.sentStatus && (
          <button
            className="btn bg-white rounded-circle border-0"
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
            onClick={() => resendMessage()}
          >
            <FontAwesomeIcon icon={faUndo} color="grey" />
          </button>
        )}
        <div className="d-inline-block mt-2">
          <div
            className={`py-2 px-3 text-wrap border-0${messageColor}`}
            style={{ borderRadius: 10 }}
            onMouseEnter={() => setIsButtonVisible(true)}
            onMouseLeave={() => setIsButtonVisible(false)}
          >
            <Markdown
              children={props.message}
              className={textColor}
              style={{ fontSize: "14px" }}
            ></Markdown>
          </div>
        </div>
        {!props.sentStatus &&
        <div className="btn bg-white rounded-circle border-0">
          <FontAwesomeIcon icon={faExclamationCircle} color="orange"/>
        </div>

        }
      </div>
    </Fragment>
  );
}
