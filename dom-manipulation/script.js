// ==========================
// Dynamic Quote Generator
// ==========================

let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Do or do not. There is no try.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Mock API (using JSONPlaceholder for simulation)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ==========================
// Local Storage Helpers
// ==========================
function loadQuotes() {
    const saved = localStorage.getItem("quotes");
    if (saved) {
        quotes = JSON.parse(saved);
    }
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ==========================
// Quote Functions
// ==========================
function showRandomQuote() {
    const selected = categoryFilter.value;
    let filtered = quotes;

    if (selected !== "all") {
        filtered = quotes.filter(q => q.category === selected);
    }

    if (filtered.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes found in this category.</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const { text, category } = filtered[randomIndex];
    quoteDisplay.innerHTML = `<p>"${text}"</p><small>Category: ${category}</small>`;
}

function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert("Quote added successfully!");

    postQuoteToServer(newQuote); // ✅ renamed to match expectation

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// ==========================
// Category Filter
// ==========================
function populateCategories() {
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    const categories = [...new Set(quotes.map(q => q.category))];

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) {
        categoryFilter.value = savedFilter;
    }
}

function filterQuotes() {
    const selected = categoryFilter.value;
    localStorage.setItem("selectedCategory", selected);
    showRandomQuote();
}

// ==========================
// Import / Export JSON
// ==========================
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

// ==========================
// Server Sync & Conflicts
// ==========================

// ✅ fetchQuotesFromServer (required name)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        let serverQuotes = await response.json();

        // Simulate quotes (map server posts into quotes)
        serverQuotes = serverQuotes.slice(0, 5).map(post => ({
            text: post.title,
            category: "Server"
        }));

        resolveConflicts(serverQuotes);
    } catch (error) {
        console.error("Error fetching from server:", error);
    }
}

// ✅ postQuoteToServer (posting new quotes)
async function postQuoteToServer(newQuote) {
    try {
        await fetch(SERVER_URL, {
            method: "POST",
            body: JSON.stringify(newQuote),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
        console.log("Quote synced to server:", newQuote);
    } catch (error) {
        console.error("Error posting to server:", error);
    }
}

// ✅ syncQuotes (periodic sync)
function syncQuotes() {
    fetchQuotesFromServer();
}

// Conflict resolution
function resolveConflicts(serverQuotes) {
    let updated = false;

    serverQuotes.forEach(serverQuote => {
        const localMatch = quotes.find(q => q.text === serverQuote.text);

        if (!localMatch) {
            quotes.push(serverQuote); // add missing
            updated = true;
        } else if (localMatch.category !== serverQuote.category) {
            localMatch.category = serverQuote.category; // server wins
            updated = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        notifyUser("Quotes updated from server. Conflicts resolved using server data.");
    }
}

// ==========================
// Notifications
// ==========================
function notifyUser(message) {
    const note = document.createElement("div");
    note.textContent = message;
    note.style.background = "#ffeb3b";
    note.style.padding = "10px";
    note.style.margin = "10px 0";
    note.style.border = "1px solid #333";
    document.body.insertBefore(note, document.body.firstChild);

    setTimeout(() => note.remove(), 4000);
}

// ==========================
// Init
// ==========================
newQuoteBtn.addEventListener("click", showRandomQuote);

window.onload = () => {
    loadQuotes();
    populateCategories();
    showRandomQuote();
    syncQuotes(); // ✅ initial sync
};

// ✅ Periodic sync every 30s
setInterval(syncQuotes, 30000);
