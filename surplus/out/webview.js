"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurplusWebviewProvider = void 0;
class SurplusWebviewProvider {
    context;
    constructor(context) {
        this.context = context;
    }
    resolveWebviewView(webviewView) {
        webviewView.webview.html = this.getHtmlContent();
    }
    getHtmlContent() {
        return `
            <!DOCTYPE html>
            <html>
                <body>
                    <h1>Surplus Dashboard</h1>
                    <p>Welcome to your financial dashboard!</p>
                </body>
            </html>
        `;
    }
}
exports.SurplusWebviewProvider = SurplusWebviewProvider;
//# sourceMappingURL=webview.js.map