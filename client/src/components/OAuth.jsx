//Using Firebase

import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: "POST",
                headers:{
                    "Content-Type" : 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName, 
                    email: result.user.email,
                    photo : result.user.photoURL
                })
            });
            // console.log("User: ",res);
            const data = await res.json();
            console.log(data);

            dispatch(signInSuccess(data));
            
            navigate('/');

        } catch (error) {
            console.log("Could not signup with google", error)
        }
    }

  return (
    <button onClick={handleGoogleClick} type="button" className="bg-red-700  text-white p-4 rounded-lg uppercase hover:opacity-90">
        Continue with Google
    </button>
  )
}
