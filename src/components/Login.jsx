import { Fragment } from "react";
import "./Login.css";

export default function Login() {
  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header text-center">LOGIN</div>
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Username"
                    />
                    <button
                      type="submit"
                      className="btn btn-login btn-block"
                    >
                      Login
                    </button>
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
