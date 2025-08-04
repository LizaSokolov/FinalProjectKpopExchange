import React from "react";
import { FaHeart, FaStar, FaMusic, FaRocket, FaUsers, FaComments } from "react-icons/fa";
import "../styles/About.css";

function About() {
    return (
        <div className="container mt-5 mb-5 about-container">
            <h1 className="glitter mb-4">
                <FaStar /> Welcome to K-pop Cards Exchange <FaStar />
            </h1>

            <div className="about-box">
                <p>
                    <FaMusic className="icon" /> <strong>K-pop Cards Exchange</strong> — the chillest place to trade your favorite K-pop photocards! 💿✨
                </p>
            </div>

            <div className="about-box">
                <p>
                    <FaUsers className="icon" /> Whether you're a hardcore collector or just getting started, our platform helps fans connect and swap cards easily.
                    No sales, no stress — just pure K-pop magic and friendly trades.
                </p>
            </div>

            <div className="about-box">
                <p>
                    <FaRocket className="icon" /> We've got features like card galleries, trade requests, chat, and more coming soon!
                    Everything here was built with love for the fandom — by fans, for fans 💖
                </p>
            </div>

            <div className="about-box">
                <p>
                    <FaComments className="icon" /> Once a trade is accepted, you’ll chat directly with the other fan to arrange shipping and exchange details ✉️📦
                    All trades are handled between users — quick, direct, and fan-powered!
                </p>
            </div>

            <div className="about-box">
                <p>
                    💫 So grab your biases, list your cards, and let’s trade! 🚀
                </p>
            </div>

            <p className="mt-4 text-muted text-center">
                Made with <FaHeart style={{ color: "#ff4eb5" }} /> by the K-pop Card Exchange team 💜
            </p>
        </div>
    );
}

export default About;
