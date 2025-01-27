// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZHavEWbWJikh20WOZMLkWs2beoz_TPzE",
  authDomain: "surplus-aed79.firebaseapp.com",
  projectId: "surplus-aed79",
  storageBucket: "surplus-aed79.firebasestorage.app",
  messagingSenderId: "992402453671",
  appId: "1:992402453671:web:0e9b0a92bc9ce7167c5782",
  measurementId: "G-3KJHKHQJXW"
};

// Initialize Firebase
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const auth = getAuth(firebaseApp);

// Detect auth state
onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('logged in')
  } else {
    console.log('No user logged in')
  }
})

// connectAuthEmulator(auth, "http://localhost:9099") 

export function signup(email, password){
  // Create new account using email/password
  const createAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // Log the user information
      console.log(userCredential.user)
      return { success: true, 
        user: userCredential.user 
      };
    } catch (error) {
      console.error('There was an error:', error);
      return {
          success: false,
          error: error.message
      };
    }
  }
  return createAccount()
}

