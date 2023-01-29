import { useAuth } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTowerBroadcast,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { socket } from "./ChatRoom";
import ContactItem from "../components/ContactItem";

import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../actions/auth";
import { addContact, selectContact } from "../actions/action";

export default function ContactList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const db = useSelector((state) => state.db);

  const [newContact, setNewContact] = useState("");
  const [contactActive, setContactActive] = useState(null);

  useEffect(() => {
    // console.log('state db di useEffect', db);
  }, []);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact === "") return;
    dispatch(addContact({ id: newContact }));
    setNewContact("");
  };

  const handleSelectContact = (targetID) => {
    setContactActive(targetID);
    dispatch(selectContact(targetID));
    // console.log(db, 'checl status db waktu select');
  };

  const sendBroadcast = () => {
    socket.emit("public-server", { id: socket.id });
  };

  // const selectChat

  const test = () => {
    console.log(contactActive, "state selectednya public-server");
  };

  return (
    <Fragment>
      <div className="card mw-100 border-0">
        <div className="card-header text-center bg-grey">
          <h2 className="p-3" style={{ color: "#6c6665" }}>
            Contacts
          </h2>
        </div>
        <div className="py-3 card-header">
          <form
            className="input-group"
            id="add-contact"
            onSubmit={handleAddContact}
          >
            <button
              type="button"
              className="btn text-white bg-blue"
              onClick={sendBroadcast}
              title="Broadcast your ID into Public Server"
            >
              <FontAwesomeIcon icon={faTowerBroadcast} />
            </button>
            <input
              type="text"
              className="form-control bg-white"
              style={{ maxWidth: "35vh", fontSize: 16 }}
              onChange={(e) => setNewContact(e.target.value)}
              placeholder="Insert ID"
              value={newContact}
              required
            />
            <button
              className="btn text-white bg-blue"
              type="submit"
              form="add-contact"
              title="Add ID to your contact list"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </form>
        </div>
      </div>
      <div
        className="card mw-100 border-0"
        style={{
          // maxWidth: "48vh",
          height: "74vh",
        }}
      >
        <div className="card-body overflow-auto bg-grey">
          <div className="d-flex flex-column gap-2">
            <ContactItem
              id={"public-server"}
              name={"public-server"}
              selected={() => handleSelectContact("public-server")}
              set={() => setContactActive("public-server")}
            />
            {db.contacts.map((item, index) => {
              return (
                <ContactItem
                  key={index + 1}
                  name={item.username}
                  selected={contactActive}
                  set={() => handleSelectContact(item.username)}
                />
              );
            })}
          </div>
        </div>
        <div className="card-footer border-top-0 bg-grey">
          <div className="form-group row mx-auto">
            <button
              className="btn btn-outline-danger border-2 rounded-2 mx-auto w-auto"
              onClick={() => {
                dispatch(signOut(() => navigate("/")));
              }}
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
