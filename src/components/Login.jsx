import { Fragment, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux"
;
import { signIn } from "../actions/auth";
import "../styles/Login.css";

export default function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let location = useLocation().state?.from?.pathname || "/";

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      let formData = new FormData(event.currentTarget);
      let username = formData.get("username");

      dispatch(
        signIn(username, () => {
          navigate(location, { replace: true });
        })
      );
    },
    [dispatch]
  );

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
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="username"
                      className="form-control mb-2"
                      placeholder="Username"
                      required
                    />
                    {/* <div className="alert alert-danger" role="alert">
                      A simple danger alert—check it out!
                    </div> */}
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
