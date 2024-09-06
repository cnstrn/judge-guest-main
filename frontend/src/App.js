import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'
import LobbyPage from './pages/LobbyPage';
import CreateCompetitionPage from './pages/CreateCompetitionPage';
import CompetitionPage from './pages/CompetitionPage';
import VotePage from './pages/VotePage';
import NicknameEntryPage from './pages/NicknameEntryPage';

function App() {
    return (
        <Routes>
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/create-competition" element={<CreateCompetitionPage />} />
            <Route path="/competition/:competitionId" element={<CompetitionPage />} />
            <Route path="/nickname-entry/:competitionId" element={<NicknameEntryPage />} />
            <Route path="/competition/:competitionId/vote/:projectId" element={<VotePage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/logIn" element={<LoginPage />} />  {/* Wildcard route moved to the bottom */}
            <Route path="*" element={<LoginPage />} />  {/* Wildcard route moved to the bottom */}
        </Routes>
    );
}

export default App;
