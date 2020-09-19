import { auth } from '../service/firebase';

export function signup(username,email, password) {
    return auth().createUserWithEmailAndPassword(email.trim(), password.trim())
    .then((userCredentials)=>{
        if(userCredentials.user){
          userCredentials.user.updateProfile({
            displayName: username
          })
        }
    })
    .catch(function(error) {
      alert(error.message);
    });
}

export function signin(email, password) {
    return auth().signInWithEmailAndPassword(email.trim(), password.trim());
}

export function signout(){
    return auth().signOut();
}

export function currentuser(){
    return auth().currentUser;
}