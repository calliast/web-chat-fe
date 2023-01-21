import { Fragment } from "react";
import "./ChatBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default function ChatBox() {
  return (
    <Fragment>
      <div class="container-fluid h-100 bg-white">
        <div class="row">
          <div
            class="col-12 h-100 col-md-4"
            style={{ backgroundColor: "#fff" }}
          >
            <div class="card h-100">
              <div
                class="card-header text-center"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                <h2 className="p-3" style={{ color: "#6c6665" }}>
                  Contacts
                </h2>
              </div>
              <div
                class="card-body overflow-auto"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                <div class="d-flex flex-column gap-2">
                  <div class="p-2">Contact 1</div>
                  <div class="p-2">Contact 2</div>
                  <div class="p-2">Contact 3</div>
                  <div class="p-2">Contact 4</div>
                </div>
              </div>
              <div
                class="card-footer border-top-0"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                <div className="form-group row w-100 mx-auto">
                  <button class="btn btn-outline-danger border-2 rounded-2 mx-auto w-auto">
                    LOG OUT
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-12 col-md-8 h-100"
            style={{ backgroundColor: "#fff" }}
          >
            <div class="card h-100">
              <div class="card-header text-center">
                <h2 className="p-3">Contact Name</h2>
              </div>
              <div class="card-body overflow-auto">
                <div class="d-flex flex-column gap-2">
                  <p>Conversation goes here...</p>
                </div>
              </div>
              <div class="card-footer bg-white border-top-0">
                <form class="w-100">
                  <div class="form-group mb-0">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control mx-2 rounded-pill"
                        placeholder="Write a message..."
                      />
                      <div class="input-group-append">
                        <button
                          class="btn btn-primary rounded-circle"
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
          </div>
        </div>
      </div>
    </Fragment>
  );
}
