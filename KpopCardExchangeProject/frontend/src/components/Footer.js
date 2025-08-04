import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
    return (
        <footer>
            <div className="container">
                <p>
                    © {new Date().getFullYear()} K-pop Exchange. All rights reserved.
                </p>
                <div>
                    <Link to="/about">About</Link>
                    <a
                        href="https://github.com/LizaSokolov"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
