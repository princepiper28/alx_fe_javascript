const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// Load stored quotes from Local Storage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation", timestamp: Date.now() },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success", timestamp: Date.now() },
    { text: "Believe you can and you're halfway there.", category: "Inspiration", timestamp: Date.now() }
];

// Function to save quotes to Local Storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to fetch quotes from the server (mock API)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        // Convert server response to match quote format
        const formattedQuotes = serverQuotes.map(post => ({
            text: post.title,
            category: "General",
            timestamp: Date.now()
        }));

        handleConflicts(formattedQuotes);
        showNotification("✅ Quotes synced with server!"); // NEW: Show sync notification
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Function to post a new quote to the server (mock API)
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(newQuote),
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            showNotification("✅ New quote successfully posted to the server.");
        } else {
            showNotification("❌ Failed to post quote to the server.");
        }
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

// Function to sync quotes with the server periodically
function syncQuotes() {
    fetchQuotesFromServer();
}

// Function to handle conflicts (server data takes precedence)
function handleConflicts(serverQuotes) {
    let updated = false;
    let newQuotes = 0;
    
    serverQuotes.forEach(serverQuote => {
        const existingQuote = quotes.find(q => q.text === serverQuote.text);

        if (!existingQuote) {
            quotes.push(serverQuote);
            updated = true;
            newQuotes++;
        } else if (serverQuote.timestamp > existingQuote.timestamp) {
            Object.assign(existingQuote, serverQuote);
            updated = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        filterQuotes();
        showNotification(`🔄 ${newQuotes} new quotes added from server.`);
    }
}

// Function to show notifications
function showNotification(message) {
    const notificationBox = document.getElementById("notificationBox");
    notificationBox.textContent = message;
    notificationBox.style.display = "block";
    
    setTimeout(() => {
        notificationBox.style.display = "none";
    }, 5000);
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");

    quoteDisplay.innerHTML = `<p>${quotes[randomIndex].text} - <em>${quotes[randomIndex].category}</em></p>`;

    // Save the last viewed quote in Session Storage
    sessionStorage.setItem("lastQuote", JSON.stringify(quotes[randomIndex]));
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory, timestamp: Date.now() };
    
    // Add new quote to the array
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    
    // Post the new quote to the server
    postQuoteToServer(newQuote);

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showNotification("✅ New quote added successfully.");
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    const filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    filteredQuotes.forEach(quote => {
        const p = document.createElement("p");
        p.textContent = `"${quote.text}" - (${quote.category})`;
        quoteDisplay.appendChild(p);
    });
}

// Function to populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(quote => quote.category))];

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes();
    }
}

// Event listener for page load
document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    filterQuotes();
    syncQuotes();

    setInterval(syncQuotes, 30000); // Sync with server every 30 seconds

    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
        document.getElementById("quoteDisplay").innerHTML = `<p>${JSON.parse(lastQuote).text} - <em>${JSON.parse(lastQuote).category}</em></p>`;
    }

    document.getElementById("newQuote")?.addEventListener("click", showRandomQuote);
});
