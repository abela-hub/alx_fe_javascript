let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportQuotesBtn");

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

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}"<br><small>Category: ${quote.category}</small>`;

    // Save last viewed quote in session storage
    saveLastQuote(quote);
}

// Add new quote
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

// Save last viewed quote (session storage)
function saveLastQuote(quote) {
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Export quotes to JSON
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
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);

// Show last viewed quote if available, else random
if (sessionStorage.getItem("lastQuote")) {
    loadLastQuote();
} else {
    showRandomQuote();
}

function loadLastQuote() {
    const last = sessionStorage.getItem("lastQuote");
    if (last) {
        const quote = JSON.parse(last);
        quoteDisplay.innerHTML = `"${quote.text}"<br><small>Category: ${quote.category}</small>`;
    }
}
