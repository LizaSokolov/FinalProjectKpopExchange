import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8080/users/login", {
                email: formData.email,
                password: formData.password,
            });

            login(res.data.token);
            navigate("/profile");
        } catch (err) {
            const msg =
                err.response?.data?.errors?.[0] ||
                err.response?.data?.message ||
                "Login failed";
            setError(msg);
        }
    };

    return (
        <div className="login-container">
            <h2 className="mb-4 text-center">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="input-field"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="input-field"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
