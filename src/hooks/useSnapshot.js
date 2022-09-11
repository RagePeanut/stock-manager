import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';

const useSnapshot = (query, mapSnapshot, defaultValue) => {
    const [ snapshot, setSnapshot ] = useState(null);
    const [ result, setResult ] = useState(defaultValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onSnapshot(query, setSnapshot), [ setResult, setSnapshot ]);

    useEffect(() => {
        if(!snapshot) return;
        Promise.resolve(mapSnapshot(snapshot)).then(setResult)
    }, [ snapshot, mapSnapshot ]);

    return result;
}

export default useSnapshot;