// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SurplusStatusBar } from './statusBar';
import { SurplusAuthProvider } from './auth';
import { SurplusNotificationManager } from './notifications';
import { DashboardViewProvider } from './webview/DashboardViewProvider';
import reverseLookUp from './firebase/adminFunctions';

let statusBar: SurplusStatusBar;
let notificationManager: SurplusNotificationManager;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
  // Initialize components
  statusBar = new SurplusStatusBar();
  notificationManager = new SurplusNotificationManager(context);

  console.log('Congratulations, your extension "surplus" is now active!');

  // Register the webview provider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      DashboardViewProvider.viewType,
      new DashboardViewProvider(context.extensionUri)
    )
  );

  // Add URI handler registration
  context.subscriptions.push(
    vscode.window.registerUriHandler({
      handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
        if (uri.path === '/surplus') {
          const queryParams = new URLSearchParams(uri.query);
          const token = queryParams.get('token');

          if (token) {
            handleTokenAuthentication(token);
          } else {
            vscode.window.showErrorMessage('No authentication token provided');
          }
        }
      },
    })
  );

  // Register commands
  let disposables = [
    vscode.commands.registerCommand('surplus.login', () => handleLogin()),
    vscode.commands.registerCommand('surplus.logout', () => handleLogout()),
    vscode.commands.registerCommand('surplus.addTask', () => handleAddTask()),
    vscode.commands.registerCommand('surplus.addExpense', () => handleAddExpense()),
    vscode.commands.registerCommand('surplus.viewDashboard', () => handleViewDashboard()),
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
    const description = await vscode.window.showInputBox({
      prompt: 'Enter expense description',
      placeHolder: 'Groceries',
    });

    const amount = await vscode.window.showInputBox({
      prompt: 'Enter amount',
      placeHolder: '50.00',
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

async function handleTokenAuthentication(token: string) {
  try {
    // Use the reverse lookup function to verify token and get user info
    const userInfo = await reverseLookUp(token);

    if (!userInfo) {
      throw new Error('Failed to get user info');
    }

    // Update status bar and auth state
    const authProvider = SurplusAuthProvider.getInstance();
    authProvider.setAuthenticated(true, userInfo);
    statusBar.setLoggedInUser(userInfo.email || userInfo.displayName || 'User');

    // Schedule notifications for the authenticated user
    notificationManager.scheduleNotifications();

    // Show success message
    vscode.window.showInformationMessage(
      `Successfully authenticated as ${userInfo.email || userInfo.displayName || 'User'}`
    );
  } catch (error) {
    vscode.window.showErrorMessage('Failed to authenticate: Invalid or expired token');
    console.error('Authentication error:', error);

    // Reset auth state on failure
    const authProvider = SurplusAuthProvider.getInstance();
    authProvider.setAuthenticated(false);
    statusBar.clearLoggedInUser();
  }
}

// Additional command handlers...
export function deactivate() {
  statusBar.dispose();
}
