import { db } from '../service/firebase';

export function addPost(username, body, date){
    db.ref('posts/').push().set({
        username: username,
        body: body,
        date: date
    });
}

export function getPosts(){
    let posts = [];
    db.ref('posts/').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            posts.push(childData);
        });
        return posts;
    });
}

export function addComment(username, body, date, postId){
    db.ref('comments/').push().set({
        postId: postId,
        username: username,
        body: body,
        date: date
    });
}

export function getComments(){
    let comments = [];
    db.ref('comments/').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            comments.push(childData);
        });
        return comments;
    });
}