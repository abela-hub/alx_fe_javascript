// Initialize quotes array and current filter
let quotes = [];
let currentFilter = 'all'; // This replaces 'selectedCategory' from requirements

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
    restoreLastFilter(); // Restore the last selected category
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
    localStorage.setItem('lastFilter', currentFilter); // Save the current filter
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
    // Get the selected category from dropdown
    currentFilter = categoryFilter.value;

    // Save the current filter to localStorage
    localStorage.setItem('lastFilter', currentFilter);

    // Update the displayed quote
    updateQuoteDisplay();

    // Update the filter status display
    updateFilterStatus();
}

// Update the displayed quote based on current filter
function updateQuoteDisplay() {
    // Filter quotes based on current selection
    const filteredQuotes = currentFilter === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === currentFilter);

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = currentFilter === 'all'
            ? "No quotes available."
            : `No quotes available in "${currentFilter}" category`;
        quoteCategoryElement.textContent = "";
        return;
    }

    // Get a random quote from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Update the DOM
    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;
}

// Restore the last selected filter from localStorage
function restoreLastFilter() {
    const savedFilter = localStorage.getItem('lastFilter');
    if (savedFilter) {
        currentFilter = savedFilter;
        categoryFilter.value = currentFilter;
        console.log(`Restored last filter: ${currentFilter}`);
    }
}

// Show random quote (respects current filter)
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
    localStorage.setItem('lastFilter', 'all'); // Update storage
    updateQuoteDisplay();
    updateFilterStatus();
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
    populateCategories(); // Refresh category dropdown

    // If new category matches current filter, show the quote
    if (currentFilter === 'all' || currentFilter === quoteCategory) {
        quoteTextElement.textContent = newQuote.text;
        quoteCategoryElement.textContent = `— ${newQuote.category}`;
    }

    updateFilterStatus();
}

// ... (remaining functions for export/import/clear storage remain the same)

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