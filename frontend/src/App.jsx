import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import Knowledge from "./components/Knowledge";
import Admin from "./components/Admin";
import Protected from "./components/Protected";


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route
          path="/admin"
          element={
            <Protected>
              <Admin />
            </Protected>
          }
        />
      </Routes>
    </div>
  );
}


export default App;