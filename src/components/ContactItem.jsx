import { Fragment } from "react";

export default function ContactItem({ newContact }) {
  console.log(newContact, "item i contactItem");
  return (
    <Fragment>
      <div className="p-2 bg-blue rounded-4">
        <div className="px-2 text-white">{newContact}</div>
      </div>
    </Fragment>
  );
}
