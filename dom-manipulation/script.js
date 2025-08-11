// Initialize quotes array and current filter
let quotes = [];
let currentFilter = 'all';

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const resetFilterButton = document.getElementById('resetFilter');
const filterStatus = document.getElementById('filterStatus');
const addQuoteButton = document.getElementById('addQuoteBtn');

// Initialize the application
function init() {
    loadQuotes();
    populateCategories();
    restoreFilter();
    showRandomQuote();
    setupEventListeners();
}

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    } else {
        // Default quotes
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivational" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
            { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
        ];
        saveQuotes();
    }
}

// Save quotes and current filter to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('lastFilter', currentFilter);
}

// Populate category dropdown
function populateCategories() {
    // Clear existing options except "All"
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
}

// Filter quotes based on selected category
function filterQuotes() {
    currentFilter = categoryFilter.value;
    saveQuotes();
    updateQuoteDisplay();
    updateFilterStatus();
}

// Update the displayed quote
function updateQuoteDisplay() {
    const filteredQuotes = currentFilter === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === currentFilter);

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = `No quotes available in "${currentFilter}" category`;
        quoteCategoryElement.textContent = "";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;
}

// Show random quote (uses filtered results)
function showRandomQuote() {
    updateQuoteDisplay();
}

// Update filter status display
function updateFilterStatus() {
    if (currentFilter === 'all') {
        filterStatus.textContent = "Showing all quotes";
        filterStatus.classList.remove('active-filter');
    } else {
        filterStatus.textContent = `Showing: ${currentFilter}`;
        filterStatus.classList.add('active-filter');
    }
}

// Reset filter to show all categories
function resetFilter() {
    currentFilter = 'all';
    categoryFilter.value = 'all';
    saveQuotes();
    updateQuoteDisplay();
    updateFilterStatus();
}

// Restore last selected filter from storage
function restoreFilter() {
    const savedFilter = localStorage.getItem('lastFilter');
    if (savedFilter) {
        currentFilter = savedFilter;
        categoryFilter.value = currentFilter;
    }
}

// Add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (!quoteText || !quoteCategory) {
        alert('Please enter both quote text and category!');
        return;
    }

    // Add new quote
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    // Clear inputs
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update UI
    populateCategories();

    // If new category matches current filter, show the quote
    if (currentFilter === 'all' || currentFilter === quoteCategory) {
        quoteTextElement.textContent = newQuote.text;
        quoteCategoryElement.textContent = `— ${newQuote.category}`;
    }

    updateFilterStatus();
}

// Export quotes to JSON file
function exportQuotes() {
    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importQuotes() {
    const file = document.getElementById('importFile').files[0];
    if (!file) {
        alert('Please select a file first!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);

            if (!Array.isArray(importedQuotes)) {
                throw new Error('Invalid format: Expected an array of quotes');
            }

            // Validate each quote
            importedQuotes.forEach(quote => {
                if (!quote.text || !quote.category) {
                    throw new Error('Each quote must have text and category');
                }
            });

            quotes = importedQuotes;
            saveQuotes();
            populateCategories();
            showRandomQuote();
            alert(`Imported ${importedQuotes.length} quotes successfully!`);
        } catch (error) {
            alert(`Error importing quotes: ${error.message}`);
        }
    };
    reader.readAsText(file);
}

// Clear all stored data
function clearStorage() {
    if (confirm('Are you sure you want to clear all quotes and reset to default?')) {
        localStorage.removeItem('quotes');
        localStorage.removeItem('lastFilter');
        loadQuotes();
        populateCategories();
        resetFilter();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Show random quote
    newQuoteButton.addEventListener('click', showRandomQuote);

    // Filter controls
    categoryFilter.addEventListener('change', filterQuotes);
    resetFilterButton.addEventListener('click', resetFilter);

    // Add quote
    addQuoteButton.addEventListener('click', addQuote);

    // Data management
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
    document.getElementById('importQuotes').addEventListener('click', importQuotes);
    document.getElementById('clearStorage').addEventListener('click', clearStorage);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);