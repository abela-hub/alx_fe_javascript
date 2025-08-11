// ===== STORAGE HANDLING =====

// Load quotes from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== DOM REFERENCES =====
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const formContainer = document.getElementById("formContainer");
const exportBtn = document.getElementById("exportQuotes");
const importInput = document.getElementById("importFile");

// ===== POPULATE CATEGORY DROPDOWN =====
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

// ===== SHOW RANDOM QUOTE =====
function showRandomQuote() {
    let selectedCategory = categoryFilter.value;
    let filteredQuotes = quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        let randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.textContent = randomQuote.text;

        // Save last viewed quote in sessionStorage
        sessionStorage.setItem("lastViewedQuote", randomQuote.text);
    } else {
        quoteDisplay.textContent = "No quotes available in this category.";
    }
}

// ===== CREATE ADD QUOTE FORM =====
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

// ===== ADD QUOTE =====
function addQuote() {
    let newText = document.getElementById("newQuoteText").value.trim();
    let newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newText && newCategory) {
        quotes.push({ text: newText, category: newCategory });
        saveQuotes();
        populateCategories();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// ===== EXPORT QUOTES TO JSON FILE =====
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== IMPORT QUOTES FROM JSON FILE =====
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid file format.");
            }
        } catch (err) {
            alert("Error reading file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// ===== EVENT LISTENERS =====
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importInput.addEventListener("change", importFromJsonFile);

// ===== INIT =====
populateCategories();
createAddQuoteForm();

// Show last viewed quote if available (sessionStorage)
let lastQuote = sessionStorage.getItem("lastViewedQuote");
if (lastQuote) {
    quoteDisplay.textContent = lastQuote;
}
