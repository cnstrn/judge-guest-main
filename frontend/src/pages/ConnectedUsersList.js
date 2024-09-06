import React from 'react';

function ConnectedUsersList({ connectedUsers, user, juryMembers, toggleJuryMember }) {
    return (
        <div>
            <h3>Katılımcılar</h3>
            <div className="card-container">
                {connectedUsers.map((connectedUser, index) => (
                    <div key={index} className="card">
                        <div className="card-content">
                            <p>
                                {connectedUser.name} {juryMembers.includes(connectedUser.name) && <span>(jüri)</span>}
                            </p>
                        </div>
                        {(user.role === 'admin' || user.role === 'member') && connectedUser.name !== user.name && (
                            <div className="card-actions">
                                <button onClick={() => toggleJuryMember(connectedUser.name)}>
                                    {juryMembers.includes(connectedUser.name) ? 'Jüriden Çıkar' : 'Jüriye Ekle'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConnectedUsersList;