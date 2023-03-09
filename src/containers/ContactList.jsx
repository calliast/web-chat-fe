import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import ContactItem from "../components/ContactItem";

import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../actions/action.auth";
import { addContact, loadUserData, selectContact } from "../actions/action";

export default function ContactList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const db = useSelector((state) => state.db);
  const user = useSelector((state) => state.user);

  const [newContact, setNewContact] = useState("");
  const [contactActive, setContactActive] = useState(null);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact === "") return;
    dispatch(addContact(newContact.toLowerCase()));
    setNewContact("");
  };

  const handleSelectContact = (contact) => {
    setContactActive(contact.username);
    dispatch(selectContact(contact));
  };

  const handleSignOut = () => {
    dispatch(
      signOut(() => {
        navigate("/", { replace: true });
      })
    );
  };

  return (
    <Fragment>
      <div className="card mw-100 mh-100 border-0">
        <div
          className="card-header bg-grey d-flex flex-column justify-content-center align-items-center border-0"
          style={{ height: "15vh" }}
        >
          <h6 className="text-success text-decoration-underline">
            Welcome {user.name}
          </h6>
          <h4 className="text-secondary">Contact List</h4>
        </div>
        <div className="card-body bg-grey border-top border-bottom">
          <div
            className="d-flex flex-column overflow-auto"
            style={{ height: "62vh", maxHeight: "62vh" }}
          >
            {db.contacts.map((item, index) => {
              return (
                <ContactItem
                  key={index + 1}
                  _id={item._id}
                  name={item.username}
                  contactActive={contactActive}
                  unread={item.unreadCount}
                  setActive={() =>
                    handleSelectContact({
                      _id: item._id,
                      username: item.username,
                      name: item.name,
                      unreadCount: item.unreadCount,
                    })
                  }
                />
              );
            })}
          </div>
        </div>
        <div
          className="card-footer d-flex justify-content-center align-items-center border-0"
          style={{ height: "15vh", maxHeight: "15vh" }}
        >
          <button className="btn btn-outline-danger" onClick={handleSignOut}>
            Logout
          </button>
        </div>
      </div>
    </Fragment>
  );
}
