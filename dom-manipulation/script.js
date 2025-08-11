// Initialize quotes array and filter state
let quotes = [];
let currentFilter = 'all'; // Tracks the currently selected filter
let currentCategory = null; // For button-based filtering (kept for backward compatibility)

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryButtonsContainer = document.getElementById('categoryButtons');
const categoryFilter = document.getElementById('categoryFilter');
const resetFilterButton = document.getElementById('resetFilter');
const filterStatus = document.getElementById('filterStatus');
const addQuoteButton = document.getElementById('addQuoteBtn');
const exportButton = document.getElementById('exportQuotes');
const importFileInput = document.getElementById('importFile');
const importButton = document.getElementById('importQuotes');
const clearStorageButton = document.getElementById('clearStorage');

// Initialize the application
function init() {
    loadQuotes();
    createAddQuoteForm();
    createCategoryButtons(); // For button-based filtering
    populateCategories(); // For dropdown filtering
    restoreLastFilter();
    showRandomQuote();
    setupEventListeners();
}

// Create the add quote form
function createAddQuoteForm() {
    console.log("Add quote form is ready");
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
    sessionStorage.setItem('lastInit', new Date().toISOString());
}

// Save quotes and current filter to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('lastFilter', currentFilter);
}

// Create category buttons (button-based filtering)
function createCategoryButtons() {
    categoryButtonsContainer.innerHTML = '';

    // Add "All" button
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.className = 'category-btn';
    allButton.addEventListener('click', () => {
        currentCategory = null;
        currentFilter = 'all';
        showRandomQuote();
        highlightSelectedButton(allButton);
        updateFilterStatus();
    });
    categoryButtonsContainer.appendChild(allButton);

    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];

    // Add category buttons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = 'category-btn';
        button.addEventListener('click', () => {
            currentCategory = category;
            currentFilter = category;
            showRandomQuote();
            highlightSelectedButton(button);
            updateFilterStatus();
        });
        categoryButtonsContainer.appendChild(button);
    });
}

// Populate category dropdown (dropdown-based filtering)
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

// Filter quotes based on selected category (dropdown)
function filterQuotes() {
    currentFilter = categoryFilter.value;
    currentCategory = currentFilter === 'all' ? null : currentFilter;
    saveQuotes();
    showRandomQuote();
    updateFilterStatus();

    // Sync button highlighting
    const buttons = categoryButtonsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.toggle('selected',
            (currentFilter === 'all' && button.textContent === 'All') ||
            button.textContent === currentFilter
        );
    });
}

// Highlight selected button (button-based filtering)
function highlightSelectedButton(selectedButton) {
    const buttons = categoryButtonsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.toggle('selected', button === selectedButton);
    });
}

// Update the displayed quote
function updateQuoteDisplay() {
    let filteredQuotes = currentFilter === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === currentFilter);

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = currentFilter === 'all'
            ? "No quotes available."
            : `No quotes available in "${currentFilter}" category`;
        quoteCategoryElement.textContent = "";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;
}

// Show random quote (respects current filter)
function showRandomQuote() {
    updateQuoteDisplay();
}

// Restore last selected filter from storage
function restoreLastFilter() {
    const savedFilter = localStorage.getItem('lastFilter');
    if (savedFilter) {
        currentFilter = savedFilter;
        categoryFilter.value = currentFilter;

        // Sync button highlighting
        const buttons = categoryButtonsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.toggle('selected',
                (currentFilter === 'all' && button.textContent === 'All') ||
                button.textContent === currentFilter
            );
        });
    }
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
    currentCategory = null;
    categoryFilter.value = 'all';
    saveQuotes();
    showRandomQuote();
    updateFilterStatus();

    // Sync button highlighting
    const allButton = categoryButtonsContainer.querySelector('button');
    highlightSelectedButton(allButton);
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
    createCategoryButtons();
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
    try {
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
    } catch (error) {
        alert('Error exporting quotes: ' + error.message);
    }
}

// Import quotes from JSON file
function importQuotes() {
    const file = importFileInput.files[0];
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
            createCategoryButtons();
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
        createCategoryButtons();
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
    exportButton.addEventListener('click', exportQuotes);
    importButton.addEventListener('click', importQuotes);
    clearStorageButton.addEventListener('click', clearStorage);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);