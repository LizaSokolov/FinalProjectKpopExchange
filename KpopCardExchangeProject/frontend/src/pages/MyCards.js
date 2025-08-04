import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/MyCards.css";

function MyCards() {
    const { token } = useContext(AuthContext);
    const [cards, setCards] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchCards = useCallback(() => {
        axios
            .get("http://localhost:8080/cards/my-cards", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCards(res.data))
            .catch((err) => {
                console.error("Error fetching your cards:", err);
                setError("Failed to fetch your cards");
            });
    }, [token]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleDelete = async (cardId) => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;

        try {
            await axios.delete(`http://localhost:8080/cards/${cardId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
        } catch (err) {
            console.error("Failed to delete card:", err);
            setError("Failed to delete card");
        }
    };

    const handleAccept = (cardId, requestId, fromUserId) => {
        if (!fromUserId) {
            alert("User ID is missing — cannot open chat.");
            return;
        }

        axios
            .post(
                `http://localhost:8080/cards/trade/accept/${cardId}/${requestId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(() => {
                alert("Trade accepted!");
                navigate(`/chat/${fromUserId}`);
            })
            .catch((err) => {
                console.error("Error accepting trade:", err);
                alert("Error accepting trade");
            });
    };

    const handleReject = (cardId, requestId) => {
        axios
            .delete(`http://localhost:8080/cards/trade/reject/${cardId}/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert("Trade rejected");
                fetchCards();
            })
            .catch((err) => {
                console.error("Error rejecting trade:", err);
                alert("Error rejecting trade");
            });
    };

    return (
        <div className="my-cards-container">
            <h2 className="mb-4 text-center">My Cards</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <div className="col-md-4 mb-4" key={card._id}>
                            <div className="my-card text-center">
                                <img
                                    src={
                                        card.imageUrl ||
                                        "https://via.placeholder.com/300x400?text=No+Image"
                                    }
                                    alt={card.idol}
                                    className="mb-2"
                                />
                                <h5>{card.idol}</h5>
                                <p>{card.group}</p>
                                <div className="d-flex justify-content-center gap-2 mb-2">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(`/edit-card/${card._id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDelete(card._id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {card.tradeRequests?.length > 0 && (
                                    <div className="mt-3 pt-2">
                                        <h6>Trade Requests:</h6>
                                        {card.tradeRequests.map((request) => (
                                            <div key={request._id} className="trade-box">
                                                <p className="mb-1">
                                                    <strong>From:</strong>{" "}
                                                    {request.user?.name?.first || "Unknown User"}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Message:</strong>{" "}
                                                    {request.message || "No message"}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Offered:</strong>{" "}
                                                    {request.offeredCard?.idol} (
                                                    {request.offeredCard?.group})
                                                </p>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() =>
                                                            handleAccept(
                                                                card._id,
                                                                request._id,
                                                                request.user?._id
                                                            )
                                                        }
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleReject(card._id, request._id)
                                                        }
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">You don't have any cards yet.</p>
                )}
            </div>
        </div>
    );
}

export default MyCards;
