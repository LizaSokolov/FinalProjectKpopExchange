import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/EditProfile.css";

function EditProfile() {
    const { user, token } = useContext(AuthContext);

    const [bio, setBio] = useState("");
    const [favoriteGroups, setFavoriteGroups] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [address, setAddress] = useState({
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
    });
    const [phone, setPhone] = useState("");

    // Password states
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (user) {
            setBio(user.bio || "");
            setFavoriteGroups(user.favoriteGroups?.join(", ") || "");
            setAddress(user.address || {});
            setPhone(user.phone || "");
        }
    }, [user]);

    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 10);
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (!match) return value;
        return [match[1], match[2], match[3]].filter(Boolean).join("-");
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        setAvatarPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleChangeAddress = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("bio", bio);
        formData.append("favoriteGroups", favoriteGroups);
        formData.append("phone", phone);
        formData.append("address[country]", address.country);
        formData.append("address[city]", address.city);
        formData.append("address[street]", address.street);
        formData.append("address[houseNumber]", address.houseNumber);
        formData.append("address[zip]", address.zip);

        if (avatar) formData.append("avatar", avatar);

        axios
            .put(`http://localhost:8080/users/${user._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                alert("Profile updated successfully!");
            })
            .catch((err) => {
                console.error("Error updating profile:", err);
                alert("Failed to update profile.");
            });
    };

    const handlePasswordChange = async () => {
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await axios.put(
                "http://localhost:8080/users/change-password",
                { newPassword: password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Password changed successfully!");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Failed to change password:", err);
            alert("Failed to change password.");
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Bio:</label>
                    <textarea
                        className="form-control"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Favorite Groups (comma separated):</label>
                    <input
                        type="text"
                        className="form-control"
                        value={favoriteGroups}
                        onChange={(e) => setFavoriteGroups(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                    />
                </div>

                {["country", "city", "street", "houseNumber", "zip"].map((field) => (
                    <div className="mb-3" key={field}>
                        <label className="form-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                        </label>
                        <input
                            type="text"
                            name={field}
                            className="form-control"
                            value={address[field]}
                            onChange={handleChangeAddress}
                        />
                    </div>
                ))}

                <div className="mb-3">
                    <label className="form-label">Avatar:</label>
                    <input type="file" className="form-control" onChange={handleAvatarChange} />
                    {avatarPreview && (
                        <div className="mt-3 text-center">
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    boxShadow: "0 0 10px rgba(168, 71, 255, 0.3)",
                                    border: "2px solid #c93aff",
                                }}
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-4">
                    Save Changes
                </button>
            </form>

            <hr />
            <h4>Change Password</h4>
            <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <button className="btn btn-outline-danger w-100" onClick={handlePasswordChange}>
                Change Password
            </button>
        </div>
    );
}

export default EditProfile;
