let quotes = [];
const quotesKey = "quotesData";
const categoryKey = "selectedCategory";

// Load quotes from localStorage on page load
window.onload = function () {
    const storedQuotes = localStorage.getItem(quotesKey);
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    populateCategories();
    restoreSelectedCategory();
    displayQuotes();
};

// Add a new quote
function addQuote() {
    const textInput = document.getElementById("quoteText");
    const categoryInput = document.getElementById("quoteCategory");

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();

    textInput.value = "";
    categoryInput.value = "";
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem(quotesKey, JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];

    // Clear existing categories except "All"
    categorySelect.innerHTML = `<option value="all">All Categories</option>`;

    uniqueCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// Filter quotes based on category
function filterQuotes() {
    const categorySelect = document.getElementById("categoryFilter");
    const selected = categorySelect.value;

    // Save selected category to localStorage
    localStorage.setItem(categoryKey, selected);

    if (selected === "all") {
        displayQuotes(quotes);
    } else {
        const filtered = quotes.filter(q => q.category === selected);
        displayQuotes(filtered);
    }
}

// Display quotes in the DOM
function displayQuotes(filteredQuotes = quotes) {
    const quotesContainer = document.getElementById("quotes");
    quotesContainer.innerHTML = "";

    if (filteredQuotes.length === 0) {
        quotesContainer.innerHTML = "<p>No quotes found.</p>";
        return;
    }

    filteredQuotes.forEach(q => {
        const div = document.createElement("div");
        div.className = "quote";
        div.innerHTML = `<p>${q.text}</p><p class="quote-category">Category: ${q.category}</p>`;
        quotesContainer.appendChild(div);
    });
}

// Restore selected category from localStorage
function restoreSelectedCategory() {
    const savedCategory = localStorage.getItem(categoryKey);
    if (savedCategory) {
        const categorySelect = document.getElementById("categoryFilter");
        categorySelect.value = savedCategory;
        filterQuotes();
    } else {
        displayQuotes();
    }
}

// Export quotes to JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();

    URL.revokeObjectURL(url);
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
                populateCategories();
                filterQuotes();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Error parsing JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simulated server sync with conflict resolution
function syncWithServer() {
    // Simulate fetching data from server
    const serverQuotes = [
        { text: "Server Quote 1", category: "Motivation" },
        { text: "Server Quote 2", category: "Life" }
    ];

    // Merge with conflict resolution (avoid duplicates by text)
    const merged = [...quotes];
    serverQuotes.forEach(serverQuote => {
        if (!merged.some(localQuote => localQuote.text === serverQuote.text)) {
            merged.push(serverQuote);
        }
    });

    quotes = merged;
    saveQuotes();
    populateCategories();
    filterQuotes();

    alert("Sync complete! Quotes merged with server data.");
}
