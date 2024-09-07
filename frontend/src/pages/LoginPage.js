import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import config from '../config';
import './styles.css';

import { io } from 'socket.io-client';
const socket = io(`${config.backendURL}`);

function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if(email && password) {
            socket.emit('login-request', {email: email, password: password});
        }
    };

    const goSign = () => {
        navigate('/signUp');
    };

    useEffect(() => {
        socket.on('login-confirm', (data) => {
            console.log("hesap açılıyor");  
            setUser({
                name: data.name,
                email: data.email,
                password: 'XXX',
                role: data.role,
                token: data.token
            });
            navigate('/lobby');
        });
        socket.on('login-reject', (message) => {});
    });

    return (
        <div className="container">
            <h1>Giriş</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Parola</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Giriş Yap</button>
                <button onClick={goSign}>Kayıt Ol</button>
            </form>
        </div>
    );
}

export default LoginPage;
