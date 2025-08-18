// server.js (mock server simulation)
const quotes = [
    { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { id: 2, text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { id: 3, text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" }
];

// Simulate server delay
const simulateNetworkDelay = () => new Promise(resolve =>
    setTimeout(resolve, Math.random() * 1000 + 500)
);

export const fetchQuotesFromServer = async () => {
    await simulateNetworkDelay();
    return [...quotes]; // Return a copy
};

export const postQuoteToServer = async (quote) => {
    await simulateNetworkDelay();
    const newId = Math.max(...quotes.map(q => q.id)) + 1;
    const newQuote = { ...quote, id: newId };
    quotes.push(newQuote);
    return newQuote;
};

export const updateQuoteOnServer = async (updatedQuote) => {
    await simulateNetworkDelay();
    const index = quotes.findIndex(q => q.id === updatedQuote.id);
    if (index !== -1) {
        quotes[index] = updatedQuote;
        return true;
    }
    return false;
};