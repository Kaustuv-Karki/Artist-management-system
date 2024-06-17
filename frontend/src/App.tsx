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
import PrivateRoute from "./utils/protectedRoute";
import SongsList from "./pages/SongsList";
import AddSong from "./pages/AddSong";
import EditSongs from "./pages/EditSongs";

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
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/add-artist" element={<AddArtist />} />
            <Route path="/edit-artist/:id" element={<EditArtist />} />
            <Route path="/artist/songs/:artistId" element={<SongsList />} />
            <Route path="/add-song/:artistId" element={<AddSong />} />
            <Route path="/edit-song/:songId" element={<EditSongs />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
