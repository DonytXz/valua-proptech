import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSy_REDACTED_KEY_CONFIGURE_IN_ENV",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "property-valuator.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "property-valuator",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "property-valuator.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "360449449280",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:360449449280:web:a64721a1197e9a592d2ea5"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };