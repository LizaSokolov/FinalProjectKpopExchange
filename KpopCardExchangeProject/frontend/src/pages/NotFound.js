import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="text-center d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
            <h1 className="display-4 mb-3 text-danger">404</h1>
            <p className="lead mb-4">Oops! Page not found 😢</p>
            <Link to="/" className="btn btn-outline-primary">
                Home Page
            </Link>
        </div>
    );
}

export default NotFound;
