import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Notifications.css"


function Notifications() {
    const { token } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/users/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setNotifications(res.data))
            .catch((err) => console.error("Failed to fetch notifications:", err));
    }, [token]);

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:8080/users/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setNotifications((prev) => prev.filter((n) => n._id !== id));
            })
            .catch((err) => {
                console.error("Failed to delete notification:", err);
                alert("Failed to delete notification");
            });
    };

    return (
        <div className="notifications-container">
            <h2>Notifications</h2>

            {notifications.length === 0 ? (
                <p className="text-center">You have no notifications.</p>
            ) : (
                <div>
                    {notifications.map((note) => (
                        <div
                            key={note._id}
                            className={`notification-box ${note.type === "trade_request"
                                ? "notification-warning"
                                : "notification-success"
                                }`}
                        >
                            <div>
                                {note.type === "trade_request" && (
                                    <>
                                        📩 <strong>New trade request</strong> from{" "}
                                        <strong>{note.fromUser?.name?.first}</strong>
                                    </>
                                )}
                                {note.type === "trade_accepted" && (
                                    <>
                                        ✅ <strong>Trade accepted!</strong> You got{" "}
                                        <em>{note.cardId?.idol}</em> 🎉
                                    </>
                                )}
                            </div>
                            <button
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => handleDelete(note._id)}
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notifications;
