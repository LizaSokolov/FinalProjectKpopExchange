import React, { useEffect, useState } from "react";

function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsDark(!isDark)}>
            {isDark ? "☀ Light" : "🌙 Dark"}
        </button>
    );
}

export default ThemeToggle;
