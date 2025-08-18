// app.js
import { initializeSync } from './sync';
import { showConflictResolutionDialog } from './conflict-resolution';

class QuoteStore {
    constructor() {
        this.quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        this.listeners = [];
        initializeSync(this);
    }

    // ... existing store methods ...

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }

    handleConflicts(conflicts) {
        return new Promise((resolve) => {
            showConflictResolutionDialog(conflicts, (index, resolution) => {
                const resolvedQuote = resolution === 'local'
                    ? conflicts[index].local
                    : conflicts[index].server;

                this.updateQuote(conflicts[index].local, resolvedQuote);
                conflicts.splice(index, 1);

                if (conflicts.length === 0) {
                    resolve();
                }
            });
        });
    }
}

// Initialize the store
const store = new QuoteStore();