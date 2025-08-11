
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const addQuoteForm = document.getElementById("addQuoteForm");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

const SERVER_URL = "https://dummyjson.com/quotes?limit=0";

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    let filtered = quotes;
    if (selectedCategory && selectedCategory !== "All") {
        filtered = quotes.filter(q => q.category === selectedCategory);
    }
    if (filtered.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }
    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Populate categories in filter
function populateCategories() {
    const categories = ["All", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
}

// Add a new quote
function addQuote(text, category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", showRandomQuote);

addQuoteForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById("quoteText").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();
    if (text && category) {
        addQuote(text, category);
        addQuoteForm.reset();
        showRandomQuote();
    }
});

// Export quotes to JSON file
exportBtn.addEventListener("click", () => {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
});

// Import quotes from JSON file
importFile.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
        try {
            const importedQuotes = JSON.parse(evt.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes = importedQuotes;
                saveQuotes();
                populateCategories();
                showRandomQuote();
            }
        } catch (err) {
            console.error("Invalid JSON file", err);
        }
    };
    reader.readAsText(file);
});

// Sync with server (server wins conflicts)
async function syncWithServer() {
    try {
        const res = await fetch(SERVER_URL);
        const data = await res.json();
        const serverQuotes = data.quotes.map(q => ({ text: q.quote, category: q.author }));
        quotes = serverQuotes;
        saveQuotes();
        populateCategories();
        showRandomQuote();
        showNotification("Quotes synced from server!");
    } catch (err) {
        console.error("Sync failed:", err);
    }
}

// Notification
function showNotification(msg) {
    const el = document.createElement("div");
    el.className = "notification";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// Init
populateCategories();
showRandomQuote();
setInterval(syncWithServer, 60000); // every 1 min
