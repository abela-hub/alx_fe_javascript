// Use a self-invoking anonymous function to avoid polluting the global scope.
(function () {
    // Step 1: Initialize the data source
    let quotes = [
        { text: "The only way to do great work is to love what you do.", category: "Inspirational" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Inspirational" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Motivational" },
        { text: "It is during our darkest moments that we must focus to see the light.", category: "Wisdom" },
        { text: "The only thing we have to fear is fear itself.", category: "Historical" }
    ];

    // Step 2: Get DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const messageBox = document.getElementById('messageBox');

    let lastQuoteIndex = -1;

    // Step 3: Implement the core functionality
    /**
     * Displays a random quote in the quoteDisplay area.
     * It ensures the same quote is not shown twice in a row.
     */
    function showRandomQuote() {
        // Handle the case where there are no quotes
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = `
                <p class="text-xl italic text-gray-500">No quotes available. Add a new one below!</p>
            `;
            return;
        }

        let randomIndex;
        // Generate a new random index that is not the same as the last one.
        do {
            randomIndex = Math.floor(Math.random() * quotes.length);
        } while (randomIndex === lastQuoteIndex && quotes.length > 1);

        const quote = quotes[randomIndex];
        lastQuoteIndex = randomIndex;

        // Clear previous content
        quoteDisplay.innerHTML = '';

        // Dynamically create and append new elements for the quote
        const quoteTextElement = document.createElement('p');
        quoteTextElement.className = "text-2xl italic font-medium text-gray-800";
        quoteTextElement.textContent = `"${quote.text}"`;

        const quoteCategoryElement = document.createElement('p');
        quoteCategoryElement.className = "text-lg text-gray-500 mt-4 font-semibold";
        quoteCategoryElement.textContent = `— ${quote.category}`;

        quoteDisplay.appendChild(quoteTextElement);
        quoteDisplay.appendChild(quoteCategoryElement);
    }

    /**
     * Adds a new quote to the quotes array from the input fields.
     * It also updates the DOM and shows a confirmation message.
     */
    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            showMessage("Please fill out both quote text and category.", "bg-red-100 text-red-700");
            return;
        }

        // Create a new quote object and add it to the array
        const newQuote = { text, category };
        quotes.push(newQuote);

        // Clear the input fields
        newQuoteText.value = '';
        newQuoteCategory.value = '';

        // Show a success message
        showMessage("New quote added successfully!", "bg-green-100 text-green-700");

        // If this is the first quote added, display it immediately
        if (quotes.length === 1) {
            showRandomQuote();
        }
    }

    /**
     * Displays a temporary message in the message box.
     * @param {string} message - The message to display.
     * @param {string} className - Tailwind classes for the message box styling.
     */
    function showMessage(message, className) {
        messageBox.textContent = message;
        messageBox.className = `mt-4 p-4 text-center text-sm rounded-lg ${className}`;
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000); // Hide the message after 3 seconds
    }

    // Step 4: Add event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', addQuote);

    // Step 5: Initial setup - show a quote when the page first loads
    document.addEventListener('DOMContentLoaded', showRandomQuote);
})();