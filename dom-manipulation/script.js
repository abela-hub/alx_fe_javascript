let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal.", category: "Success" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Show random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = "";

    const quoteElem = document.createElement("p");
    quoteElem.textContent = `"${quote.text}"`;

    const categoryElem = document.createElement("small");
    categoryElem.textContent = `Category: ${quote.category}`;
    categoryElem.style.display = "block";
    categoryElem.style.marginTop = "5px";
    categoryElem.style.fontStyle = "italic";

    quoteDisplay.appendChild(quoteElem);
    quoteDisplay.appendChild(categoryElem);
}

// Dynamically create the "Add Quote" form
function createAddQuoteForm() {
    const formDiv = document.createElement("div");

    const textInput = document.createElement("input");
    textInput.id = "newQuoteText";
    textInput.type = "text";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Quote";
    addBtn.addEventListener("click", addQuote);

    formDiv.appendChild(textInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addBtn);

    document.body.appendChild(formDiv);
}

// Add new quote to array & update DOM
function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text, category });

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote(); // Immediately display the new quote
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize
showRandomQuote();
createAddQuoteForm();
