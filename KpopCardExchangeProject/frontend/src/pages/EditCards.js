import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/EditCard.css";

function EditCard() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        idol: "",
        group: "",
        album: "",
        imageUrl: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:8080/cards/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setFormData(res.data))
            .catch((err) => {
                console.error("Failed to load card:", err);
                setError("Failed to load card");
            });
    }, [id, token]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .put(`http://localhost:8080/cards/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => navigate("/my-cards"))
            .catch((err) => {
                console.error("Failed to update card:", err);
                setError("Failed to update card");
            });
    };

    return (
        <div className="edit-card-container">
            <h2 className="mb-4 text-center">Edit Card</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Idol</label>
                    <input
                        type="text"
                        className="form-control"
                        name="idol"
                        value={formData.idol}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Group</label>
                    <input
                        type="text"
                        className="form-control"
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Album</label>
                    <input
                        type="text"
                        className="form-control"
                        name="album"
                        value={formData.album}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditCard;
