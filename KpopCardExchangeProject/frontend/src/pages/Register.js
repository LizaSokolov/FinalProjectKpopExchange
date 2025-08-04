import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 10);
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (!match) return value;
        return [match[1], match[2], match[3]].filter(Boolean).join("-");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "phone" ? formatPhone(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const form = new FormData();

            form.append("name[first]", formData.firstName);
            form.append("name[middle]", formData.middleName);
            form.append("name[last]", formData.lastName);
            form.append("email", formData.email);
            form.append("password", formData.password);
            form.append("phone", formData.phone.replace(/\D/g, ""));
            form.append("address[country]", formData.country);
            form.append("address[city]", formData.city);
            form.append("address[street]", formData.street);
            form.append("address[houseNumber]", formData.houseNumber);

            if (avatarFile) {
                form.append("avatar", avatarFile);
            }

            const res = await axios.post("http://localhost:8080/users/register", form);

            localStorage.setItem("token", res.data.token);
            navigate("/profile");
        } catch (err) {
            const errorResponse = err.response?.data;

            if (Array.isArray(errorResponse?.error)) {
                setError(errorResponse.error.join(". "));
            } else {
                setError(errorResponse?.error || errorResponse?.message || "Registration failed");
            }
        }

        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {isLoading && (
                <div className="progress mb-3" style={{ height: "6px" }}>
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        style={{ width: "100%" }}
                    ></div>
                </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setAvatarFile(file);
                            setAvatarPreview(URL.createObjectURL(file));
                        }}
                    />
                    {avatarPreview && (
                        <div className="mt-2 text-center">
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    boxShadow: "0 0 10px rgba(168, 71, 255, 0.3)",
                                }}
                            />
                        </div>
                    )}
                </div>

                {[
                    ["First Name", "firstName"],
                    ["Middle Name (optional)", "middleName"],
                    ["Last Name", "lastName"],
                    ["Email", "email", "email"],
                    ["Phone", "phone"],
                    ["Country", "country"],
                    ["City", "city"],
                    ["Street", "street"],
                    ["House Number", "houseNumber"],
                    ["Password", "password", "password"],
                    ["Confirm Password", "confirmPassword", "password"],
                ].map(([label, name, type = "text"]) => (
                    <div className="mb-3" key={name}>
                        <label className="form-label">{label}</label>
                        <input
                            type={type}
                            name={name}
                            className="form-control"
                            value={formData[name]}
                            onChange={handleChange}
                            required={name !== "middleName"}
                        />
                    </div>
                ))}

                <button type="submit" className="btn btn-primary w-100">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
