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

// Export quotes to JSON file
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import quotes from JSON file
function importFromJson() {
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
            showRandomQuote();
            alert(`Successfully imported ${importedQuotes.length} quotes!`);

            // Reset file input
            importFileInput.value = '';
        } catch (error) {
            alert(`Error importing quotes: ${error.message}`);
        }
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
    newQuoteButton.addEventListener('click', showRandomQuote);
    exportButton.addEventListener('click', exportToJson);
    clearStorageButton.addEventListener('click', clearStorage);

    // Display last viewed quote from session if available
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        try {
            const parsedQuote = JSON.parse(lastQuote);
            quoteTextElement.textContent = parsedQuote.text;
            quoteCategoryElement.textContent = `— ${parsedQuote.category}`;
        } catch (e) {
            console.error('Error parsing last quote from session:', e);
        }
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', init);