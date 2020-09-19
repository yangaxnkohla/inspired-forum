import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCcsWauYk2ecx-RH9Klads-_JHNwuzm42g",
    authDomain: "inspired-forum.firebaseapp.com",
    databaseURL: "https://inspired-forum.firebaseio.com"
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();