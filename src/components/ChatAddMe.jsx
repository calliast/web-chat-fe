import { Fragment, useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function ChatAddMe({ userId }) {
  const { user, setUser } = useState(userId);

  const addMe = () => {
    console.log(user);
  };

  return (
    <Fragment>
      <div className="px-3">
        <div className="d-inline-block mt-2">
          <div
            className="py-2 px-3 bg-success input-group"
            style={{ borderRadius: 10 }}
          >
            <div className="input-group-text">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <button
              className="btn text-white border-white"
              style={{ fontSize: "14px" }}
              onClick={addMe}
            >
              Send message to me
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
