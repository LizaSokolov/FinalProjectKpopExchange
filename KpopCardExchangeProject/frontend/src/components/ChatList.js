import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/ChatList.css";

function ChatList() {
    const { token, user } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (!user || !token) return;

        const fetchChatContacts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/users/chat-contacts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setContacts(res.data);
            } catch (error) {
                console.error("Error fetching chat contacts:", error);
            }
        };

        fetchChatContacts();
    }, [token, user]);

    if (!user) {
        return (
            <main className="page-wrapper">
                <div className="chatlist-container">Loading...</div>
            </main>
        );
    }

    return (
        <main className="page-wrapper">
            <div className="chatlist-container">
                <h3>People you've chatted with:</h3>

                {contacts.length === 0 ? (
                    <p className="chatlist-empty">You haven't chatted with anyone yet.</p>
                ) : (
                    <ul className="list-unstyled">
                        {contacts.map((u) => (
                            <li key={u._id} className="chatlist-item">
                                <span>{u.name?.first || u.email}</span>
                                <Link className="chatlist-btn btn btn-sm" to={`/chat/${u._id}`}>
                                    Chat
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}

export default ChatList;
