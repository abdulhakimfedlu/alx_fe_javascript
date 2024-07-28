// Initial array of quote objects
const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Innovation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" - ${quote.category}`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      showRandomQuote(); // Optionally show the new quote immediately
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
  
  // Show a random quote when the page loads
  showRandomQuote();
  