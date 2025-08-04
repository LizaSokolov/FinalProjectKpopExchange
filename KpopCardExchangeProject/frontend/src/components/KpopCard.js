import React from "react";
import "../styles/KpopCard.css";

function KpopCard({
    name,
    group,
    imageUrl,
    onRequestClick,
    onCardClick,
    buttonText = "Request Trade",
    showTradeButton = true
}) {
    return (
        <div
            className="kpop-card text-center p-3"
            onClick={onCardClick}
        >
            <img
                src={`http://localhost:8080${imageUrl}`}
                alt={name}
                className="card-img-top"
            />
            <div className="kpop-card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{group}</p>
                {showTradeButton && (
                    <button
                        className="btn btn-outline-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRequestClick();
                        }}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
}

export default KpopCard;
