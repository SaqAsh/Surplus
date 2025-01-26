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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const adminFunctions_1 = __importDefault(require("./firebase/adminFunctions"));
let statusBar;
let notificationManager;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function activate(context) {
    // Initialize components
    statusBar = new statusBar_1.SurplusStatusBar();
    notificationManager = new notifications_1.SurplusNotificationManager(context);
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "surplus" is now active!');
    // Register the webview provider
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(DashboardViewProvider_1.DashboardViewProvider.viewType, new DashboardViewProvider_1.DashboardViewProvider(context.extensionUri)));
    // Add URI handler registration
    context.subscriptions.push(vscode.window.registerUriHandler({
        handleUri(uri) {
            console.log('Received URI:', uri.toString());
            const queryParams = new URLSearchParams(uri.query);
            const token = queryParams.get('token');
            if (token) {
                console.log('Received token from URI handler');
                handleTokenAuthentication(decodeURIComponent(token));
            }
            else {
                vscode.window.showErrorMessage('No authentication token provided');
            }
        }
    }));
    // Register commands
    let disposables = [
        vscode.commands.registerCommand('surplus.login', () => handleLogin()),
        vscode.commands.registerCommand('surplus.logout', () => handleLogout()),
        vscode.commands.registerCommand('surplus.addTask', () => handleAddTask()),
        vscode.commands.registerCommand('surplus.addExpense', () => handleAddExpense()),
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
            placeHolder: 'email@example.com'
        });
        const password = await vscode.window.showInputBox({
            prompt: 'Enter your password',
            password: true
        });
        if (email && password) {
            // Implement actual login logic here
            handleTokenAuthentication('eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxYjUyMjFlN2E1ZGUwZTVhZjQ5N2UzNzVhNzRiMDZkODJiYTc4OGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc3VycGx1cy1hZWQ3OSIsImF1ZCI6InN1cnBsdXMtYWVkNzkiLCJhdXRoX3RpbWUiOjE3Mzc4Nzc0MzcsInVzZXJfaWQiOiI5Z2V2cjB4WUFuZWtSczJleWVzUHc5ZU9BVHAyIiwic3ViIjoiOWdldnIweFlBbmVrUnMyZXllc1B3OWVPQVRwMiIsImlhdCI6MTczNzg3NzQzNywiZXhwIjoxNzM3ODgxMDM3LCJlbWFpbCI6InRlc3RAdGVzdC50ZXN0IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInRlc3RAdGVzdC50ZXN0Il19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.NKptQ0VAISe5f1k3IaQW-HM6Vzw8Dxkcz26mJrR162zTDuKGRpe2piJUa3QVlzcvfcujKF-xFa0FYLf3vODG9yt1WU7Rm9thnidpxKxE4fJd7ieVwD6n3YVsTYGDqvN3eO0t8D_dBZIPxUYZ2sA3Dw0HKXeiORaSvt4jKM51CuWuv2J-BlefjsS09xA8Of-K3Qg5HVo8CFjQ8vp2YI2PBXszpmdNMuaDzjS7CTZeNMLGpmMtFOYzZSl312-UVEEUAiV4TPXARlNabBxSYPmLvgqXJ9ifH0E0DfRzd09G77yHHy9gZ8uRqZSYGKK6jdyK-ISCUwD1ZyXpFwJQ3UnOAw');
            statusBar.setLoggedInUser(email);
            notificationManager.scheduleNotifications();
            vscode.window.showInformationMessage('Successfully logged in!');
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Login failed. Please try again.');
    }
}
async function handleLogout() {
    try {
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        authProvider.logout();
        statusBar.clearLoggedInUser();
        vscode.window.showInformationMessage('Successfully logged out!');
    }
    catch (error) {
        vscode.window.showErrorMessage('Logout failed. Please try again.');
    }
}
async function handleAddTask() {
    const title = await vscode.window.showInputBox({
        prompt: 'Enter task title',
        placeHolder: 'Pay rent'
    });
    const dueDate = await vscode.window.showInputBox({
        prompt: 'Enter due date (YYYY-MM-DD)',
        placeHolder: '2024-03-01'
    });
    if (title && dueDate) {
        notificationManager.addTask({
            title,
            dueDate: new Date(dueDate),
            completed: false
        });
        vscode.window.showInformationMessage(`Task "${title}" added successfully!`);
    }
}
async function handleAddExpense() {
    try {
        const description = await vscode.window.showInputBox({
            prompt: 'Enter expense description',
            placeHolder: 'Groceries'
        });
        const amount = await vscode.window.showInputBox({
            prompt: 'Enter amount',
            placeHolder: '50.00'
        });
        if (description && amount) {
            vscode.window.showInformationMessage(`Expense "${description}" added successfully!`);
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
    try {
        // Use the reverse lookup function to verify token and get user info
        const userInfo = await (0, adminFunctions_1.default)(token);
        if (!userInfo) {
            throw new Error('Failed to get user info');
        }
        // Update status bar and auth state
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        authProvider.setAuthenticated(true, userInfo);
        statusBar.setLoggedInUser(userInfo.email || userInfo.displayName || 'User');
        // Schedule notifications for the authenticated user
        notificationManager.scheduleNotifications();
        // Show success message
        vscode.window.showInformationMessage(`Successfully authenticated as ${userInfo.email || userInfo.displayName || 'User'}`);
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to authenticate: Invalid or expired token');
        console.error('Authentication error:', error);
        // Reset auth state on failure
        const authProvider = auth_1.SurplusAuthProvider.getInstance();
        authProvider.setAuthenticated(false);
        statusBar.clearLoggedInUser();
    }
}
// Additional command handlers...
function deactivate() {
    statusBar.dispose();
}
//# sourceMappingURL=extension.js.map