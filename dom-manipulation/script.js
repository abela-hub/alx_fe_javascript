
// === Data & State ===
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
];

let selectedCategory = localStorage.getItem('selectedCategory') || "all";

// === DOM Elements ===
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const exportBtn = document.getElementById("exportQuotesBtn");
const importInput = document.getElementById("importQuotesInput");
const addQuoteForm = document.getElementById("addQuoteForm");

// === Storage Functions ===
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveSelectedCategory() {
    localStorage.setItem('selectedCategory', selectedCategory);
}

// === Category Handling ===
function populateCategories() {
    const categories = ["all", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = categories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");
    categoryFilter.value = selectedCategory;
}

// === Display Functions ===
function displayQuotes() {
    let filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filtered.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
        return;
    }

    quoteDisplay.innerHTML = filtered
        .map(q => `<p>"${q.text}" <em>(${q.category})</em></p>`)
        .join("");
}

function showRandomQuote() {
    let filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filtered.length === 0) {
        quoteDisplay.innerHTML = "No quotes in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}"<br><small>Category: ${quote.category}</small>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function loadLastQuote() {
    const last = sessionStorage.getItem("lastQuote");
    if (last) {
        const quote = JSON.parse(last);
        quoteDisplay.innerHTML = `"${quote.text}"<br><small>Category: ${quote.category}</small>`;
    }
}

// === Actions ===
function addQuote(text, category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    displayQuotes();
}

function filterQuotes() {
    selectedCategory = categoryFilter.value;
    saveSelectedCategory();
    displayQuotes();
}

// === Import/Export ===
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
}

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
                alert("Invalid JSON format.");
            }
        } catch {
            alert("Error parsing JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// === Event Listeners ===
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importInput.addEventListener("change", importFromJsonFile);

addQuoteForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById('quoteText').value.trim();
    const category = document.getElementById('quoteCategory').value.trim();
    if (text && category) {
        addQuote(text, category);
        addQuoteForm.reset();
    }
});

categoryFilter.addEventListener("change", filterQuotes);

// === Init ===
populateCategories();
if (sessionStorage.getItem("lastQuote")) {
    loadLastQuote();
} else {
    displayQuotes();
}
