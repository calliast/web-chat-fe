import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    // Perform login logic here
    // ...

    // Navigate to the dashboard
    navigate("/main");
  };

  return (
    <Fragment>
      <div className="container justify-content-center">
        <div className="row d-flex align-items-center">
          <div className="col-md-12 d-flex justify-content-center align-items-center">
            <div className="card">
              <div className="card-header text-center align-items-center pt-3">
                <h5 className="text-success">LOGIN</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Username"
                    />
                    <button type="submit" className="btn btn-login">
                      LOG IN
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
