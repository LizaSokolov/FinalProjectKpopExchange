import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
    const { token } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;

        axios
            .get("http://localhost:8080/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setUser(res.data))
            .catch((err) => {
                console.error("Error fetching user:", err);
                setError("Failed to load user info");
            });
    }, [token]);

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <h2>My Profile</h2>

            <div className="profile-card">
                <div className="text-center mb-3">
                    <img
                        src={user.avatar ? `http://localhost:8080${user.avatar}` : '/default-avatar.png'}
                        alt="Avatar"
                        className="profile-avatar"
                    />
                </div>

                <h5>
                    Name: {user.name?.first || ""} {user.name?.middle || ""} {user.name?.last || ""}
                </h5>
                <p>Email: {user.email || "N/A"}</p>
                <p>Phone: {user.phone || "N/A"}</p>
                <p>
                    Address: {user.address?.city && user.address?.street && user.address?.houseNumber
                        ? `${user.address.city}, ${user.address.street} ${user.address.houseNumber}`
                        : "No address provided"}
                </p>
                <p>Bio: {user.bio || "No bio provided"}</p>
                <p>
                    Favorite Groups: {user.favoriteGroups?.length ? user.favoriteGroups.join(", ") : "None"}
                </p>

                <Link to="/edit-profile" className="btn mt-3">
                    Edit Profile
                </Link>
            </div>
        </div>
    );
}

export default Profile;
