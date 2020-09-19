import firebase from 'firebase';

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: ""
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();
