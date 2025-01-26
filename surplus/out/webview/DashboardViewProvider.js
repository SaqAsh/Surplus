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
                    #stock-container {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 12px;
                        padding: 8px 0;
                    }
                    .stock-card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 4px;
                        padding: 12px;
                        transition: transform 0.2s;
                    }
                    .stock-card:hover {
                        transform: translateY(-2px);
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
                        <div id="stock-container">
                            <!-- Stock cards will be dynamically inserted here -->
                        </div>
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

                    const FINNHUB_API_KEY = 'cuaoichr01qof06j1sl0cuaoichr01qof06j1slg';
                    const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA'];

                    async function updateStockPrice() {
                        const stockContainer = document.getElementById('stock-container');
                        stockContainer.innerHTML = STOCK_SYMBOLS.map(symbol => \`
                            <div class="stock-card" id="stock-\${symbol}">
                                <div class="stock-symbol">\${symbol}</div>
                                <div class="stock-price">Loading...</div>
                                <div class="stock-change">--</div>
                            </div>
                        \`).join('');

                        for (const symbol of STOCK_SYMBOLS) {
                            try {
                                const response = await fetch(
                                    \`https://finnhub.io/api/v1/quote?symbol=\${symbol}&token=\${FINNHUB_API_KEY}\`
                                );
                                const data = await response.json();
                                
                                const container = document.getElementById(\`stock-\${symbol}\`);
                                container.innerHTML = \`
                                    <div class="stock-symbol">\${symbol}</div>
                                    <div class="stock-price">$\${data.c.toFixed(2)}</div>
                                    <div class="stock-change \${data.d > 0 ? 'positive' : 'negative'}">
                                        \${data.d > 0 ? '▲' : '▼'} $\${Math.abs(data.d).toFixed(2)} (\${data.dp.toFixed(2)}%)
                                    </div>
                                \`;
                            } catch (error) {
                                const container = document.getElementById(\`stock-\${symbol}\`);
                                container.innerHTML = \`
                                    <div class="stock-symbol">\${symbol}</div>
                                    <div class="stock-price">Failed to load stock data</div>
                                \`;
                            }
                        }
                    }

                    // Immediately call updateStockPrice when the page loads
                    updateStockPrice();
                </script>
            </body>
            </html>
        `;
    }
}
exports.DashboardViewProvider = DashboardViewProvider;
//# sourceMappingURL=DashboardViewProvider.js.map