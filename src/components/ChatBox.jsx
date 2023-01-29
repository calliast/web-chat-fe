import { Fragment } from "react";
import "../styles/ChatBox.css";
import ContactList from "../containers/ContactList";
import ChatRoom from "../containers/ChatRoom";

export default function ChatBox() {
  return (
    <Fragment>
      {/* <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col-md-4 h-100">
            <div class="card mw-100">
              <div class="card-header">Contact List</div>
              <div class="card-body overflow-auto">
                <form class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search"
                  />
                  <button class="btn btn-outline-secondary" type="submit">
                    Search
                  </button>
                </form>
              </div>
            </div>
            <div className="card mw-100 ">
              <div className="card-body mw-100" style={{height: "50vh", overflow: "auto"}}>
                <div className="d-flex flex-column mw-100">
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                  <div className="message">contact</div>
                </div>
              </div>
              <div class="card-footer justify-content-center">
                <button class="btn btn-danger">Logout</button>
              </div>
            </div>
          </div>
          <div class="col-md-8 h-100" style={{maxWidth: "100vw"}}>
            <div className="card mw-100">
              <div class="card-header">Receiver Name</div>
            </div>
            <div class="card h-100 mw-100">
              <div class="card-body" style={{height: "500px", overflow: "auto"}}>
                
                <div className="d-flex flex-column">

                Select chat to start messaging
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container-fluid bg-white pt-1 border">
        <div className="row p-2">
          <div className="col-4 bg-white">
            <ContactList />
          </div>
          <ChatRoom />
        </div>
      </div>
    </Fragment>
  );
}
