let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportQuotesBtn");
const importInput = document.getElementById("importQuotesInput");

// Load quotes from local storage at start
loadQuotes();
if (quotes.length === 0) {
    quotes = [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
        { text: "Success is not final, failure is not fatal.", category: "Success" }
    ];
    saveQuotes();
}

// Create form for adding quotes dynamically
function createAddQuoteForm() {
    const formContainer = document.getElementById("addQuoteFormContainer");

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "newQuoteText";
    textInput.placeholder = "Enter new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter category";

    const addBtn = document.createElement("button");
    addBtn.id = "addQuoteBtn";
    addBtn.textContent = "Add Quote";

    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addBtn);

    addBtn.addEventListener("click", addQuote);
}

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}"<br><small>Category: ${quote.category}</small>`;
    saveLastQuote(quote);
}

// Add a new quote
function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
}

// Save to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save last viewed quote
function saveLastQuote(quote) {
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Load last viewed quote
function loadLastQuote() {
    const last = sessionStorage.getItem("lastQuote");
    if (last) {
        const quote = JSON.parse(last);
        quoteDisplay.innerHTML = `"${quote.text}"<br><small>Category: ${quote.category}</small>`;
    }
}

// Export quotes to JSON file
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

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
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

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importInput.addEventListener("change", importFromJsonFile);

// Initialize
createAddQuoteForm();
if (sessionStorage.getItem("lastQuote")) {
    loadLastQuote();
} else {
    showRandomQuote();
}
