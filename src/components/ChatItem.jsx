import { Fragment } from "react";
import Markdown from "markdown-to-jsx";

export default function ChatItem({ message }) {
  return (
    <Fragment>
      <div className="px-3">
        <div className="d-inline-block mt-2">
          <div className="py-2 px-3 text-wrap border-0" style={{ backgroundColor: "#1c94f7", borderRadius: 10}}>
          <Markdown
          children={message}
            className="text-white"
            style={{ fontSize: "14px" }}
          >
          </Markdown>

          </div>
        </div>
      </div>
    </Fragment>
  );
}
