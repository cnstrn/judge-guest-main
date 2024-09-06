import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../UserContext';
import { QRCodeCanvas } from 'qrcode.react';
import ConnectedUsersList from './ConnectedUsersList';
import ProjectList from './ProjectList';
import config from '../config';
import './styles.css';

const socket = io(`${config.backendURL}`);

function CompetitionPage() {
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [competition, setCompetition] = useState(null);
    const [username, setUsername] = useState(user.name || '');
    const [votingStarted, setVotingStarted] = useState(false);
    const [votingFinished, setVotingFinished] = useState(false);
    const [resultsVisible, setResultsVisible] = useState(false);
    const [juryMembers, setJuryMembers] = useState([]);
    const [juryVoteCoefficient, setJuryVoteCoefficient] = useState(2); // Default jury vote coefficient

    useEffect(() => {
        if (!user.name) {
            return;
        }

        socket.emit('joinCompetition', { competitionId, name: user.name });

        socket.on('competitionData', (data) => {
            const uniqueUsers = Array.from(new Set(data.connectedUsers.map(u => u.name)))
                .map(name => data.connectedUsers.find(u => u.name === name));

            setCompetition({
                ...data,
                connectedUsers: uniqueUsers,
            });
            setJuryMembers(data.juryMembers || []);
            setVotingStarted(data.votingStarted || false);
            setVotingFinished(data.votingFinished || false);
            setResultsVisible(data.resultsVisible || false);
            setJuryVoteCoefficient(data.juryVoteCoefficient || 2);
        });

        return () => {
            socket.off('competitionData');
        };
    }, [competitionId, user]);

    const startVoting = () => {
        setVotingStarted(true);
        socket.emit('startVoting', { competitionId });
    };

    const finishVoting = () => {
        setVotingStarted(false);
        setVotingFinished(true);
        socket.emit('finishVoting', { competitionId });
    };

    const handleShowResults = () => {
        socket.emit('showResults', { competitionId });
        setResultsVisible(true);
    };

    const toggleJuryMember = (userName) => {
        const updatedJury = juryMembers.includes(userName)
            ? juryMembers.filter(jury => jury !== userName)
            : [...juryMembers, userName];

        setJuryMembers(updatedJury);
        socket.emit('updateJuryMembers', { competitionId, juryMembers: updatedJury });
    };

    const returnToLobby = () => {
        navigate('/lobby');
    };

    if (!user.name) {
        return (
            <div className="container">
                <h2>Yarışmaya Katıl</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setUser({ name: username, role: 'user' });
                    socket.emit('joinCompetition', { competitionId, name: username });
                }}>
                    <label>Kullanıcı Adınızı Girin:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <button type="submit">Katıl</button>
                </form>
            </div>
        );
    }

    if (!competition) {
        return <div>Yarışma bulunamadı...</div>;
    }

    return (
        <div className="container">
            <h1>{competition.name}</h1>
            <h3>Tarih: {competition.date || 'Tarih belirtilmedi'}</h3>

            {(user.role === 'admin' || user.role === 'member') && (
                <div className="qr-section">
                    <div className="competition-code">
                        <span>Yarışma Kodu:</span>
                        <strong>{competitionId}</strong>
                    </div>
                    <QRCodeCanvas
                        value={`${config.frontendURL}/competition/${competitionId}`}
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
                        includeMargin={true}
                    />
                    <p>Yarışmaya katılmak için bu QR kodu tarayın.</p>
                </div>
            )}

            <h3>Jüri Oy Katsayısı: {juryVoteCoefficient}</h3>

            <ProjectList
                projects={competition.projects}
                resultsVisible={resultsVisible}
                user={user}
                competitionId={competitionId}
                votingStarted={votingStarted}
                juryMembers={juryMembers}
                juryVoteCoefficient={juryVoteCoefficient}
                navigate={navigate}
            />

            <ConnectedUsersList
                connectedUsers={competition.connectedUsers}
                user={user}
                juryMembers={juryMembers}
                toggleJuryMember={toggleJuryMember}
            />

            {(user.role === 'admin' || user.role === 'member') && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={startVoting} disabled={votingStarted || votingFinished}>
                        Oylamayı Başlat
                    </button>
                    <button onClick={finishVoting} disabled={!votingStarted} style={{ marginLeft: '10px' }}>
                        Oylamayı Bitir
                    </button>
                    {!resultsVisible && votingFinished && (
                        <button onClick={handleShowResults} style={{ marginLeft: '10px' }}>
                            Sonuçları Gör
                        </button>
                    )}
                </div>
            )}

            {resultsVisible && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={returnToLobby}>Lobiye Dön</button>
                </div>
            )}
        </div>
    );
}

export default CompetitionPage;
