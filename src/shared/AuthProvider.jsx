/* eslint-disable react/prop-types */
import axios from "axios";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    const logOut = () => {
        setLoading(true);
        localStorage.removeItem('auth');
        localStorage.removeItem('token');
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        })
    }

    useEffect(() => {

        let ignore = false;
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            if (ignore === true) return;
            setUser(currentUser);
            // setLoading(false);
            // get and set token
            console.log(currentUser);
            if (currentUser) {
                console.log('im callded');
                axios.post('http://localhost:5000/api/v1/jwt', { email: currentUser.email })
                    .then((data) => {
                        localStorage.setItem('token', data?.data?.token)
                        // setLoading(false);
                    })
            } else {
                localStorage.removeItem('token');
                // setLoading(false);
            }
            setLoading(false);
        })
        return () => {
            ignore = true;
            return unsubscribe();
        }
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
