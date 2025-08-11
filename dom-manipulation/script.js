// Quotes array - will be loaded from localStorage
let quotes = [];
let currentFilter = 'all';

// DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const resetFilterButton = document.getElementById('resetFilter');
const exportButton = document.getElementById('exportQuotes');
const importFileInput = document.getElementById('importFile');
const importButton = document.getElementById('importQuotes');
const clearStorageButton = document.getElementById('clearStorage');
const addQuoteButton = document.getElementById('addQuoteBtn');
const quoteDisplay = document.getElementById('quoteDisplay');

// Initialize the application
function init() {
    loadQuotes();
    createAddQuoteForm(); // Explicitly create the form
    populateCategories();
    restoreFilter();
    showRandomQuote();
    setupEventListeners();
}

// Create the add quote form (though it exists in HTML)
function createAddQuoteForm() {
    // Form is already in HTML, but we can add any JS enhancements here
    console.log("Add quote form is ready and initialized");
}

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    } else {
        // Default quotes if none are saved
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivational" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
            { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
        ];
        saveQuotes();
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('lastFilter', currentFilter);
}

// Populate category filter dropdown
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

// Filter quotes based on selected category and update display
function filterQuotes() {
    currentFilter = categoryFilter.value;
    saveQuotes(); // Save the current filter
    updateQuoteDisplay();
}

// Update the quote display based on current filter
function updateQuoteDisplay() {
    let filteredQuotes = currentFilter === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === currentFilter);

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = currentFilter === 'all'
            ? "No quotes available."
            : `No quotes available in category "${currentFilter}".`;
        quoteCategoryElement.textContent = "";
        quoteDisplay.style.display = 'block'; // Ensure display is visible
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;
    quoteDisplay.style.display = 'block';

    updateFilterUI();
}

// Show random quote (uses updateQuoteDisplay internally)
function showRandomQuote() {
    updateQuoteDisplay();
}

// Reset filter to show all categories
function resetFilter() {
    categoryFilter.value = 'all';
    currentFilter = 'all';
    saveQuotes();
    updateQuoteDisplay();
}

// Restore last selected filter from storage
function restoreFilter() {
    const savedFilter = localStorage.getItem('lastFilter');
    if (savedFilter) {
        currentFilter = savedFilter;
        categoryFilter.value = currentFilter;
        console.log("Restored filter:", currentFilter);
    }
}

// Update UI to reflect active filter
function updateFilterUI() {
    const filterLabel = document.getElementById('filterLabel');

    if (currentFilter === 'all') {
        filterLabel.textContent = "Filter Quotes";
        filterLabel.classList.remove('filter-active');
    } else {
        filterLabel.textContent = `Showing: ${currentFilter}`;
        filterLabel.classList.add('filter-active');
    }
}

// Add a new quote to the array and update DOM
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (!quoteText || !quoteCategory) {
        alert('Please enter both quote text and category!');
        return;
    }

    // Add to quotes array
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };
    quotes.push(newQuote);
    saveQuotes();

    // Clear inputs
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update UI
    populateCategories();

    // Show the new quote if it matches current filter
    if (currentFilter === 'all' || currentFilter === quoteCategory) {
        quoteTextElement.textContent = newQuote.text;
        quoteCategoryElement.textContent = `— ${newQuote.category}`;
        quoteDisplay.style.display = 'block';

        if (currentFilter !== quoteCategory) {
            categoryFilter.value = quoteCategory;
            currentFilter = quoteCategory;
            saveQuotes();
        }
    }

    updateFilterUI();
}

// Export quotes to JSON file using Blob
function exportToJsonFile() {
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
function importFromJsonFile() {
    const file = importFileInput.files[0];
    if (!file) {
        alert('Please select a file first!');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);

            if (!Array.isArray(importedQuotes)) {
                throw new Error('Invalid format: Expected an array of quotes');
            }

            // Validate each quote
            for (const quote of importedQuotes) {
                if (!quote.text || !quote.category) {
                    throw new Error('Invalid quote format: Each quote must have text and category');
                }
            }

            quotes = importedQuotes;
            saveQuotes();
            populateCategories();
            updateQuoteDisplay();
            alert(`Successfully imported ${importedQuotes.length} quotes!`);

            // Reset file input
            importFileInput.value = '';
        } catch (error) {
            alert(`Error importing quotes: ${error.message}`);
        }
    };
    fileReader.onerror = function () {
        alert('Error reading file');
    };
    fileReader.readAsText(file);
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
    // Explicit event listener for "Show New Quote" button
    newQuoteButton.addEventListener('click', showRandomQuote);

    // Filter controls
    categoryFilter.addEventListener('change', filterQuotes);
    resetFilterButton.addEventListener('click', resetFilter);

    // Data management
    exportButton.addEventListener('click', exportToJsonFile);
    importButton.addEventListener('click', importFromJsonFile);
    clearStorageButton.addEventListener('click', clearStorage);

    // Add quote
    addQuoteButton.addEventListener('click', addQuote);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', init);