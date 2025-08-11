// Initial quotes
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Populate categories in dropdown
function populateCategories() {
    categoryFilter.innerHTML = "";
    let categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}
populateCategories();

// Show random quote
function showRandomQuote() {
    let selectedCategory = categoryFilter.value;
    let filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = filteredQuotes[randomIndex].text;
    } else {
        quoteDisplay.textContent = "No quotes available in this category.";
    }
}

// Add new quote
function addQuote() {
    let newText = document.getElementById("newQuoteText").value.trim();
    let newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newText && newCategory) {
        quotes.push({ text: newText, category: newCategory });
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        populateCategories();
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
