import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/AddCard.css";

function AddCard() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        idol: "",
        group: "",
        album: "",
        imageUrl: "",
    });

    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFormData((prev) => ({
                ...prev,
                imageUrl: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        } else {
            setError("Please upload a valid image file.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("idol", formData.idol);
        formDataToSend.append("group", formData.group);
        formDataToSend.append("album", formData.album);
        formDataToSend.append("image", formData.imageUrl);

        try {
            await axios.post("http://localhost:8080/cards/add", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate("/my-cards");
        } catch (err) {
            console.error("Add card error:", err);
            setError("Failed to add card");
        }
    };

    const handleClearForm = () => {
        setFormData({ idol: "", group: "", album: "", imageUrl: "" });
        setImagePreview(null);
        setError("");
    };

    return (
        <div className="addcard-container">
            <h2 className="mb-4 text-center">Add New Card</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form className="addcard-form" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Card Information</legend>

                    <div className="mb-3">
                        <label className="form-label">Idol</label>
                        <input
                            type="text"
                            name="idol"
                            className="input-field"
                            onChange={handleChange}
                            value={formData.idol}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Group</label>
                        <input
                            type="text"
                            name="group"
                            className="input-field"
                            onChange={handleChange}
                            value={formData.group}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Album</label>
                        <input
                            type="text"
                            name="album"
                            className="input-field"
                            onChange={handleChange}
                            value={formData.album}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-field"
                            onChange={handleFileChange}
                            required
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img
                                    src={imagePreview}
                                    alt="Card preview"
                                    className="preview-img"
                                />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Add Card
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary w-100 mt-2"
                        onClick={handleClearForm}
                    >
                        Clear Form
                    </button>
                </fieldset>
            </form>
        </div>
    );
}

export default AddCard;
