import { createContext, useCallback } from 'react';
import { doc } from 'firebase/firestore';

import { auth, db } from '../firebase';
import useSnapshot from '../hooks/useSnapshot';

export const TypesContext = createContext();

// const typesByUser = {
//     'Béatrice': [
//         'Jeu',
//         'Livre',
//         'Autre',
//     ],
// };

const TypesProvider = ({ children }) => {
    const mapSnapshot = useCallback(snapshot => snapshot.data().types, []);

    const types = useSnapshot(
        doc(db, 'types/' + auth.currentUser.uid),
        mapSnapshot,
        []
    );

    return (
        <TypesContext.Provider value={{ types }}>
            { children }
        </TypesContext.Provider>
    );
}

export default TypesProvider;