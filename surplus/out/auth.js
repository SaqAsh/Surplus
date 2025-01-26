"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurplusAuthProvider = void 0;
const auth_1 = require("firebase/auth");
const app_1 = require("firebase/app");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebase_json_1 = __importDefault(require("./firebaseKeys/firebase.json"));
const firebaseConfig = {
    apiKey: "AIzaSyBZHavEWbWJikh20WOZMLkWs2beoz_TPzE",
    authDomain: "surplus-aed79.firebaseapp.com",
    projectId: "surplus-aed79",
    storageBucket: "surplus-aed79.firebasestorage.app",
    messagingSenderId: "992402453671",
    appId: "1:992402453671:web:0e9b0a92bc9ce7167c5782",
    measurementId: "G-3KJHKHQJXW"
};
class SurplusAuthProvider {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.username = '';
        try {
            this.app = (0, app_1.getApp)();
        }
        catch {
            this.app = (0, app_1.initializeApp)(firebaseConfig);
        }
        if (firebase_admin_1.default.apps.length === 0) {
            this.adminApp = firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert(firebase_json_1.default)
            });
        }
        else {
            this.adminApp = firebase_admin_1.default.app();
        }
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SurplusAuthProvider();
        }
        return this.instance;
    }
    async signup(email, password) {
        try {
            const auth = (0, auth_1.getAuth)(this.app);
            const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
            this.currentUser = userCredential.user;
            this.isAuthenticated = true;
            this.username = email.split('@')[0];
            return true;
        }
        catch (error) {
            console.error('Signup failed:', error);
            return false;
        }
    }
    async login(email, password) {
        try {
            const auth = (0, auth_1.getAuth)(this.app);
            const userCredential = await (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
            this.currentUser = userCredential.user;
            this.isAuthenticated = true;
            this.username = email.split('@')[0];
            return true;
        }
        catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }
    async verifyToken(token) {
        try {
            const decodedToken = await this.adminApp.auth().verifyIdToken(token);
            const uid = decodedToken.uid;
            const userRecord = await this.adminApp.auth().getUser(uid);
            this.isAuthenticated = true;
            this.currentUser = userRecord;
            this.username = userRecord.email?.split('@')[0] || '';
            return true;
        }
        catch (error) {
            console.error('Token verification failed:', error);
            this.isAuthenticated = false;
            this.currentUser = null;
            this.username = '';
            return false;
        }
    }
    getUsername() {
        return this.username;
    }
    setAuthenticated(status, user) {
        this.isAuthenticated = status;
        this.currentUser = user || null;
        if (user?.email) {
            this.username = user.email.split('@')[0];
        }
    }
    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.username = '';
    }
    isLoggedIn() {
        return this.isAuthenticated;
    }
    getCurrentUser() {
        return this.currentUser;
    }
}
exports.SurplusAuthProvider = SurplusAuthProvider;
//# sourceMappingURL=auth.js.map