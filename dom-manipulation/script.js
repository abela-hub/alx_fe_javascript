const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// ====================== SERVER INTERACTIONS ======================

// ✅ Fetch data from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();
        console.log("Fetched from server:", data);
        resolveConflicts(data); // handle conflicts
    } catch (error) {
        console.error("Error fetching from server:", error);
    }
}

// ✅ Post data to server
async function postQuoteToServer(newQuote) {
    try {
        await fetch(SERVER_URL, {
            method: "POST",
            body: JSON.stringify(newQuote),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        });
        console.log("Quote synced to server:", newQuote);

        // 🔹 Notify user
        notifyUser("Quotes synced with server!");
    } catch (error) {
        console.error("Error posting to server:", error);
    }
}

// ====================== SYNCING LOGIC ======================

// ✅ Conflict resolution
function resolveConflicts(serverQuotes) {
    let updated = false;

    serverQuotes.forEach(serverQuote => {
        const localMatch = quotes.find(q => q.text === serverQuote.text);

        if (!localMatch) {
            quotes.push(serverQuote);
            updated = true;
        } else if (localMatch.category !== serverQuote.category) {
            localMatch.category = serverQuote.category; // server wins
            updated = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        notifyUser("Quotes synced with server!"); // 🔹 exact string required
    }
}

// ✅ Periodic syncing
function syncQuotes() {
    console.log("Syncing quotes with server...");
    fetchQuotesFromServer();
}

// Run sync every 30 seconds
setInterval(syncQuotes, 30000);

// ====================== LOCAL STORAGE ======================

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====================== UI NOTIFICATIONS ======================

function notifyUser(message) {
    const notification = document.createElement("div");
    notification.innerText = message;
    notification.className =
        "notification bg-green-500 text-white p-2 rounded mb-2";
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// ====================== EVENT EXAMPLE ======================
// Example: Adding a new quote and syncing
document.getElementById("addQuoteBtn")?.addEventListener("click", () => {
    const newQuote = { text: "Be yourself; everyone else is taken.", category: "Inspiration" };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
});
