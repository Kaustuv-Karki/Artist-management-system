import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import AddArtist from "./pages/AddArtist";
import EditArtist from "./pages/EditArtist";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const client = new QueryClient();
  return (
    <>
      <QueryClientProvider client={client}>
        <Router>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/add-artist" element={<AddArtist />} />
            <Route path="/edit-artist/:id" element={<EditArtist />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
