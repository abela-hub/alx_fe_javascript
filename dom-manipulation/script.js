// Constants
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API
const SYNC_INTERVAL = 30000; // 30 seconds

// Initial quotes array
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Perseverance" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const addQuoteForm = document.getElementById('addQuoteForm');
const filterContainer = document.getElementById('filterContainer');
const exportImportContainer = document.getElementById('exportImportContainer');
const lastSyncElement = document.getElementById('lastSync');
const manualSyncBtn = document.getElementById('manualSync');

// Initialize the app
function init() {
    loadQuotes();
    setupEventListeners();
    addCategoryFilter();
    addExportImportButtons();

    // Load initial data from server
    fetchQuotesFromServer();

    // Set up periodic sync
    setInterval(syncWithServer, SYNC_INTERVAL);

    // Show a quote (random or based on last filter)
    const lastFilter = localStorage.getItem('lastFilter') || 'all';
    showQuote(lastFilter);

    // Update last sync time
    updateLastSyncTime();
}

function setupEventListeners() {
    newQuoteBtn.addEventListener('click', showRandomQuote);
    showAddFormBtn.addEventListener('click', toggleAddForm);
    manualSyncBtn.addEventListener('click', syncWithServer);
}

// Load quotes from local storage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
    const filterSelect = document.getElementById('categoryFilter');
    const selectedCategory = filterSelect ? filterSelect.value : 'all';
    showQuote(selectedCategory);
}

// Toggle the add quote form visibility
function toggleAddForm() {
    addQuoteForm.style.display = addQuoteForm.style.display === 'none' ? 'block' : 'none';
}

// Add a new quote
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();

        // Update categories dropdown
        const filterSelect = document.getElementById('categoryFilter');
        populateCategories(filterSelect);

        textInput.value = '';
        categoryInput.value = '';
        showQuote();
        toggleAddForm();
    } else {
        alert('Please enter both quote text and category');
    }
}

// Add category filter dropdown
function addCategoryFilter() {
    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Filter by category: ';
    filterLabel.htmlFor = 'categoryFilter';

    const filterSelect = document.createElement('select');
    filterSelect.id = 'categoryFilter';
    filterSelect.onchange = filterQuotes;

    // Add 'All' option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    filterSelect.appendChild(allOption);

    // Add category options
    populateCategories(filterSelect);

    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(filterSelect);
}

// Populate categories in the filter dropdown
function populateCategories(selectElement) {
    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options (except 'All')
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }

    // Add new category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        selectElement.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const filterSelect = document.getElementById('categoryFilter');
    const selectedCategory = filterSelect.value;

    // Save the selected filter
    localStorage.setItem('lastFilter', selectedCategory);

    showQuote(selectedCategory);
}

// Show a quote (random or filtered)
function showQuote(categoryFilter = 'all') {
    let filteredQuotes = quotes;

    if (categoryFilter !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === categoryFilter);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes available${categoryFilter !== 'all' ? ' for this category' : ''
            }. Please add some quotes.</p>`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `
    <div class="quote-text">"${quote.text}"</div>
    <div class="quote-category">— ${quote.category}</div>
  `;
}

// Add export and import buttons
function addExportImportButtons() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Quotes';
    exportBtn.onclick = exportQuotes;

    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import Quotes';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'importFile';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.onchange = importFromJsonFile;

    importBtn.onclick = () => fileInput.click();

    exportImportContainer.appendChild(exportBtn);
    exportImportContainer.appendChild(importBtn);
    exportImportContainer.appendChild(fileInput);
}

// Export quotes to JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes = importedQuotes;
                saveQuotes();

                // Update UI
                const filterSelect = document.getElementById('categoryFilter');
                populateCategories(filterSelect);
                showQuote();

                showNotification('Quotes imported successfully!');
            } else {
                alert('Invalid format: Expected an array of quotes');
            }
        } catch (e) {
            alert('Error parsing JSON file: ' + e.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simulate fetching quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverData = await response.json();

        // Transform mock data to our quote format
        const serverQuotes = serverData.slice(0, 5).map(post => ({
            text: post.title,
            category: 'Server'
        }));

        // Merge with local quotes
        mergeQuotes(serverQuotes);
        updateLastSyncTime();
    } catch (error) {
        console.error('Failed to fetch quotes from server:', error);
    }
}

// Simulate syncing with server
async function syncWithServer() {
    try {
        const response = await fetch(API_URL);
        const serverData = await response.json();

        // Get some new mock data
        const newServerQuotes = serverData.slice(5, 10).map(post => ({
            text: post.title,
            category: 'Server'
        }));

        // Merge with local quotes
        mergeQuotes(newServerQuotes);
        updateLastSyncTime();

        // Show notification
        showNotification('Quotes updated from server');
    } catch (error) {
        console.error('Sync failed:', error);
        showNotification('Sync failed', true);
    }
}

// Merge server quotes with local quotes
function mergeQuotes(newQuotes) {
    let hasUpdates = false;

    newQuotes.forEach(newQuote => {
        // Simple conflict resolution: server data overwrites local if text matches
        const existingIndex = quotes.findIndex(q => q.text === newQuote.text);

        if (existingIndex === -1) {
            // New quote - add it
            quotes.push(newQuote);
            hasUpdates = true;
        } else if (JSON.stringify(quotes[existingIndex]) !== JSON.stringify(newQuote)) {
            // Conflict - server version wins
            quotes[existingIndex] = newQuote;
            hasUpdates = true;
        }
    });

    if (hasUpdates) {
        saveQuotes();
        const filterSelect = document.getElementById('categoryFilter');
        if (filterSelect) populateCategories(filterSelect);
        showQuote(document.getElementById('categoryFilter').value);
    }
}

// Show notification
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    if (isError) {
        notification.style.backgroundColor = '#f44336';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Update last sync time display
function updateLastSyncTime() {
    const now = new Date();
    lastSyncElement.textContent = now.toLocaleTimeString();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);