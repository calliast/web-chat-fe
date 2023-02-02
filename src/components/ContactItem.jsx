import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import "../styles/ContactItem.css";

export default function ContactItem({
  name,
  contactActive,
  setActive,
  unread,
}) {
  return (
    <Fragment>
      <div
        className={
          contactActive === name
            ? "p-2 bg-blue d-flex justify-content-between align-items-center"
            : "p-2 bg-grey d-flex justify-content-between align-items-center"
        }
        onClick={setActive}
      >
        <span
          className={
            contactActive === name ? "px-2 text-white" : "px-2 text-secondary"
          }
        >
          {name}
        </span>
        <div>
          <div
            style={{
              display: `${unread > 0 ? "flex" : "none" }`,
              alignItems: "center",
              justifyContent: "center",
              width: "1.25em",
              height: "1.25em",
              borderRadius: "50%",
              backgroundColor: "#e14545",
            }}
          >
            <span className="text-white badge badge-light">{unread > 0 ? unread : ""}</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
