// ====== Storage Keys ======
const LOCAL_STORAGE_KEY = "quotes";
const SESSION_STORAGE_KEY = "lastViewedQuote";

// ====== Load Quotes from Local Storage or Defaults ======
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" }
];

// ====== DOM References ======
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ====== Save Quotes to Local Storage ======
function saveQuotes() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// ====== Show Random Quote ======
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.category}</small>`;

    // Save last viewed quote to session storage
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

// ====== Create Add Quote Form ======
function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "newQuoteText";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

// ====== Add New Quote ======
function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!newText || !newCategory) {
        alert("Please enter both text and category.");
        return;
    }

    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();

    // Update the DOM immediately with the new quote
    showRandomQuote();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// ====== Export Quotes to JSON ======
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ====== Import Quotes from JSON File ======
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format");
            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
        } catch (error) {
            alert("Error importing file: " + error.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// ====== Create Import/Export UI ======
function createImportExportButtons() {
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Export Quotes";
    exportBtn.addEventListener("click", exportToJsonFile);

    const importInput = document.createElement("input");
    importInput.type = "file";
    importInput.accept = ".json";
    importInput.addEventListener("change", importFromJsonFile);

    document.body.appendChild(exportBtn);
    document.body.appendChild(importInput);
}

// ====== Event Listeners ======
newQuoteBtn.addEventListener("click", showRandomQuote);

// ====== Initialize ======
createAddQuoteForm();
createImportExportButtons();

// If there's a last viewed quote in session storage, show it; otherwise show a random one
const lastViewedQuote = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
if (lastViewedQuote) {
    quoteDisplay.innerHTML = `<p>"${lastViewedQuote.text}"</p><small>- ${lastViewedQuote.category}</small>`;
} else {
    showRandomQuote();
}
