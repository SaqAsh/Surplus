import key from '../../firebaseKeys/firebase.json';
import admin from "firebase-admin";
//Now we are gonna initialize the application with the admin
admin.initializeApp({
    credential: admin.credential.cert(key),
});
////
const reverseLookUp = (token) =>{
    admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            return admin.auth().getUser(uid);
        })
        .then((userRecord) => {
            console.log(userRecord.toJSON());
        })
        .catch((error) => {
            console.log(error);
        });
};

export default reverseLookUp;

