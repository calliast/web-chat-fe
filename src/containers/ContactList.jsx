import { useAuth } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTowerBroadcast,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { socket } from "./ChatRoom";
import ContactItem from "../components/ContactItem";

import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../actions/auth";

export default function ContactList() {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [receiverID, setReceiverID] = useState("");
  // const [contacts, setContacts] = useState([]);
  const [publicServer, setPublicServer] = useState(null);
  const contacts = useSelector(state => state.contacts)

  const addContact = () => {
    if (receiverID === "") return;
    // setContacts([...contacts, receiverID]);
    setReceiverID("");
  };

  const sendBroadcast = () => {
    socket.emit("public-server", { id: socket.id });
  };

  return (
    <div
      className="card h-100 border-0"
      style={{ maxWidth: "48vh", maxHeight: "98vh" }}
    >
      <div className="card-header text-center bg-grey">
        <h2 className="p-3" style={{ color: "#6c6665" }}>
          Contacts
        </h2>
      </div>
      <div className="card-body overflow-auto bg-grey">
        <div className="d-flex flex-column gap-2">
          <div className="input-group w-auto">
            <button
              className="btn text-white bg-blue"
              onClick={sendBroadcast}
              title="Broadcast your ID into Public Server"
            >
              <FontAwesomeIcon icon={faTowerBroadcast} />
            </button>
            <input
              type="text"
              className="form-control bg-white"
              style={{ maxWidth: "35vh" }}
              onChange={(e) => setReceiverID(e.target.value)}
              value={receiverID}
              required
            />
            <button
              className="btn text-white bg-blue"
              onClick={addContact}
              title="Add ID to your contact list"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </div>
          <hr />
          <ContactItem newContact={"public-server"} />
          {contacts.map((item, index) => {
            return <ContactItem key={index + 1} newContact={item} />;
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
  );
}
