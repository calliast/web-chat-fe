import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ChatBox from "./components/ChatBox";
import RequireAuth from "./auth/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <ChatBox />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
