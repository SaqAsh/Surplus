import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApp } from 'firebase/app';
import admin from 'firebase-admin';
import key from './firebaseKeys/firebase.json';

const firebaseConfig = {
    apiKey: "AIzaSyBZHavEWbWJikh20WOZMLkWs2beoz_TPzE",
    authDomain: "surplus-aed79.firebaseapp.com",
    projectId: "surplus-aed79",
    storageBucket: "surplus-aed79.firebasestorage.app",
    messagingSenderId: "992402453671",
    appId: "1:992402453671:web:0e9b0a92bc9ce7167c5782",
    measurementId: "G-3KJHKHQJXW"
};

export class SurplusAuthProvider {
    private static instance: SurplusAuthProvider;
    private isAuthenticated: boolean = false;
    private currentUser: any = null;
    private username: string = '';
    private app: any;
    private adminApp: admin.app.App;

    private constructor() {
        try {
            this.app = getApp();
        } catch {
            this.app = initializeApp(firebaseConfig);
        }
        
        if (admin.apps.length === 0) {
            this.adminApp = admin.initializeApp({
                credential: admin.credential.cert(key as admin.ServiceAccount)
            });
        } else {
            this.adminApp = admin.app();
        }
    }

    static getInstance(): SurplusAuthProvider {
        if (!this.instance) {
            this.instance = new SurplusAuthProvider();
        }
        return this.instance;
    }

    async signup(email: string, password: string): Promise<boolean> {
        try {
            const auth = getAuth(this.app);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            this.currentUser = userCredential.user;
            this.isAuthenticated = true;
            this.username = email.split('@')[0];
            return true;
        } catch (error) {
            console.error('Signup failed:', error);
            return false;
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        try {
            const auth = getAuth(this.app);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.currentUser = userCredential.user;
            this.isAuthenticated = true;
            this.username = email.split('@')[0];
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    async verifyToken(token: string): Promise<boolean> {
        try {
            const decodedToken = await this.adminApp.auth().verifyIdToken(token);
            const uid = decodedToken.uid;
            const userRecord = await this.adminApp.auth().getUser(uid);
            
            this.isAuthenticated = true;
            this.currentUser = userRecord;
            this.username = userRecord.email?.split('@')[0] || '';
            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            this.isAuthenticated = false;
            this.currentUser = null;
            this.username = '';
            return false;
        }
    }

    getUsername(): string {
        return this.username;
    }

    setAuthenticated(status: boolean, user?: any) {
        this.isAuthenticated = status;
        this.currentUser = user || null;
        if (user?.email) {
            this.username = user.email.split('@')[0];
        }
    }

    logout(): void {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.username = '';
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }

    getCurrentUser(): any {
        return this.currentUser;
    }
} 