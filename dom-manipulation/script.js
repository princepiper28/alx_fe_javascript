 // Quote array with categories
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" }
];

// Function to show a random quote
function showRandomQuote() {
    const selectedCategory = document.getElementById("categorySelect").value;
    
    let filteredQuotes = quotes;
    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").textContent = "No quotes available in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").textContent = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
}

// Function to add a new quote dynamically
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!quoteText || !quoteCategory) {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Add the new quote to the array
    quotes.push({ text: quoteText, category: quoteCategory });

    // Update the category dropdown
    updateCategoryDropdown(quoteCategory);

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

// Function to update the category dropdown dynamically
function updateCategoryDropdown(newCategory) {
    const categorySelect = document.getElementById("categorySelect");
    
    // Check if the category already exists in the dropdown
    if (![...categorySelect.options].some(option => option.value.toLowerCase() === newCategory.toLowerCase())) {
        let newOption = document.createElement("option");
        newOption.value = newCategory;
        newOption.textContent = newCategory;
        categorySelect.appendChild(newOption);
    }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);

