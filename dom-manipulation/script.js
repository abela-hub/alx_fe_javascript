// Retrieve quotes from local storage or set defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Show random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;
}

// Create the add quote form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "newQuoteText";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

// Add new quote
function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!newText || !newCategory) {
        alert("Please enter both text and category.");
        return;
    }

    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);

    // Save to localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update the DOM immediately with the new quote
    showRandomQuote();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// Event listener for "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize app
createAddQuoteForm();
showRandomQuote();
