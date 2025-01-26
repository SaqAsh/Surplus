import * as vscode from 'vscode';
import { SurplusAuthProvider } from '../auth';

export class DashboardViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'surplus.dashboardView';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const authProvider = SurplusAuthProvider.getInstance();
        const user = authProvider.getCurrentUser();
        const welcomeMessage = user ? `Welcome, ${user.email || user.displayName || 'User'}!` : 'Welcome to Surplus!';

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
                        padding-bottom:40px;
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
                        transition: transform 0.2s;
                    }
                    .finance-card:hover {
                        transform: translateY(-2px);
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
                        margin-top: 8px;
                    }
                    .finance-details div {
                        margin: 4px 0;
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class="welcome-message">${welcomeMessage}</div>
                
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
                                <div class="finance-details">
                                    <div>
                                        <span>Last Updated:</span>
                                        <span>${new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="finance-card">
                                <div class="finance-title">Monthly Income</div>
                                <div class="finance-amount positive">$5,000.00</div>
                                <div class="finance-details">
                                    <div>
                                        <span>Salary:</span>
                                        <span>$4,500.00</span>
                                    </div>
                                    <div>
                                        <span>Investments:</span>
                                        <span>$300.00</span>
                                    </div>
                                    <div>
                                        <span>Other:</span>
                                        <span>$200.00</span>
                                    </div>
                                </div>
                            </div>
                            <div class="finance-card">
                                <div class="finance-title">Monthly Expenses</div>
                                <div class="finance-amount negative">$3,000.00</div>
                                <div class="finance-details">
                                    <div>
                                        <span>Housing:</span>
                                        <span>$1,500.00</span>
                                    </div>
                                    <div>
                                        <span>Utilities:</span>
                                        <span>$300.00</span>
                                    </div>
                                    <div>
                                        <span>Food:</span>
                                        <span>$600.00</span>
                                    </div>
                                    <div>
                                        <span>Transportation:</span>
                                        <span>$400.00</span>
                                    </div>
                                    <div>
                                        <span>Other:</span>
                                        <span>$200.00</span>
                                    </div>
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
                    const STOCK_SYMBOLS = ['AAPL', 'TM', 'GOOGL', 'AMZN', 'ORCL', 'TMUS'];

                    async function createChart(symbol, data) {
                        const ctx = document.getElementById(\`chart-\${symbol}\`);

                        // Calculate min and max with 5% padding
                        const values = [data.o, data.c, data.h, data.l];
                        const min = Math.min(...values);
                        const max = Math.max(...values);
                        const padding = (max - min) * 0.3;
                        
                        new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ['Open', 'Current', 'High', 'Low'],
                                datasets: [{
                                    label: symbol,
                                    data: values,
                                    backgroundColor: [
                                        '#8794D4',  // Open - darker pastel blue
                                        data.d > 0 ? '#8FB3A0' : '#D48787',  // Current - darker pastel green if up, darker pastel pink if down
                                        '#B187D4',  // High - darker pastel purple
                                        '#D487B1'   // Low - darker pastel pink
                                    ],
                                    borderWidth: 1,
                                    borderRadius: 4
                                }]
                            },

                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                scales: {
                                     y: {
                                        min: min - padding,
                                        max: max + padding,
                                        ticks: {
                                            stepSize: 1,
                                            callback: value => '$' + value.toFixed(2)
                                        }
                                    }
                                }
                            }
                        });
                    }

                    async function updateStockPrice() {
                        const stockContainer = document.getElementById('stock-container');
                        // Clear existing content first
                        stockContainer.innerHTML = '';
                        
                        // Only loop through our defined STOCK_SYMBOLS
                        for (const symbol of STOCK_SYMBOLS) {
                            try {
                                const response = await fetch(
                                    \`https://finnhub.io/api/v1/quote?symbol=\${symbol}&token=\${FINNHUB_API_KEY}\`
                                );
                                const data = await response.json();
                                
                                // Create a new div for each stock
                                const stockDiv = document.createElement('div');
                                stockDiv.className = 'stock-card';
                                stockDiv.id = \`stock-\${symbol}\`;
                                stockDiv.innerHTML = \`
                                    <div class="stock-symbol">\${symbol}</div>
                                    <div class="stock-price">$\${data.c.toFixed(2)}</div>
                                    <div class="stock-change \${data.d > 0 ? 'positive' : 'negative'}">
                                        \${data.d > 0 ? '▲' : '▼'} $\${Math.abs(data.d).toFixed(2)} (\${data.dp.toFixed(2)}%)
                                    </div>
                                    <canvas class="stock-chart" id="chart-\${symbol}"></canvas>
                                \`;
                                
                                stockContainer.appendChild(stockDiv);
                                await createChart(symbol, data);
                            } catch (error) {
                                console.error(\`Error fetching data for \${symbol}:\`, error);
                            }
                        }
                    }

                    // Immediately call updateStockPrice when the page loads
                    updateStockPrice();
                    
                    // Calculate time until next update (next day at market open - 9:30 AM EST)
                    function scheduleNextUpdate() {
                        const now = new Date();
                        const nextUpdate = new Date(now);
                        nextUpdate.setHours(9, 30, 0, 0); // 9:30 AM
                        
                        if (now >= nextUpdate) {
                            nextUpdate.setDate(nextUpdate.getDate() + 1); // Move to next day
                        }
                        
                        const timeUntilUpdate = nextUpdate.getTime() - now.getTime();
                        setTimeout(() => {
                            updateStockPrice();
                            scheduleNextUpdate(); // Schedule next update
                        }, timeUntilUpdate);
                    }
                    
                    scheduleNextUpdate();
                </script>
            </body>
            </html>
        `;
    }

    public updateDashboard() {
        if (this._view) {
            this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        }
    }
} 