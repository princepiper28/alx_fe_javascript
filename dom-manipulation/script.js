// Load stored quotes from Local Storage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" }
];

// Function to save quotes to Local Storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate categories dynamically in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset categories

    const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category from Local Storage
    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes(); // Apply the filter on page load
    }
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
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save updated quotes to Local Storage

    populateCategories(); // Update categories dynamically
    filterQuotes(); // Refresh displayed quotes

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory); // Save selected category

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear existing quotes

    const filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    filteredQuotes.forEach(quote => {
        const p = document.createElement("p");
        p.textContent = `"${quote.text}" - (${quote.category})`;
        quoteDisplay.appendChild(p);
    });
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
                alert("Quotes imported successfully!");

                populateCategories(); // Update categories after import
                filterQuotes(); // Refresh displayed quotes
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
    loadQuotes();
    populateCategories(); // Populate category dropdown
    filterQuotes(); // Apply last selected category filter

    // Restore the last viewed quote from Session Storage
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
        document.getElementById("quoteDisplay").innerHTML = `<p>${JSON.parse(lastQuote).text} - <em>${JSON.parse(lastQuote).category}</em></p>`;
    }

    // Ensure buttons exist before adding event listeners
    const newQuoteBtn = document.getElementById("newQuote");
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener("click", showRandomQuote);
    }

    const exportQuotesBtn = document.getElementById("exportQuotes");
    if (exportQuotesBtn) {
        exportQuotesBtn.addEventListener("click", exportToJsonFile);
    }
});
