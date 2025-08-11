let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
];

let lastCategory = localStorage.getItem('lastCategory') || "all";
const quoteDisplay = document.getElementById("quoteDisplay");

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories in dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        if (cat === lastCategory) option.selected = true;
        categoryFilter.appendChild(option);
    });
}

// Show a random quote based on filter
function showNewQuote() {
    const category = document.getElementById('categoryFilter').value;
    let filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes in this category.";
        return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `"${randomQuote.text}"<br><small>Category: ${randomQuote.category}</small>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Load last viewed quote
function loadLastQuote() {
    const last = sessionStorage.getItem("lastQuote");
    if (last) {
        const quote = JSON.parse(last);
        quoteDisplay.innerHTML = `"${quote.text}"<br><small>Category: ${quote.category}</small>`;
    } else {
        showNewQuote();
    }
}

// Add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();

    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
    alert("Quote added successfully!");
}

// Filter quotes and save last selected category
function filterQuotes() {
    const category = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastCategory', category);
    showNewQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
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
            if (!Array.isArray(importedQuotes)) throw new Error();
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert('Quotes imported successfully!');
        } catch {
            alert('Invalid JSON file format.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById('newQuoteBtn').addEventListener('click', showNewQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('exportQuotesBtn').addEventListener('click', exportToJsonFile);
document.getElementById('importQuotesInput').addEventListener('change', importFromJsonFile);

// Initialize app
populateCategories();
loadLastQuote();
