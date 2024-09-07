import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './styles.css';

import { io } from 'socket.io-client';
const socket = io(`${config.backendURL}`);

function SignUpPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        if (name && email && password && role) {
            socket.emit('signUp', {name: name, email: email, password: password, role: role})
        }
    };

    const goLog = () => {
        navigate('/login');
    };

    useEffect(()=> {
        socket.on('signUp-confirm', goLog);
    });

    return (
        <div className="container">
            <h1>Kayıt</h1>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>İsim:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                <div>
                    <label>Başvurulan Rol:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="" disabled selected>Rolünü Seç</option>
                        <option value="user">Kullanıcı</option>
                        <option value="member">Üye</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Kayıt Ol</button>
                <button onClick={goLog}>Giriş Yap</button>
            </form>
        </div>
    );
}

export default SignUpPage;
