import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Profile from "./pages/Profile.js";
import Notifications from "./pages/Notifications.js";
import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";
import AddCard from "./pages/AddCard";
import MyCards from "./pages/MyCards";
import EditCard from "./pages/EditCards.js";
import Chat from "./components/Chat.js";
import ChatList from "./components/ChatList.js";
import PublicProfile from "./pages/PublicProfile.js";
import EditProfile from "./components/EditProfile.js";
import Footer from "./components/Footer";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Navbar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route
              path="/my-cards"
              element={
                <PrivateRoute>
                  <MyCards />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-card"
              element={
                <PrivateRoute>
                  <AddCard />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-card/:id"
              element={
                <PrivateRoute>
                  <EditCard />
                </PrivateRoute>
              }
            />
            <Route path="/chat-list" element={<ChatList />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/chat/:userId"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>

  );
}


export default App;
