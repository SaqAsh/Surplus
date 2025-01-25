"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurplusAuthProvider = void 0;
class SurplusAuthProvider {
    static instance;
    isAuthenticated = false;
    static getInstance() {
        if (!this.instance) {
            this.instance = new SurplusAuthProvider();
        }
        return this.instance;
    }
    async login(email, password) {
        // TODO: Implement actual authentication
        this.isAuthenticated = true;
        return true;
    }
    logout() {
        this.isAuthenticated = false;
    }
    isLoggedIn() {
        return this.isAuthenticated;
    }
}
exports.SurplusAuthProvider = SurplusAuthProvider;
//# sourceMappingURL=auth.js.map