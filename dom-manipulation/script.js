// Initialize quotes array and current filter
let quotes = [];
let selectedCategory = 'all';

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
    restoreSelectedCategory();
    showRandomQuote();
    setupEventListeners();
}

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    quotes = savedQuotes ? JSON.parse(savedQuotes) : getDefaultQuotes();
    saveQuotes();
}

function getDefaultQuotes() {
    return [
        { text: "The only way to do great work is to love what you do.", category: "Motivational" },
        { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
        { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
    ];
}

// Save quotes and selected category
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('selectedCategory', selectedCategory);
}

// Populate category dropdown
function populateCategories() {
    // Clear existing options except "All"
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }

    // Add current categories
    [...new Set(quotes.map(quote => quote.category))].forEach(category => {
        const option = new Option(category, category);
        categoryFilter.add(option);
    });
}

// Filter and display quotes
function filterQuotes() {
    selectedCategory = categoryFilter.value;
    saveQuotes();
    showRandomQuote();
}

// Display random quote (respecting current filter)
function showRandomQuote() {
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = `No quotes in "${selectedCategory}" category`;
        quoteCategoryElement.textContent = "";
        return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    displayQuote(randomQuote);
}

// Update DOM with a quote
function displayQuote(quote) {
    quoteTextElement.textContent = quote.text;
    quoteCategoryElement.textContent = `— ${quote.category}`;
}

// Add new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (!text || !category) {
        alert('Please enter both text and category!');
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();

    if (selectedCategory === 'all' || selectedCategory === category) {
        displayQuote(newQuote);
    }
}

// ... (rest of the functions remain the same as in previous implementation)

// Initialize the app
document.addEventListener('DOMContentLoaded', init);