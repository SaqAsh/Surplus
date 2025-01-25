import * as vscode from 'vscode';

export class SurplusStatusBar {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
    }

    public initialize() {
        this.statusBarItem.text = "$(account) Surplus: Not logged in";
        this.statusBarItem.command = 'surplus.login';
        this.statusBarItem.show();
    }

    public setLoggedInUser(email: string) {
        this.statusBarItem.text = `$(account) Surplus: ${email}`;
        this.statusBarItem.tooltip = 'Click to view dashboard';
        this.statusBarItem.command = 'surplus.viewDashboard';
    }

    public dispose() {
        this.statusBarItem.dispose();
    }

    clearLoggedInUser(): void {
        this.statusBarItem.text = 'Surplus: Not logged in';
        this.statusBarItem.show();
    }
} 