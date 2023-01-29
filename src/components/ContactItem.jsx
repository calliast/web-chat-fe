import { Fragment } from "react";

export default function ContactItem({ name, selected, set }) {
  return (
    <Fragment>
      <div className={selected === name ? "p-2 bg-blue" : "p-2 bg-grey"}>
        <div className={selected === name ? "px-2 text-white" : "px-2 text-secondary"} onClick={set}>{name}</div>
      </div>
    </Fragment>
  );
}
