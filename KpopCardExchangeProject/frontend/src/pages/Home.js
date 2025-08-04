import React, { useEffect, useState, useContext } from "react";
import "../styles/Home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import KpopCard from "../components/KpopCard";
import TradeModal from "../components/TradeModal";
import { AuthContext } from "../contexts/AuthContext";

function Home() {
    const [cards, setCards] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCardForTrade, setSelectedCardForTrade] = useState(null);
    const [ownedCards, setOwnedCards] = useState([]);
    const [offeredCardId, setOfferedCardId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [cardDetailsModalOpen, setCardDetailsModalOpen] = useState(false);
    const [selectedCardDetails, setSelectedCardDetails] = useState(null);

    const { token, user, isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        axios
            .get("http://localhost:8080/cards")
            .then((res) => setCards(res.data))
            .catch((err) => console.error("Error fetching cards:", err));
    }, []);

    useEffect(() => {
        if (token) {
            axios
                .get("http://localhost:8080/cards/my-cards", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setOwnedCards(res.data))
                .catch((err) => console.error("Error fetching owned cards:", err));
        }
    }, [token]);

    const handleOpenModal = (card) => {
        setSelectedCardForTrade(card);
        setModalOpen(true);
    };

    const handleCardDetailsOpen = (card) => {
        setSelectedCardDetails(card);
        setCardDetailsModalOpen(true);
    };

    const handleSendTrade = () => {
        axios
            .post(
                `http://localhost:8080/cards/trade/${selectedCardForTrade._id}`,
                {
                    offeredCardId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(() => {
                setModalOpen(false);
                setOfferedCardId("");
                alert("Trade request sent!");
            })
            .catch((err) => {
                console.error("Failed to send trade request:", err);
                alert("Failed to send trade request.");
            });
    };

    const filteredCards = cards.filter((card) => {
        const idolMatch = card.idol.toLowerCase().includes(searchTerm.toLowerCase());
        const groupMatch = card.group.toLowerCase().includes(searchTerm.toLowerCase());
        return idolMatch || groupMatch;
    });

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Welcome to K-pop Card Exchange!</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredCards.map((card) => (
                    <div className="col-md-4 mb-4" key={card._id}>
                        <KpopCard
                            name={card.idol}
                            group={card.group}
                            imageUrl={card.imageUrl}
                            buttonText="Request Trade"
                            onRequestClick={() => handleOpenModal(card)}
                            onCardClick={() => handleCardDetailsOpen(card)}
                            showTradeButton={
                                isLoggedIn && card.owner?._id !== user?._id
                            }
                        />
                    </div>
                ))}
            </div>

            {cardDetailsModalOpen && selectedCardDetails && (
                <div
                    className="modal show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    onClick={() => setCardDetailsModalOpen(false)}
                >
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedCardDetails.idol} - {selectedCardDetails.group}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setCardDetailsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={selectedCardDetails.imageUrl}
                                    alt={selectedCardDetails.idol}
                                    className="img-fluid mb-3"
                                />

                                <p>
                                    <strong>Owner:</strong>{" "}
                                    <Link to={`/profile/${selectedCardDetails.owner._id}`}>
                                        {selectedCardDetails.owner.name.first} {selectedCardDetails.owner.name.last}
                                    </Link>
                                </p>

                                {selectedCardDetails.owner?.address && (
                                    <p>
                                        <strong>Address:</strong>{" "}
                                        {[selectedCardDetails.owner.address.city, selectedCardDetails.owner.address.country, selectedCardDetails.owner.address.zip]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setCardDetailsModalOpen(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <TradeModal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                onSend={handleSendTrade}
                ownedCards={ownedCards}
                selectedCard={offeredCardId}
                setSelectedCard={setOfferedCardId}
            />
        </div>
    );
}

export default Home;

