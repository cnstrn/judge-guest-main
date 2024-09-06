import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import config from '../config';
import './styles.css';

// Initialize socket connection to backend
const socket = io(`${config.backendURL}`);

function VotePage() {
    const { competitionId, projectId } = useParams(); // Get competition and project IDs from URL params
    const location = useLocation(); // Get passed state (juryMembers and juryVoteCoefficient)
    const navigate = useNavigate(); // To navigate to other pages
    const { user } = useContext(UserContext); // Get user info from context

    const [competition, setCompetition] = useState(null); // Competition data
    const [votes, setVotes] = useState({}); // Vote data for each criterion
    const [isJury, setIsJury] = useState(false); // Is the user a jury member?
    const [comment, setComment] = useState(''); // User's comment for the project
    const juryVoteCoefficient = location.state.juryVoteCoefficient || 2;  // Get jury coefficient or use default 2

    // Fetch competition data and check if user is a jury member
    useEffect(() => {
        if (!user.name) {
            navigate('/'); // If no user name, redirect to home
            return;
        }

        // Request competition data from the server
        socket.emit('requestCompetitionData', { competitionId });

        // Listen for competition data from the server
        socket.on('competitionData', (data) => {
            setCompetition(data);
            setIsJury(location.state.juryMembers.includes(user.name)); // Check if user is a jury member
        });

        // Clean up event listener on component unmount
        return () => {
            socket.off('competitionData');
        };
    }, [competitionId, user.name, location.state.juryMembers, navigate]);

    // Handle vote changes for each criterion
    const handleVoteChange = (criterion, score) => {
        setVotes((prevVotes) => ({
            ...prevVotes,
            [criterion]: score,
        }));
    };

    // Handle submitting votes to the server
    // Oyları sunucuya gönderme işlemi
    const submitVotes = () => {
    // Criteria ve vote bilgilerini ayrı ayrı gönderiyoruz
    socket.emit('submitVotes', {
        competitionId,
        projectId,
        userName: user.name,
        comment: comment.trim(),
        votes: votes // her kriter ve oylama burada gönderiliyor
    });

    // Yarışma sayfasına geri yönlendir
    navigate(`/competition/${competitionId}`);
};

    // Show loading message if competition data is not yet available
    if (!competition) {
        return <div>Yükleniyor...</div>;
    }

    // Find the project by projectId
    const project = competition.projects.find(p => p.id === projectId);
    if (!project) {
        return <div>Proje bulunamadı.</div>;
    }

    return (
        <div className="container">
            <h2>{project.name} için Oy Verin</h2>

            {/* Display a jury warning if the user is a jury member */}
            {isJury && <p className="jury-info">Jüri üyesi olarak atandınız. Oylarınız {juryVoteCoefficient} katı değerindedir.</p>}

            {/* Display voting options */}
            <div className="likert-container">
                {competition.criteria.map((criterion, index) => (
                    <div key={index} className="likert-item" style={{ marginBottom: '15px' }}>
                        <label>{criterion}: </label>
                        <div className="likert-buttons">
                            {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    onClick={() => handleVoteChange(criterion, score)}
                                    className={votes[criterion] === score ? 'selected' : ''}>
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Textarea for comments */}
            <div style={{ marginTop: '15px' }}>
                <label>Yorum Bırakın:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Yorumunuzu buraya yazın..."
                />
            </div>

            {/* Submit votes button */}
            <button onClick={submitVotes} style={{ width: '100%', marginTop: '20px' }}>
                Oyları Gönder
            </button>
        </div>
    );
}

export default VotePage;
