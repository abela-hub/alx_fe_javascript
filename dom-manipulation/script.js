// Initial quotes array
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const quoteTextInput = document.getElementById("newQuoteText");
const quoteCategoryInput = document.getElementById("newQuoteCategory");

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear old content and create new DOM structure
    quoteDisplay.innerHTML = "";

    const quoteElem = document.createElement("p");
    quoteElem.textContent = `"${quote.text}"`;

    const categoryElem = document.createElement("small");
    categoryElem.style.display = "block";
    categoryElem.style.marginTop = "5px";
    categoryElem.style.fontStyle = "italic";
    categoryElem.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteElem);
    quoteDisplay.appendChild(categoryElem);
}

// Add a new quote
function addQuote() {
    const text = quoteTextInput.value.trim();
    const category = quoteCategoryInput.value.trim();

    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text, category });

    // Clear form fields
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";

    alert("New quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Show a quote on first load
showRandomQuote();
