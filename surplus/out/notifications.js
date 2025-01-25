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
exports.SurplusNotificationManager = void 0;
const vscode = __importStar(require("vscode"));
class SurplusNotificationManager {
    context;
    tasks = [];
    constructor(context) {
        this.context = context;
    }
    addTask(task) {
        this.tasks.push(task);
        this.scheduleNotification(task);
    }
    scheduleNotifications() {
        this.tasks.forEach(task => this.scheduleNotification(task));
    }
    scheduleNotification(task) {
        const config = vscode.workspace.getConfiguration('surplus');
        if (!config.get('notifications.enabled')) {
            return;
        }
        const reminderHours = config.get('notifications.reminderTime');
        const now = new Date();
        const reminderTime = new Date(task.dueDate);
        reminderTime.setHours(reminderTime.getHours() - reminderHours);
        if (reminderTime > now && !task.completed) {
            setTimeout(() => {
                vscode.window.showWarningMessage(`Task "${task.title}" is due in ${reminderHours} hours!`);
            }, reminderTime.getTime() - now.getTime());
        }
    }
}
exports.SurplusNotificationManager = SurplusNotificationManager;
//# sourceMappingURL=notifications.js.map