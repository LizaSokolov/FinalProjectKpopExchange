import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import "../styles/Navbar.css";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
    const { isLoggedIn, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchUnreadCount = async () => {
            try {
                const res = await axios.get("http://localhost:8080/messages/unread/count", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUnreadCount(res.data.count || 0);
            } catch (err) {
                console.error("Failed to fetch unread count:", err);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 15000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (location.pathname.startsWith("/chat/")) {
            setUnreadCount(0);
        }
        setMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-inner">
                <NavLink className="navbar-brand" to="/">
                    K-pop Exchange
                </NavLink>

                <button
                    className="burger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="burger-icon">&#9776;</span>
                </button>

                <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
                    {isLoggedIn && (
                        <li>
                            <NavLink to="/notifications">Notifications</NavLink>
                        </li>
                    )}
                    {isLoggedIn ? (
                        <>
                            <li><NavLink to="/my-cards">My Cards</NavLink></li>
                            <li><NavLink to="/add-card">Add Card</NavLink></li>
                            <li><NavLink to="/profile">Profile</NavLink></li>
                            <li>
                                <NavLink to="/chat-list">
                                    Chat {unreadCount > 0 && <span className="nav-badge" />}
                                </NavLink>
                            </li>
                            <li>
                                <button className="logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/login">Login</NavLink></li>
                            <li><NavLink to="/register">Register</NavLink></li>
                        </>
                    )}
                    <li className="theme-toggle-item">
                        <ThemeToggle />
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
