import { Fragment } from "react";

export default function ContactItem({ newContact }) {
    console.log(newContact, 'item i contactItem');
  return (
    <Fragment>
      <div className="p-2 text-dark">{newContact}</div>
    </Fragment>
  );
}
