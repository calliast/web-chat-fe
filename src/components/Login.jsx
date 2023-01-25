import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import "../styles/Login.css";

export default function Login() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username");

    auth.logIn(username, () => {
      navigate(from, { replace: true });
    });
  }

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

// export default function Login() {
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     // Perform login logic here
//     // ...

//     // Navigate to the dashboard
//     navigate("/main");
//   };

//   return (
//     <Fragment>
//       <div className="container justify-content-center">
//         <div className="row d-flex align-items-center">
//           <div className="col-md-12 d-flex justify-content-center align-items-center">
//             <div className="card">
//               <div className="card-header text-center align-items-center pt-3">
//                 <h5 className="text-success">LOGIN</h5>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handleLogin}>
//                   <div className="form-group">
//                     <input
//                       type="text"
//                       className="form-control mb-2"
//                       placeholder="Username"
//                     />
//                     <button type="submit" className="btn btn-login">
//                       LOG IN
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// }
