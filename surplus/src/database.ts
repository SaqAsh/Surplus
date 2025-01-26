import { getDatabase, ref, set, onValue } from 'firebase/database';
import { initializeApp, getApp, getApps } from 'firebase/app';
import * as vscode from 'vscode';

const firebaseConfig = {
    apiKey: "AIzaSyBZHavEWbWJikh20WOZMLkWs2beoz_TPzE",
    authDomain: "surplus-aed79.firebaseapp.com",
    databaseURL: "https://surplus-aed79-default-rtdb.firebaseio.com",
    projectId: "surplus-aed79",
    storageBucket: "surplus-aed79.appspot.com",
    messagingSenderId: "992402453671",
    appId: "1:992402453671:web:0e9b0a92bc9ce7167c5782"
};

export interface Goal {
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
}

export interface Expense {
    description: string;
    amount: number;
    date: string;
    category?: string;
}

export class DatabaseManager {
    private static instance: DatabaseManager;
    private app: any;
    private db: any;
    private stocksStatusBarItem: vscode.StatusBarItem;
    private listeners: (() => void)[] = [];

    private constructor() {
        try {
            // Try to get existing app first
            this.app = getApp();
        } catch {
            // Only initialize if no app exists
            this.app = initializeApp(firebaseConfig);
        }
        
        this.db = getDatabase(this.app);
        this.stocksStatusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            99
        );
    }

    static getInstance(): DatabaseManager {
        if (!this.instance) {
            this.instance = new DatabaseManager();
        }
        return this.instance;
    }

    public cleanup() {
        // Remove all listeners
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }

    async updateInvestmentPrefs(username: string, stockSymbol: string): Promise<void> {
        try {
            const reference = ref(this.db, `users/${username}/investmentPrefs/stocks`);
            const currentStocks = await this.readInvestmentPrefs(username);
            const updatedStocks = currentStocks ? [...currentStocks.split(','), stockSymbol] : [stockSymbol];
            
            await set(reference, updatedStocks.join(','));
            this.stocksStatusBarItem.text = `$(graph) ${updatedStocks.join(', ')}`;
            this.stocksStatusBarItem.tooltip = 'Current Stock Watch';
            this.stocksStatusBarItem.show();
            
            vscode.window.showInformationMessage(`Added ${stockSymbol} to investment preferences`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to update investment preferences: ${error}`);
        }
    }

    async readInvestmentPrefs(username: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const reference = ref(this.db, `users/${username}/investmentPrefs/stocks`);
            onValue(reference, (snapshot) => {
                const stockSymbols = snapshot.val();
                if (stockSymbols) {
                    this.stocksStatusBarItem.text = `$(graph) ${stockSymbols}`;
                    this.stocksStatusBarItem.tooltip = 'Current Stock Watch';
                    this.stocksStatusBarItem.show();
                }
                resolve(stockSymbols || '');
            }, reject);
        });
    }

    async addGoal(username: string, goal: Goal): Promise<void> {
        try {
            const reference = ref(this.db, `users/${username}/goals/${goal.title}`);
            await set(reference, goal);
            vscode.window.showInformationMessage(`Added goal: ${goal.title}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to add goal: ${error}`);
        }
    }

    async readGoals(username: string): Promise<Goal[]> {
        return new Promise((resolve, reject) => {
            const reference = ref(this.db, `users/${username}/goals`);
            onValue(reference, (snapshot) => {
                const goals = snapshot.val();
                resolve(goals ? Object.values(goals) : []);
            }, reject);
        });
    }

    async updateGoalProgress(username: string, goalTitle: string, currentAmount: number): Promise<void> {
        try {
            const reference = ref(this.db, `users/${username}/goals/${goalTitle}/currentAmount`);
            await set(reference, currentAmount);
            vscode.window.showInformationMessage(`Updated progress for goal: ${goalTitle}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to update goal progress: ${error}`);
        }
    }

    async addExpense(username: string, expense: Expense): Promise<void> {
        try {
            const reference = ref(this.db, `users/${username}/expenses/${Date.now()}`);
            await set(reference, expense);
            vscode.window.showInformationMessage(`Added expense: ${expense.description}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to add expense: ${error}`);
        }
    }

    async readExpenses(username: string): Promise<Expense[]> {
        return new Promise((resolve, reject) => {
            const reference = ref(this.db, `users/${username}/expenses`);
            onValue(reference, (snapshot) => {
                const expenses = snapshot.val();
                resolve(expenses ? Object.values(expenses) : []);
            }, reject);
        });
    }

    clearStockDisplay(): void {
        this.stocksStatusBarItem.hide();
    }

    onStocksChange(username: string, callback: () => void): void {
        const reference = ref(this.db, `users/${username}/investmentPrefs/stocks`);
        onValue(reference, () => callback());
    }

    onGoalsChange(username: string, callback: () => void): void {
        const reference = ref(this.db, `users/${username}/goals`);
        onValue(reference, () => callback());
    }

    onExpensesChange(username: string, callback: () => void): void {
        const reference = ref(this.db, `users/${username}/expenses`);
        onValue(reference, () => callback());
    }
} 