import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import ChatBox from "./components/ChatBox";
import React from "react";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatBox />} />
      </Routes>
    </Router>
  );
}
