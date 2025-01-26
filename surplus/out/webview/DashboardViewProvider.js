"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardViewProvider = void 0;
const auth_1 = require("../auth");
const database_1 = require("../database");
class DashboardViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        // Set up real-time listeners when provider is created
        const dbManager = database_1.DatabaseManager.getInstance();
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        // Listen for database changes
        setInterval(async () => {
            if (this._view && authProvider.isLoggedIn()) {
                const username = authProvider.getUsername();
                // Set up listeners for all data types
                dbManager.onStocksChange(username, () => this.updateDashboard());
                dbManager.onGoalsChange(username, () => this.updateDashboard());
                dbManager.onExpensesChange(username, () => this.updateDashboard());
            }
        }, 1000); // Check every second if we need to update
    }
    async resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);
    }
    async _getHtmlForWebview(webview) {
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        const dbManager = database_1.DatabaseManager.getInstance();
        const username = authProvider.getUsername();
        // Get user's data
        const stocks = await dbManager.readInvestmentPrefs(username);
        const goals = await dbManager.readGoals(username);
        const expenses = await dbManager.readExpenses(username);
        const stockSymbols = stocks ? stocks.split(',') : [];
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Surplus Dashboard</title>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
                     #finances-container {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 12px;
                        padding: 8px 0;
                    }
                    .finance-card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 4px;
                        padding: 12px;
                    }
                    .finance-title {
                        color: var(--vscode-foreground);
                        font-weight: bold;
                        margin-bottom: 8px;
                    }
                    .finance-amount {
                        font-size: 1.4em;
                        margin: 8px 0;
                        color: var(--vscode-foreground);
                    }
                    .finance-amount.positive {
                        color: var(--vscode-charts-green);
                    }
                    .finance-amount.negative {
                        color: var(--vscode-charts-red);
                    }
                    .finance-details {
                        font-size: 0.9em;
                        color: var(--vscode-descriptionForeground);
                    }
                    .finance-details div {
                        margin: 4px 0;
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
                        height:125px;
                        margin-bottom: 20px;
                    }
                    .stock-card:hover {
                        transform: translateY(-2px);
                    }
                    .stock-symbol {
                        color: var(--vscode-symbolIcon-variableForeground);
                        font-weight: bold;
                        font-size: 1.1em;
                    }
                    .stock-price {
                        color: var(--vscode-charts-blue);
                        font-size: 1.2em;
                        margin: 4px 0;
                    }
                    .stock-change.positive {
                        color: var(--vscode-charts-green);
                    }
                    .stock-change.negative {
                        color: var(--vscode-charts-red);
                    }
                    .chart-container {
                        width: 100%;
                        height: 300px;
                        margin-top: 20px;
                        padding: 10px;
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 4px;
                    }
                    .stock-chart {
                        margin-top: 5px;
                        height: 120px;
                        width: 100%;
                    }
                    .welcome-message {
                        font-size: 1.2em;
                        margin: 16px 0;
                        color: var(--vscode-foreground);
                        font-weight: bold;
                    }
                    .progress-bar {
                        width: 100%;
                        height: 20px;
                        background-color: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 10px;
                        overflow: hidden;
                        margin: 8px 0;
                    }
                    .progress-fill {
                        height: 100%;
                        background-color: var(--vscode-charts-blue);
                        transition: width 0.3s ease;
                    }
                    .goal-card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 4px;
                        padding: 12px;
                        margin-bottom: 8px;
                    }
                    .goal-title {
                        font-weight: bold;
                        margin-bottom: 4px;
                    }
                    .goal-amount {
                        color: var(--vscode-charts-blue);
                    }
                    .goal-deadline {
                        color: var(--vscode-descriptionForeground);
                        font-size: 0.9em;
                    }
                    .expense-card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        border-radius: 4px;
                        padding: 12px;
                        margin-bottom: 8px;
                    }
                    .expense-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 4px;
                    }
                    .expense-description {
                        font-weight: bold;
                    }
                    .expense-amount {
                        color: var(--vscode-charts-red);
                    }
                    .expense-details {
                        display: flex;
                        justify-content: space-between;
                        color: var(--vscode-descriptionForeground);
                        font-size: 0.9em;
                    }
                    .category-tag {
                        background: var(--vscode-badge-background);
                        color: var(--vscode-badge-foreground);
                        padding: 2px 6px;
                        border-radius: 12px;
                        font-size: 0.8em;
                    }
                </style>
            </head>
            <body>
                <div class="welcome-message">Welcome to Surplus!</div>
                <div class="accordion">
                    <div class="accordion-header">
                        <span>Finances</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                        <div id="finances-container">
                            <div class="finance-card">
                                <div class="finance-title">Current Balance</div>
                                <div class="finance-amount">$10,000.00</div>
                            </div>
                            <div class="finance-card">
                                <div class="finance-title">Monthly Income</div>
                                <div class="finance-amount positive">$5,000.00</div>
                                <div class="finance-details">
                                    <div>Salary: $4,500.00</div>
                                    <div>Other: $500.00</div>
                                </div>
                            </div>
                            <div class="finance-card">
                                <div class="finance-title">Monthly Expenses</div>
                                <div class="finance-amount negative">$3,000.00</div>
                                <div class="finance-details">
                                    <div>Housing: $1,500.00</div>
                                    <div>Utilities: $300.00</div>
                                    <div>Food: $600.00</div>
                                    <div>Other: $600.00</div>
                                    <div></div>
                                    <div>Due: 10/31/2021</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="accordion">
                    <div class="accordion-header">
                        <span>Investments</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                        <div id="stock-container">
                            ${stockSymbols.length ? '' : '<div class="empty-state">No stocks tracked yet</div>'}
                        </div>
                    </div>
                </div>

                <div class="accordion">
                    <div class="accordion-header">
                        <span>Goals</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                        
                            <div class="goal-card">
                                <div class="goal-title">Rent</div>
                                <div class="goal-amount">$1000</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:0}%"></div>
                                </div>
                                <div class="goal-deadline">Deadline: 2025-02-01</div>
                            </div>
                    </div>
                </div>

                <div class="accordion">
                    <div class="accordion-header">
                        <span>Recent Expenses</span>
                        <span class="accordion-icon">▶</span>
                    </div>
                    <div class="accordion-content">
                            <div class="expense-card">
                                <div class="expense-header">
                                    <div class="expense-description">Groceries</div>
                                    <div class="expense-amount">-$120.45</div>
                                </div>
                                <div class="expense-details">
                                    <div class="expense-date">2025-01-26</div>
                                    <div class="category-tag">Food and Drink</div>
                                </div>
                            </div>
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
                    const STOCK_SYMBOLS = ${JSON.stringify(stockSymbols)};

                    async function updateStockPrice() {
                        const stockContainer = document.getElementById('stock-container');
                        if (!STOCK_SYMBOLS.length) return;
                        
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
                                    \`https://finnhub.io/api/v1/quote?symbol=\${symbol.replace('$', '')}&token=\${FINNHUB_API_KEY}\`
                                );
                                const data = await response.json();
                                
                                const container = document.getElementById(\`stock-\${symbol}\`);
                                if (container && data.c) {
                                    container.innerHTML = \`
                                        <div class="stock-symbol">\${symbol}</div>
                                        <div class="stock-price">$\${data.c.toFixed(2)}</div>
                                        <div class="stock-change \${data.d > 0 ? 'positive' : 'negative'}">
                                            \${data.d > 0 ? '▲' : '▼'} $\${Math.abs(data.d).toFixed(2)} (\${data.dp.toFixed(2)}%)
                                        </div>
                                    \`;
                                }
                            } catch (error) {
                                console.error(\`Error fetching data for \${symbol}:\`, error);
                                const container = document.getElementById(\`stock-\${symbol}\`);
                                if (container) {
                                    container.innerHTML = \`
                                        <div class="stock-symbol">\${symbol}</div>
                                        <div class="stock-price">Failed to load</div>
                                    \`;
                                }
                            }
                        }
                    }

                    if (STOCK_SYMBOLS.length) {
                        updateStockPrice();
                        setInterval(updateStockPrice, 60000); // Update every minute
                    }
                </script>
            </body>
            </html>
        `;
    }
    async updateDashboard() {
        if (this._view) {
            this._view.webview.html = await this._getHtmlForWebview(this._view.webview);
        }
    }
}
exports.DashboardViewProvider = DashboardViewProvider;
DashboardViewProvider.viewType = 'surplus.dashboardView';
//# sourceMappingURL=DashboardViewProvider.js.map