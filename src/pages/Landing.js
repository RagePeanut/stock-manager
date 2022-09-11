import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '../firebase';

const Landing = () => {
    const navigate = useNavigate()

    const signInWithFacebook = useCallback(async () => {
        const provider = new FacebookAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/home');
        } catch(err) {
            // TODO: handle error
            console.log(err);
        }
    }, [ navigate ]);

    return (
        <div>
            <Button onClick={signInWithFacebook}>Se connecter avec Facebook</Button>
            {/* <div onClick={signInWithFacebook} className="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"/> */}
        </div>
    );
}

export default Landing;