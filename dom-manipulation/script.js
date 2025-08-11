// Quotes array - will be loaded from localStorage
let quotes = [];

// DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryButtonsContainer = document.getElementById('categoryButtons');
const exportButton = document.getElementById('exportQuotes');
const importFileInput = document.getElementById('importFile');
const clearStorageButton = document.getElementById('clearStorage');

// Current selected category
let currentCategory = null;

// Initialize the application
function init() {
    loadQuotes();
    showRandomQuote();
    createCategoryButtons();
    setupEventListeners();

    // Create the add quote form (though it's already in HTML)
    createAddQuoteForm();
}

// Create the add quote form (though it exists in HTML)
function createAddQuoteForm() {
    // Form is already in HTML, but we can add any JS enhancements here
    console.log("Add quote form is ready");
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

    // Store last session data in sessionStorage
    sessionStorage.setItem('lastInit', new Date().toISOString());
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display random quote
function showRandomQuote() {
    let filteredQuotes = currentCategory
        ? quotes.filter(quote => quote.category === currentCategory)
        : quotes;

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = "No quotes available in this category.";
        quoteCategoryElement.textContent = "";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;

    // Store last viewed quote in sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
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

// Highlight selected button
function highlightSelectedButton(selectedButton) {
    const buttons = categoryButtonsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.toggle('selected', button === selectedButton);
    });
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
    currentCategory = quoteCategory;
    quoteTextElement.textContent = newQuote.text;
    quoteCategoryElement.textContent = `— ${newQuote.category}`;

    // Highlight the new category button
    const newCategoryButton = [...categoryButtonsContainer.querySelectorAll('button')]
        .find(btn => btn.textContent === quoteCategory);
    if (newCategoryButton) highlightSelectedButton(newCategoryButton);
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
function importFromJsonFile(event) {
    const file = event.target.files[0];
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
            showRandomQuote();
            alert(`Successfully imported ${importedQuotes.length} quotes!`);

            // Reset file input
            event.target.value = '';
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
        sessionStorage.clear();
        loadQuotes();
        createCategoryButtons();
        showRandomQuote();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Event listener for "Show New Quote" button
    newQuoteButton.addEventListener('click', showRandomQuote);

    // Event listener for export button
    exportButton.addEventListener('click', exportToJsonFile);

    // Event listener for import file input
    importFileInput.addEventListener('change', importFromJsonFile);

    // Event listener for clear storage button
    clearStorageButton.addEventListener('click', clearStorage);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', init);