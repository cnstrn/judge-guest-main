// UserContext: kullanıcı adı ve rolünün atanması
import React, { createContext, useState } from 'react';

export const UserContext = createContext(null);
    
export const UserProvider = ({ children }) => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role:'',
        token:''
    })

    return(
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};