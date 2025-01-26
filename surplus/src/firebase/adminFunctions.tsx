import key from '../firebaseKeys/firebase.json';
import admin from "firebase-admin";

interface FirebaseUserInfo {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    providerId: string;
}

//Now we are gonna initialize the application with the admin
admin.initializeApp({
    credential: admin.credential.cert(key as admin.ServiceAccount),
});
////
const reverseLookUp = async (token: string): Promise<FirebaseUserInfo> => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const userRecord = await admin.auth().getUser(uid);
        return userRecord.toJSON() as FirebaseUserInfo;
    } catch (error) {
        console.error('Error in reverseLookUp:', error);
        throw error;
    }
};

export default reverseLookUp;

