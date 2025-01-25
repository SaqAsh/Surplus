import * as vscode from 'vscode';

interface Task {
    title: string;
    dueDate: Date;
    completed: boolean;
}

export class SurplusNotificationManager {
    private context: vscode.ExtensionContext;
    private tasks: Task[] = [];

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public addTask(task: Task) {
        this.tasks.push(task);
        this.scheduleNotification(task);
    }

    public scheduleNotifications() {
        this.tasks.forEach(task => this.scheduleNotification(task));
    }

    private scheduleNotification(task: Task) {
        const config = vscode.workspace.getConfiguration('surplus');
        if (!config.get('notifications.enabled')) {
            return;
        }

        const reminderHours = config.get('notifications.reminderTime') as number;
        const now = new Date();
        const reminderTime = new Date(task.dueDate);
        reminderTime.setHours(reminderTime.getHours() - reminderHours);

        if (reminderTime > now && !task.completed) {
            setTimeout(() => {
                vscode.window.showWarningMessage(
                    `Task "${task.title}" is due in ${reminderHours} hours!`
                );
            }, reminderTime.getTime() - now.getTime());
        }
    }
} 