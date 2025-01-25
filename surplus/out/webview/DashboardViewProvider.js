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
                        padding: 10px;
                        color: var(--vscode-foreground);
                        font-family: var(--vscode-font-family);
                    }
                    .accordion {
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 4px;
                        margin-bottom: 8px;
                    }
                    .accordion-header {
                        background: var(--vscode-editor-background);
                        padding: 10px;
                        cursor: pointer;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-weight: bold;
                    }
                    .accordion-header:hover {
                        background: var(--vscode-list-hoverBackground);
                    }
                    .accordion-content {
                        padding: 10px;
                        display: none;
                        border-top: 1px solid var(--vscode-widget-border);
                    }
                    .accordion.active .accordion-content {
                        display: block;
                    }
                    .accordion-icon {
                        transition: transform 0.3s ease;
                    }
                    .accordion.active .accordion-icon {
                        transform: rotate(90deg);
                    }
                    .empty-state {
                        color: var(--vscode-descriptionForeground);
                        font-style: italic;
                        padding: 8px 0;
                    }
                </style>
            </head>
            <body>
                <div class="accordion">
                    <div class="accordion-header">
                        <span>Finances</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                        <div class="empty-state">No financial data tracked yet</div>
                    </div>
                </div>

                <div class="accordion">
                    <div class="accordion-header">
                        <span>Investments</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                        <div class="empty-state">No investments tracked yet</div>
                    </div>
                </div>

                <div class="accordion">
                    <div class="accordion-header">
                        <span>Budgeting</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                        <div class="empty-state">No budget items added yet</div>
                    </div>
                </div>

                <div class="accordion">
                    <div class="accordion-header">
                        <span>Goals</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                        <div class="empty-state">No financial goals set yet</div>
                    </div>
                </div>

                <script>
                    const accordions = document.querySelectorAll('.accordion');
                    
                    accordions.forEach(accordion => {
                        const header = accordion.querySelector('.accordion-header');
                        header.addEventListener('click', () => {
                            accordion.classList.toggle('active');
                        });
                    });
                </script>
            </body>
            </html>
        `;
    }
}
exports.DashboardViewProvider = DashboardViewProvider;
//# sourceMappingURL=DashboardViewProvider.js.map