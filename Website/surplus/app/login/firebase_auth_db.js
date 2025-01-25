// Import the functions you need from the SDKs you need
import { create } from "domain";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
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
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Detect auth state
onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('logged in')
  } else {
    console.log('No user logged in')
  }
})

export function login(loginEmail, loginPassword) {
  // Login using email/password
  const loginEmailPassword = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      console.log(userCredential.user)
      return { success: true, user: userCredential.user };
    }
    catch(error) {
      console.log(`There was an error: ${error}`)
    }
  }
  loginEmailPassword()
}


// // Monitor auth state
// const monitorAuthState = async () => {
//   onAuthStateChanged(auth, user => {
//     if (user) {
//       console.log(user)
//       showApp()
//       showLoginState(user)

//       hideLoginError()
//       hideLinkError()
//     }
//     else {
//       showLoginForm()
//       lblAuthState.innerHTML = `You're not logged in.`
//     }
//   })
// }

// Log out
const logout = async () => {
  await signOut(auth);
}
