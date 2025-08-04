import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);

    const fetchUser = async (tkn) => {
        try {
            const res = await axios.get("http://localhost:8080/users/me", {
                headers: { Authorization: `Bearer ${tkn}` },
            });
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
        }
    };

    const login = async (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setIsLoggedIn(true);
        await fetchUser(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setIsLoggedIn(false);
        setUser(null);
    };

    useEffect(() => {
        if (token) {
            fetchUser(token);
            setIsLoggedIn(true);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};
