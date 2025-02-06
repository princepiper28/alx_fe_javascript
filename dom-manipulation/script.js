document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
        { text: "The only way to do great work is to love what you do.", category: "Motivation" },
        { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
        { text: "Believe you can and you're halfway there.", category: "Confidence" },
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categorySelect = document.getElementById("categorySelect");

    // Create the Add Quote Form Dynamically
    function createAddQuoteForm() {
        const formContainer = document.createElement("div");

        const quoteInput = document.createElement("input");
        quoteInput.setAttribute("id", "newQuoteText");
        quoteInput.setAttribute("type", "text");
        quoteInput.setAttribute("placeholder", "Enter a new quote");

        const categoryInput = document.createElement("input");
        categoryInput.setAttribute("id", "newQuoteCategory");
        categoryInput.setAttribute("type", "text");
        categoryInput.setAttribute("placeholder", "Enter quote category");

        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";
        addButton.addEventListener("click", addQuote);

        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);

        document.body.appendChild(formContainer);
    }

    // Populate category dropdown
    function populateCategories() {
        const categories = [...new Set(quotes.map(q => q.category))];
        categorySelect.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Display a random quote
    function showRandomQuote() {
        const selectedCategory = categorySelect.value;
        let filteredQuotes = quotes;

        if (selectedCategory !== "all") {
            filteredQuotes = quotes.filter(q => q.category === selectedCategory);
        }

        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available in this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
    }

    // Add a new quote
    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });

        // Update categories and display a new quote
        populateCategories();
        showRandomQuote();

        // Clear input fields
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }

    // Event Listeners
    newQuoteButton.addEventListener("click", showRandomQuote);
    categorySelect.addEventListener("change", showRandomQuote);

    // Initialize the application
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();
});
