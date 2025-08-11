// Quotes array - will be loaded from localStorage
let quotes = [];
let currentFilter = 'all';
let currentCategory = null;

// DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryButtonsContainer = document.getElementById('categoryButtons');
const categoryFilter = document.getElementById('categoryFilter');
const resetFilterButton = document.getElementById('resetFilter');
const exportButton = document.getElementById('exportQuotes');
const importFileInput = document.getElementById('importFile');
const importButton = document.getElementById('importQuotes');
const clearStorageButton = document.getElementById('clearStorage');
const addQuoteButton = document.getElementById('addQuoteBtn');

// Initialize the application
function init() {
    loadQuotes();
    createCategoryButtons();
    populateCategories();
    restoreFilter();
    showRandomQuote();
    setupEventListeners();

    // Store last session data in sessionStorage
    sessionStorage.setItem('lastInit', new Date().toISOString());
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

// Create category buttons
function createCategoryButtons() {
    categoryButtonsContainer.innerHTML = '';

    // Add "All" button
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.className = 'category-btn';
    allButton.addEventListener('click', () => {
        currentCategory = null;
        showRandomQuote();
        highlightSelectedButton(allButton);
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
            showRandomQuote();
            highlightSelectedButton(button);
        });
        categoryButtonsContainer.appendChild(button);
    });
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

// Highlight selected button
function highlightSelectedButton(selectedButton) {
    const buttons = categoryButtonsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.toggle('selected', button === selectedButton);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    currentFilter = categoryFilter.value;
    saveQuotes();
    showRandomQuote();
}

// Reset filter to show all categories
function resetFilter() {
    categoryFilter.value = 'all';
    currentFilter = 'all';
    saveQuotes();
    showRandomQuote();
}

// Restore last selected filter from storage
function restoreFilter() {
    const savedFilter = localStorage.getItem('lastFilter');
    if (savedFilter) {
        currentFilter = savedFilter;
        categoryFilter.value = currentFilter;
    }
}

// Display random quote based on current filter
function showRandomQuote() {
    let filteredQuotes = currentFilter === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === currentFilter);

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = currentFilter === 'all'
            ? "No quotes available."
            : `No quotes available in category "${currentFilter}".`;
        quoteCategoryElement.textContent = "";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;

    // Store last viewed quote in sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));

    // Update UI to show active filter
    updateFilterUI();
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

// Add a new quote
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
    createCategoryButtons();
    populateCategories();

    // If the new quote's category matches current filter or no filter is set
    if (currentFilter === 'all' || currentFilter === quoteCategory) {
        quoteTextElement.textContent = newQuote.text;
        quoteCategoryElement.textContent = `— ${newQuote.category}`;
        if (currentFilter !== quoteCategory) {
            categoryFilter.value = quoteCategory;
            currentFilter = quoteCategory;
            saveQuotes();
        }
    }

    // Highlight the new category button
    const newCategoryButton = [...categoryButtonsContainer.querySelectorAll('button')]
        .find(btn => btn.textContent === quoteCategory);
    if (newCategoryButton) highlightSelectedButton(newCategoryButton);

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
            createCategoryButtons();
            populateCategories();
            showRandomQuote();
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
        sessionStorage.clear();
        loadQuotes();
        createCategoryButtons();
        populateCategories();
        resetFilter();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Quote display
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