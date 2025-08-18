// sync.js
import { fetchQuotesFromServer, postQuoteToServer, updateQuoteOnServer } from './server';

const SYNC_INTERVAL = 30000; // Sync every 30 seconds
let lastSyncTime = 0;
let syncInProgress = false;

export const initializeSync = (store) => {
    // Initial sync
    syncWithServer(store);

    // Periodic sync
    setInterval(() => {
        if (!syncInProgress) {
            syncWithServer(store);
        }
    }, SYNC_INTERVAL);
};

export const syncWithServer = async (store) => {
    if (syncInProgress) return;

    syncInProgress = true;
    try {
        // Get local and server quotes
        const localQuotes = store.getQuotes();
        const serverQuotes = await fetchQuotesFromServer();

        // Detect conflicts and changes
        const { conflicts, updates } = detectChanges(localQuotes, serverQuotes);

        // Resolve conflicts (server wins in this simple strategy)
        if (conflicts.length > 0) {
            store.showNotification(`Resolved ${conflicts.length} conflicts with server data`);
        }

        // Apply updates
        if (updates.length > 0) {
            store.updateQuotes(updates);
            store.showNotification(`Updated ${updates.length} quotes from server`);
        }

        // Push local changes to server
        await pushLocalChanges(store, localQuotes, serverQuotes);

        lastSyncTime = Date.now();
    } catch (error) {
        store.showNotification('Sync failed: ' + error.message, 'error');
    } finally {
        syncInProgress = false;
    }
};

function detectChanges(localQuotes, serverQuotes) {
    const conflicts = [];
    const updates = [];

    // Find server updates we don't have
    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(q => q.id === serverQuote.id);

        if (!localQuote) {
            updates.push(serverQuote); // New quote from server
        } else if (localQuote.updatedAt && serverQuote.updatedAt &&
            localQuote.updatedAt < serverQuote.updatedAt) {
            if (JSON.stringify(localQuote) !== JSON.stringify(serverQuote)) {
                conflicts.push({ local: localQuote, server: serverQuote });
                updates.push(serverQuote); // Server wins
            }
        }
    });

    return { conflicts, updates };
}

async function pushLocalChanges(store, localQuotes, serverQuotes) {
    // Find local changes not on server
    for (const localQuote of localQuotes) {
        if (!localQuote.id) {
            // New quote - post to server
            const serverQuote = await postQuoteToServer(localQuote);
            store.updateQuote(localQuote, serverQuote); // Update local with server ID
        } else {
            const serverQuote = serverQuotes.find(q => q.id === localQuote.id);
            if (!serverQuote) {
                // Quote deleted on server? Handle accordingly
            } else if (localQuote.updatedAt > serverQuote.updatedAt) {
                // Our version is newer - push to server
                await updateQuoteOnServer(localQuote);
            }
        }
    }
}