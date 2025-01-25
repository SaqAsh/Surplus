import * as vscode from 'vscode';

export class SurplusAuthProvider {
    private static instance: SurplusAuthProvider;
    private isAuthenticated: boolean = false;

    static getInstance(): SurplusAuthProvider {
        if (!this.instance) {
            this.instance = new SurplusAuthProvider();
        }
        return this.instance;
    }

    async login(email: string, password: string): Promise<boolean> {
        // TODO: Implement actual authentication
        this.isAuthenticated = true;
        return true;
    }

    logout(): void {
        this.isAuthenticated = false;
    }

    isLoggedIn(): boolean {
        return this.isAuthenticated;
    }
} 