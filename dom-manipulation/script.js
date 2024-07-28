// Initial array of quote objects
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Innovation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
];

// Function to display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" - ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText === '' || quoteCategory === '') {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Optionally display the new quote immediately
  displayRandomQuote();
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Display a random quote when the page loads
displayRandomQuote();