// Initial quotes data
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivational" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
];

// DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryButtonsContainer = document.getElementById('categoryButtons');

// Current selected category
let currentCategory = null;

// Initialize the application
function init() {
    showRandomQuote();
    createCategoryButtons();

    // Explicit event listener for "Show New Quote" button
    newQuoteButton.addEventListener('click', function () {
        showRandomQuote();
    });
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
        button.style.backgroundColor = button === selectedButton ? '#16a085' : '#2ecc71';
    });
}

// Function to add new quote (equivalent to createAddQuoteForm functionality)
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

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', init);