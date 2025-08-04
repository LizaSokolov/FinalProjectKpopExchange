import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import KpopCard from "../components/KpopCard";
import "../styles/PublicProfile.css";

function PublicProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8080/users/public/${id}`)
            .then((res) => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load profile');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="public-profile">
            <img
                src={profile.avatar ? `http://localhost:8080${profile.avatar}` : '/default-avatar.png'}
                alt="avatar"
            />
            <h2>{profile.name.first} {profile.name.last}</h2>
            <p>{profile.bio || "No bio provided"}</p>

            {profile.favoriteGroups?.length > 0 && (
                <div>
                    <h3>Favorite Groups:</h3>
                    <div className="group-tags">
                        {profile.favoriteGroups.map((group, idx) => (
                            <span key={idx}>{group}</span>
                        ))}
                    </div>
                </div>
            )}

            {profile.cards?.length > 0 && (
                <div>
                    <h3>Cards:</h3>
                    <div className="cards-list">
                        {profile.cards.map((card) => (
                            <KpopCard
                                key={card._id}
                                name={card.idol}
                                group={card.group}
                                imageUrl={card.imageUrl}
                                showTradeButton={false}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PublicProfile;
