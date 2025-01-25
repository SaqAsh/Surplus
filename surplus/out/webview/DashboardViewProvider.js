"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardViewProvider = void 0;
class DashboardViewProvider {
    _extensionUri;
    static viewType = 'surplus.dashboardView';
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    _getHtmlForWebview(webview) {
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
exports.DashboardViewProvider = DashboardViewProvider;
//# sourceMappingURL=DashboardViewProvider.js.map