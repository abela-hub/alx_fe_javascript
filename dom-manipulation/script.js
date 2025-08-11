// Initial quotes array loaded from local storage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

// DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const syncButton = document.getElementById('syncButton');
const conflictResolution = document.getElementById('conflictResolution');
const keepLocalBtn = document.getElementById('keepLocalBtn');
const useServerBtn = document.getElementById('useServerBtn');

// Simulate server URL
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Initialize the application
function init() {
    loadLastViewedQuote();
    populateCategories();
    setupEventListeners();
    showRandomQuote();

    // Periodic sync (every 5 minutes)
    setInterval(syncWithServer, 5 * 60 * 1000);
}

// Load last viewed quote from session storage
function loadLastViewedQuote() {
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quote = JSON.parse(lastViewedQuote);
        quoteTextElement.textContent = quote.text;
        quoteCategoryElement.textContent = `— ${quote.category}`;
    }
}

// Populate categories dropdown
function populateCategories() {
    // Clear existing options except "All Categories"
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }

    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];

    // Add categories to dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter from local storage
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = selectedCategory === 'all'
            ? "No quotes available. Add some quotes!"
            : `No quotes in category "${selectedCategory}".`;
        quoteCategoryElement.textContent = "";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;

    // Store last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Add a new quote
function addQuote() {
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';

        // Update categories dropdown if this is a new category
        if (![...categoryFilter.options].some(opt => opt.value === category)) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }

        showRandomQuote();
        showNotification('Quote added successfully!');
    } else {
        showNotification('Please enter both quote text and category.', true);
    }
}

// Export quotes to JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    showNotification('Quotes exported successfully!');
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes = importedQuotes;
                saveQuotes();
                populateCategories();
                showRandomQuote();
                showNotification(`Successfully imported ${importedQuotes.length} quotes!`);
            } else {
                showNotification('Invalid format: Expected an array of quotes.', true);
            }
        } catch (error) {
            showNotification('Error parsing JSON file: ' + error.message, true);
        }
    };
    fileReader.readAsText(file);
}

// Sync data with server (simulated)
async function syncWithServer() {
    try {
        // Simulate fetching from server
        const response = await fetch(SERVER_URL);
        if (!response.ok) throw new Error('Server error');

        const serverData = await response.json();

        // In a real app, we would have proper merging logic
        // For simulation, we'll just show a notification
        showNotification('Data synced with server (simulated)');

        // Here you would implement your actual merge logic
        // For example:
        // - Compare timestamps
        // - Handle conflicts
        // - Merge changes

        // Simulate conflict detection (randomly for demo purposes)
        if (Math.random() > 0.7) {
            showConflictResolution();
        }

    } catch (error) {
        showNotification(`Sync failed: ${error.message}`, true);
    }
}

// Show conflict resolution UI
function showConflictResolution() {
    conflictResolution.style.display = 'block';
}

// Hide conflict resolution UI
function hideConflictResolution() {
    conflictResolution.style.display = 'none';
}

// Show notification
function showNotification(message, isError = false) {
    const notificationArea = document.getElementById('notificationArea');
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${isError ? 'error' : 'success'}`;

    notificationArea.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup all event listeners
function setupEventListeners() {
    // Show random quote
    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Filter quotes when category changes
    categoryFilter.addEventListener('change', function () {
        localStorage.setItem('lastCategoryFilter', this.value);
        showRandomQuote();
    });

    // Add new quote
    addQuoteBtn.addEventListener('click', addQuote);

    // Export quotes
    exportBtn.addEventListener('click', exportToJsonFile);

    // Import quotes
    importFile.addEventListener('change', importFromJsonFile);

    // Sync with server
    syncButton.addEventListener('click', syncWithServer);

    // Conflict resolution
    keepLocalBtn.addEventListener('click', function () {
        showNotification('Keeping local changes');
        hideConflictResolution();
    });

    useServerBtn.addEventListener('click', function () {
        showNotification('Using server version');
        hideConflictResolution();
    });

    // Allow adding quote with Enter key
    newQuoteTextInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addQuote();
    });

    newQuoteCategoryInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addQuote();
    });
}

// Initialize the application
init();