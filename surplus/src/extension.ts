// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SurplusStatusBar } from './statusBar';
import { SurplusAuthProvider } from './auth';
import { SurplusNotificationManager } from './notifications';
import { SurplusWebviewProvider } from './webview';

let statusBar: SurplusStatusBar;
let notificationManager: SurplusNotificationManager;
let webviewProvider: SurplusWebviewProvider;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// Initialize components
	statusBar = new SurplusStatusBar();
	notificationManager = new SurplusNotificationManager(context);
	webviewProvider = new SurplusWebviewProvider(context);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "surplus" is now active!');

	// Register the webview provider
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'surplus.dashboardView',
			webviewProvider
		)
	);

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
			statusBar.setLoggedInUser(email);
			notificationManager.scheduleNotifications();
			vscode.window.showInformationMessage('Successfully logged in!');
		}
	} catch (error) {
		vscode.window.showErrorMessage('Login failed. Please try again.');
	}
}

async function handleLogout() {
	try {
		const authProvider = SurplusAuthProvider.getInstance();
		authProvider.logout();
		statusBar.clearLoggedInUser();
		vscode.window.showInformationMessage('Successfully logged out!');
	} catch (error) {
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
	} catch (error) {
		vscode.window.showErrorMessage('Failed to add expense. Please try again.');
	}
}

async function handleViewDashboard() {
	try {
		await vscode.commands.executeCommand('surplus.dashboard.focus');
		vscode.window.showInformationMessage('Dashboard opened!');
	} catch (error) {
		vscode.window.showErrorMessage('Failed to open dashboard.');
	}
}

// Additional command handlers...
export function deactivate() {
	statusBar.dispose();
}
