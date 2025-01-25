import * as vscode from 'vscode';

export class DashboardViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'surplus.dashboardView';

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Surplus Dashboard</title>
                <style>
                    body {
                        padding: 20px;
                    }
                    .card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 4px;
                        padding: 15px;
                        margin-bottom: 15px;
                    }
                    .section-title {
                        color: var(--vscode-foreground);
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="section-title">Tasks</div>
                    <div id="tasks-list">
                        No tasks yet
                    </div>
                </div>
                <div class="card">
                    <div class="section-title">Expenses</div>
                    <div id="expenses-list">
                        No expenses tracked
                    </div>
                </div>
                <div class="card">
                    <div class="section-title">Investments</div>
                    <div id="investments-list">
                        No investments tracked
                    </div>
                </div>
            </body>
            </html>
        `;
    }
} 