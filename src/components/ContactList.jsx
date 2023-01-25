import { useAuth } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTowerBroadcast,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "./ChatRoom";
import ContactItem from "./ContactItem";

export default function ContactList() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [receiverID, setReceiverID] = useState("");
  const [contacts, setContacts] = useState([]);
  const [publicServer, setPublicServer] = useState(null)

  useEffect(() => {
    console.log(contacts, "state contacts");
  }, []);

  const addContact = () => {
    console.log(contacts, "state contacts");
    if (receiverID === "") return;
    setContacts([...contacts, receiverID]);
    setReceiverID("");
  };

  const sendBroadcast = () => {
    socket.emit("public-server", {id: socket.id});
  };

  return (
    <div
      className="card h-100 border-0"
      style={{ maxWidth: "48vh", maxHeight: "98vh" }}
    >
      <div
        className="card-header text-center"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <h2 className="p-3" style={{ color: "#6c6665" }}>
          Contacts
        </h2>
      </div>
      <div
        className="card-body overflow-auto"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div className="d-flex flex-column gap-2">
          <div className="input-group w-auto">
            <button
              className="btn text-white"
              style={{ backgroundColor: "#1c94f7" }}
              onClick={sendBroadcast}
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
              className="btn text-white"
              style={{ backgroundColor: "#1c94f7" }}
              onClick={addContact}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </div>
          <hr />
          {contacts.map((item, index) => {
            return <ContactItem key={index + 1} newContact={item} />;
          })}
        </div>
      </div>
      <div
        className="card-footer border-top-0"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div className="form-group row mx-auto">
          <button
            className="btn btn-outline-danger border-2 rounded-2 mx-auto w-auto"
            onClick={() => {
              auth.logOut(() => navigate("/"));
            }}
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}
