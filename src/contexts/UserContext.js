import { createContext, useState, } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children, startUser }) => {
    const [ user, setUser ] = useState(startUser);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
        }}>
            { children }
        </UserContext.Provider>
    );
}

export default UserProvider;