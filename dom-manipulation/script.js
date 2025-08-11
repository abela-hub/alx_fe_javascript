// Initial quotes data
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivational" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Wisdom" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspirational" }
];

// DOM elements
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const categoryButtonsContainer = document.getElementById('categoryButtons');

// Current selected category (null means all categories)
let currentCategory = null;

// Initialize the application
function init() {
    // Display first quote
    showRandomQuote();

    // Create category buttons
    createCategoryButtons();

    // Add event listener for new quote button
    newQuoteButton.addEventListener('click', showRandomQuote);
}

// Display a random quote
function showRandomQuote() {
    let filteredQuotes = quotes;

    // Filter by category if one is selected
    if (currentCategory) {
        filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
    }

    // Check if there are quotes available
    if (filteredQuotes.length === 0) {
        quoteTextElement.textContent = "No quotes available in this category.";
        quoteCategoryElement.textContent = "";
        return;
    }

    // Get random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Update DOM
    quoteTextElement.textContent = randomQuote.text;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;
}

// Create category buttons
function createCategoryButtons() {
    // Clear existing buttons
    categoryButtonsContainer.innerHTML = '';

    // Get all unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];

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

    // Add buttons for each category
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

// Highlight the selected category button
function highlightSelectedButton(selectedButton) {
    const buttons = categoryButtonsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.backgroundColor = button === selectedButton ? '#16a085' : '#2ecc71';
    });
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        // Add new quote to array
        quotes.push({
            text: newQuoteText,
            category: newQuoteCategory
        });

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Recreate category buttons to include new category if needed
        createCategoryButtons();

        // Show the newly added quote
        quoteTextElement.textContent = newQuoteText;
        quoteCategoryElement.textContent = `— ${newQuoteCategory}`;

        // Set current category to the new one
        currentCategory = newQuoteCategory;
        highlightSelectedButton([...categoryButtonsContainer.querySelectorAll('button')].find(
            btn => btn.textContent === newQuoteCategory
        ) || categoryButtonsContainer.querySelector('button'));
    } else {
        alert('Please enter both quote text and category!');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);