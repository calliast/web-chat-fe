import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default function ChatRoom() {
  return (
    <Fragment>
      <div className="card border-0" style={{ maxWidth: "100vh" }}>
        <div className="card-header text-center border-0">
          <h2 className="p-3">Receiver Name</h2>
        </div>
      </div>
      <div
        className="card border-0 mt-4"
        style={{ maxWidth: "100vh", maxHeight: "84vh", border: "solid" }}
      >
        <div className="card-body overflow-auto p-4">
          <div className="d-flex flex-column gap-2">
            <p>Conversation goes here...</p>
          </div>
        </div>
        <div className="card-footer bg-white border-top-0">
          <form className="w-100">
            <div className="form-group mb-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control mx-2 rounded-pill"
                  placeholder="Write a message..."
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary rounded-circle"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
