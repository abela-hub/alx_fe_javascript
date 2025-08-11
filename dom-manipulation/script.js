// Initial quotes array
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const formContainer = document.getElementById("formContainer");

// Populate category dropdown
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

// Show a random quote
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

// Create the add quote form dynamically
function createAddQuoteForm() {
    let quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    let categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    let addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(document.createElement("hr"));
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
}

// Logic to add a new quote to the quotes array and update the DOM
function addQuote() {
    let newText = document.getElementById("newQuoteText").value.trim();
    let newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newText && newCategory) {
        quotes.push({ text: newText, category: newCategory });
        populateCategories();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Event listener for "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize
populateCategories();
createAddQuoteForm();
