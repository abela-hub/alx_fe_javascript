// Initial quotes data
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "work" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "In the middle of difficulty lies opportunity.", category: "inspiration" },
    { text: "Simplicity is the ultimate sophistication.", category: "design" },
    { text: "The best way to predict the future is to invent it.", category: "technology" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categorySelect = document.getElementById('categorySelect');

// Initialize the app
function init() {
    // Set up event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', addQuote);

    // Populate category filter
    updateCategoryFilter();

    // Show initial random quote
    showRandomQuote();
}

// Display a random quote
function showRandomQuote() {
    let filteredQuotes = quotes;
    const selectedCategory = categorySelect.value;

    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes found in this category. Try adding some!</p>';
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `
        <blockquote>"${quote.text}"</blockquote>
        <div class="quote-meta">Category: ${quote.category}</div>
    `;
}

// Add a new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
        alert('Please enter both quote text and category');
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);

    // Clear the form
    newQuoteText.value = '';
    newQuoteCategory.value = '';

    // Update the UI
    updateCategoryFilter();
    showRandomQuote();

    // Notify user
    alert('Quote added successfully!');
}

// Update the category filter dropdown
function updateCategoryFilter() {
    // Get all unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];

    // Save the current selection
    const currentSelection = categorySelect.value;

    // Clear existing options (except "All Categories")
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }

    // Add new category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Restore selection if it still exists
    if (categories.includes(currentSelection)) {
        categorySelect.value = currentSelection;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);