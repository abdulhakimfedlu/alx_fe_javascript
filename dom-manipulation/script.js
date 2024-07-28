const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock URL for demo purposes
let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch quotes from the server.');
    const serverQuotes = await response.json();
    return serverQuotes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to post quotes to the server
async function postQuotesToServer(quotes) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotes),
    });
    if (!response.ok) throw new Error('Failed to post quotes to the server.');
  } catch (error) {
    console.error(error);
  }
}

// Function to synchronize local quotes with the server
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length > 0) {
    // Conflict resolution: Server data takes precedence
    localQuotes = serverQuotes;
    saveQuotes(); // Save server data to local storage
    populateCategories(); // Update categories in dropdown
    displayRandomQuote(); // Display a random quote based on updated data
    alert('Data has been synchronized with the server.');
  }
}

// Function to handle adding new quotes
async function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText === '' || quoteCategory === '') {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  localQuotes.push(newQuote);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  saveQuotes(); // Save to local storage
  await postQuotesToServer([newQuote]); // Post new quote to server
  populateCategories(); // Update categories in dropdown
  filterQuotes(); // Apply the current filter
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(localQuotes));
}

// Function to handle category filtering
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  displayRandomQuote();
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportButton').addEventListener('click', exportToJson);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Populate categories and apply last selected filter on page load
populateCategories();
filterQuotes();

// Periodic sync with server every 30 minutes
setInterval(syncWithServer, 30 * 60 * 1000);
