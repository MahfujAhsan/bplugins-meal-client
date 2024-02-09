import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDv6P2oNXvKl60q_3gjWcDkp1bwV36Sv_Y",
    authDomain: "bplugins-meal.firebaseapp.com",
    projectId: "bplugins-meal",
    storageBucket: "bplugins-meal.appspot.com",
    messagingSenderId: "611623709362",
    appId: "1:611623709362:web:b7675e1b5cf0b3f088f7ab"
};

export const app = initializeApp(firebaseConfig);