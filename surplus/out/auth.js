"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurplusAuthProvider = void 0;
class SurplusAuthProvider {
    static instance;
    isAuthenticated = false;
    currentUser = null;
    static getInstance() {
        if (!this.instance) {
            this.instance = new SurplusAuthProvider();
        }
        return this.instance;
    }
    setAuthenticated(status, user) {
        this.isAuthenticated = status;
        this.currentUser = user || null;
    }
    async login(email, password) {
        // TODO: Implement actual authentication
        this.isAuthenticated = true;
        return true;
    }
    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
    }
    isLoggedIn() {
        return this.isAuthenticated;
    }
    getCurrentUser() {
        return this.currentUser;
    }
}
exports.SurplusAuthProvider = SurplusAuthProvider;
//# sourceMappingURL=auth.js.map