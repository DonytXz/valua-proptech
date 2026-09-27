import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyDybE0bEen3CV5lzqVbT3ZRl73ZKu-AQcM",
    authDomain: "property-valuator.firebaseapp.com",
    projectId: "property-valuator",
    storageBucket: "property-valuator.appspot.com",
    messagingSenderId: "360449449280",
    appId: "1:360449449280:web:a64721a1197e9a592d2ea5"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };