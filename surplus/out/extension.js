"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const statusBar_1 = require("./statusBar");
const auth_1 = require("./auth");
const notifications_1 = require("./notifications");
const DashboardViewProvider_1 = require("./webview/DashboardViewProvider");
const database_1 = require("./database");
let statusBar;
let notificationManager;
// This method is called when your extension is activated
async function activate(context) {
    // Initialize components
    statusBar = new statusBar_1.SurplusStatusBar();
    notificationManager = new notifications_1.SurplusNotificationManager(context);
    console.log('Congratulations, your extension "surplus" is now active!');
    // Register the webview provider
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(DashboardViewProvider_1.DashboardViewProvider.viewType, new DashboardViewProvider_1.DashboardViewProvider(context.extensionUri)));
    // Add URI handler registration
    context.subscriptions.push(vscode.window.registerUriHandler({
        handleUri(uri) {
            if (uri.path === '/surplus') {
                const queryParams = new URLSearchParams(uri.query);
                const token = queryParams.get('token');
                if (token) {
                    handleTokenAuthentication(token);
                }
                else {
                    vscode.window.showErrorMessage('No authentication token provided');
                }
            }
        },
    }));
    // Register commands
    let disposables = [
        vscode.commands.registerCommand('surplus.login', () => handleLogin()),
        vscode.commands.registerCommand('surplus.logout', () => handleLogout()),
        vscode.commands.registerCommand('surplus.signup', () => handleSignup()),
        vscode.commands.registerCommand('surplus.addTask', () => handleAddTask()),
        vscode.commands.registerCommand('surplus.addExpense', () => handleAddExpense()),
        vscode.commands.registerCommand('surplus.addStock', () => handleAddStock()),
        vscode.commands.registerCommand('surplus.addGoal', () => handleAddGoal()),
        vscode.commands.registerCommand('surplus.viewDashboard', () => handleViewDashboard())
    ];
    context.subscriptions.push(...disposables);
    // Initialize status bar
    statusBar.initialize();
}
async function handleLogin() {
    try {
        const email = await vscode.window.showInputBox({
            prompt: 'Enter your email',
            placeHolder: 'email@example.com',
        });
        const password = await vscode.window.showInputBox({
            prompt: 'Enter your password',
            password: true,
        });
        if (email && password) {
            const authProvider = auth_1.SurplusAuthProvider.getInstance();
            const success = await authProvider.login(email, password);
            if (success) {
                statusBar.setLoggedInUser(email);
                notificationManager.scheduleNotifications();
                vscode.window.showInformationMessage('Successfully logged in!');
            }
            else {
                throw new Error('Login failed');
            }
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Login failed. Please try again.');
    }
}
async function handleLogout() {
    try {
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        const dbManager = database_1.DatabaseManager.getInstance();
        authProvider.logout();
        statusBar.clearLoggedInUser();
        dbManager.clearStockDisplay(); // Clear stock display on logout
        vscode.window.showInformationMessage('Successfully logged out!');
    }
    catch (error) {
        vscode.window.showErrorMessage('Logout failed. Please try again.');
    }
}
async function handleAddTask() {
    const title = await vscode.window.showInputBox({
        prompt: 'Enter task title',
        placeHolder: 'Pay rent',
    });
    const dueDate = await vscode.window.showInputBox({
        prompt: 'Enter due date (YYYY-MM-DD)',
        placeHolder: '2024-03-01',
    });
    if (title && dueDate) {
        notificationManager.addTask({
            title,
            dueDate: new Date(dueDate),
            completed: false,
        });
        vscode.window.showInformationMessage(`Task "${title}" added successfully!`);
    }
}
async function handleAddExpense() {
    try {
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        if (!authProvider.isLoggedIn()) {
            vscode.window.showErrorMessage('Please log in first');
            return;
        }
        const description = await vscode.window.showInputBox({
            prompt: 'Enter expense description',
            placeHolder: 'Groceries',
        });
        const amount = await vscode.window.showInputBox({
            prompt: 'Enter amount',
            placeHolder: '50.00',
        });
        const category = await vscode.window.showQuickPick([
            'Food & Dining',
            'Transportation',
            'Shopping',
            'Bills & Utilities',
            'Entertainment',
            'Other'
        ], {
            placeHolder: 'Select category'
        });
        if (description && amount) {
            const dbManager = database_1.DatabaseManager.getInstance();
            await dbManager.addExpense(authProvider.getUsername(), {
                description,
                amount: Number(amount),
                date: new Date().toISOString().split('T')[0],
                category: category || 'Other'
            });
            // Refresh dashboard
            vscode.commands.executeCommand('surplus.dashboard.refresh');
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to add expense. Please try again.');
    }
}
async function handleViewDashboard() {
    try {
        await vscode.commands.executeCommand('surplus.dashboard.focus');
        vscode.window.showInformationMessage('Dashboard opened!');
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to open dashboard.');
    }
}
async function handleTokenAuthentication(token) {
    const authProvider = auth_1.SurplusAuthProvider.getInstance();
    try {
        const isValid = await authProvider.verifyToken(token);
        if (isValid) {
            const user = authProvider.getCurrentUser();
            statusBar.setLoggedInUser(user.email || user.displayName || 'User');
            notificationManager.scheduleNotifications();
            vscode.window.showInformationMessage(`Successfully authenticated as ${user.email || user.displayName}`);
        }
        else {
            throw new Error('Token validation failed');
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Authentication failed: Invalid or expired token');
        console.error('Authentication error:', error);
        authProvider.setAuthenticated(false);
        statusBar.clearLoggedInUser();
    }
}
async function handleAddStock() {
    try {
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        if (!authProvider.isLoggedIn()) {
            vscode.window.showErrorMessage('Please log in first');
            return;
        }
        const stockSymbol = await vscode.window.showInputBox({
            prompt: 'Enter stock symbol (e.g., $TSLA)',
            placeHolder: '$TSLA',
            validateInput: (value) => {
                if (!value.startsWith('$')) {
                    return 'Stock symbol must start with $';
                }
                if (value.length < 2) {
                    return 'Please enter a valid stock symbol';
                }
                return null;
            }
        });
        if (stockSymbol) {
            const dbManager = database_1.DatabaseManager.getInstance();
            await dbManager.updateInvestmentPrefs(authProvider.getUsername(), stockSymbol);
            // Update dashboard if it's open
            vscode.commands.executeCommand('surplus.dashboard.refresh');
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to add stock symbol.');
    }
}
async function handleSignup() {
    try {
        const email = await vscode.window.showInputBox({
            prompt: 'Enter your email',
            placeHolder: 'email@example.com',
        });
        const password = await vscode.window.showInputBox({
            prompt: 'Enter your password',
            password: true,
        });
        if (email && password) {
            const authProvider = auth_1.SurplusAuthProvider.getInstance();
            const success = await authProvider.signup(email, password);
            if (success) {
                statusBar.setLoggedInUser(email);
                vscode.window.showInformationMessage('Successfully signed up! You are now logged in.');
            }
            else {
                throw new Error('Signup failed');
            }
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Signup failed. Please try again.');
    }
}
async function handleAddGoal() {
    try {
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        if (!authProvider.isLoggedIn()) {
            vscode.window.showErrorMessage('Please log in first');
            return;
        }
        const title = await vscode.window.showInputBox({
            prompt: 'Enter goal title',
            placeHolder: 'New Car'
        });
        const targetAmount = await vscode.window.showInputBox({
            prompt: 'Enter target amount',
            placeHolder: '50000'
        });
        const deadline = await vscode.window.showInputBox({
            prompt: 'Enter deadline (YYYY-MM-DD)',
            placeHolder: '2024-12-31'
        });
        if (title && targetAmount && deadline) {
            const dbManager = database_1.DatabaseManager.getInstance();
            await dbManager.addGoal(authProvider.getUsername(), {
                title,
                targetAmount: Number(targetAmount),
                currentAmount: 0,
                deadline
            });
            // Refresh dashboard
            vscode.commands.executeCommand('surplus.dashboard.refresh');
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to add goal. Please try again.');
    }
}
// Additional command handlers...
function deactivate() {
    statusBar.dispose();
    const dbManager = database_1.DatabaseManager.getInstance();
    dbManager.cleanup();
}
//# sourceMappingURL=extension.js.map