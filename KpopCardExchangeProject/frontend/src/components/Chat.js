import React, { useState, useCallback, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Chat.css";

function Chat() {
    const { userId } = useParams();
    const { token, user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatUser, setChatUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMessages = useCallback(async () => {
        if (!userId || !token) return;
        try {
            const res = await axios.get(`http://localhost:8080/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);

            await axios.post(
                `http://localhost:8080/messages/mark-read/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages");
        }
    }, [userId, token]);

    const fetchUserInfo = useCallback(async () => {
        if (!userId || !token) return;
        try {
            const res = await axios.get(`http://localhost:8080/users/public/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChatUser(res.data);
        } catch (err) {
            console.error("Failed to load chat user:", err);
            setError("Failed to load user info");
        }
    }, [userId, token]);

    useEffect(() => {
        const loadChat = async () => {
            await Promise.all([fetchMessages(), fetchUserInfo()]);
            setLoading(false);
        };
        loadChat();
    }, [userId, fetchMessages, fetchUserInfo]);

    useEffect(() => {
        const container = document.querySelector(".messages");
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!userId || !message.trim()) return;
        try {
            await axios.post(
                `http://localhost:8080/messages`,
                { content: message, recipient: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("");
            fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Error sending message");
        }
    };

    if (!userId || userId === user?._id) {
        return (
            <div className="chat-empty-box">
                <h2>You cannot chat with yourself</h2>
            </div>
        );
    }

    if (error) {
        return <div className="chat-empty-box text-danger">Error: {error}</div>;
    }

    if (loading) {
        return <div className="chat-empty-box">Loading...</div>;
    }

    if (messages.length === 0) {
        return (
            <div className="chat-empty-box">
                <h2>People you've chatted with:</h2>
                <p><em>You haven't chatted with anyone yet.</em></p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>
                    Chat with: {chatUser?.name?.first || chatUser?.email || "Unknown User"}
                </h3>
            </div>
            <div className="messages">
                {messages.map((msg, index) => {
                    const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
                    const isSentByMe = senderId === user?._id;
                    return (
                        <div key={index} className={`message ${isSentByMe ? "sent" : "received"}`}>
                            <p>{msg.content}</p>
                        </div>
                    );
                })}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    aria-label="Message input"
                />
                <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    aria-label="Send message"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;
