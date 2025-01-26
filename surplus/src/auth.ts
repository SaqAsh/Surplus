import * as vscode from 'vscode';
import { DashboardViewProvider } from './webview/DashboardViewProvider';

export class SurplusAuthProvider {
    private static instance: SurplusAuthProvider;
    private isAuthenticated: boolean = false;
    private currentUser: any = null;

    static getInstance(): SurplusAuthProvider {
        if (!this.instance) {
            this.instance = new SurplusAuthProvider();
        }
        return this.instance;
    }

    setAuthenticated(status: boolean, user?: any) {
        this.isAuthenticated = status;
        this.currentUser = user || null;
    }

    async login(email: string, password: string): Promise<boolean> {
        // TODO: Implement actual authentication
        this.isAuthenticated = true;
        return true;
    }

    logout(): void {
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }

    getCurrentUser(): any {
        return this.currentUser;
    }
} 