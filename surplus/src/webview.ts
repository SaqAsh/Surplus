import * as vscode from 'vscode';

export class SurplusWebviewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly context: vscode.ExtensionContext) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        webviewView.webview.html = this.getHtmlContent();
    }

    private getHtmlContent(): string {
        return `
            <!DOCTYPE html>
            <html>
                <body>
                    <h1>Surplus Dashboard</h1>
                    <p>Welcome to your financial dashboard!</p>
                </body>
            </html>
        `;
    }
} 