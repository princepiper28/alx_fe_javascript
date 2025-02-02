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

// Function to sync quotes with the server
async function syncQuotes() {
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
    } catch (error) {
        console.error("Error syncing quotes with server:", error);
    }
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

    // Add new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory, timestamp: Date.now() });
    saveQuotes();
    populateCategories();
    filterQuotes();

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

// Function to export quotes as a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                filterQuotes();
                showNotification("✅ Quotes imported successfully!");
            } else {
                alert("Invalid file format. Please upload a valid JSON file.");
            }
        } catch (error) {
            alert("Error reading the file. Please upload a valid JSON file.");
        }
    };
    reader.readAsText(file);
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
    document.getElementById("exportQuotes")?.addEventListener("click", exportToJsonFile);
});
