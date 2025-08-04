import React from "react";
import "../styles/TradeModal.css";

function TradeModal({ show, onClose, onSend, ownedCards, selectedCard, setSelectedCard }) {
    if (!show) return null;

    return (
        <div className="trade-modal-backdrop">
            <div className="trade-modal-content animate-fade">
                <h4 className="modal-title">Send Trade Request</h4>

                <label className="form-label">Your Card:</label>
                <select
                    className="form-select"
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                >
                    <option value="">-- Select one of your cards --</option>
                    {ownedCards.map((card) => (
                        <option key={card._id} value={card._id}>
                            {card.idol} ({card.group})
                        </option>
                    ))}
                </select>

                <div className="modal-buttons">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={onSend} disabled={!selectedCard}>
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TradeModal;
