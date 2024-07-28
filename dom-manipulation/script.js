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
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length > 0) {
    // Conflict resolution: Server data takes precedence
    if (JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
      showConflictModal();
    }
  }
}

// Function to show conflict modal
function showConflictModal() {
  document.getElementById('conflictModal').style.display = 'block';
}

// Function to resolve conflict based on user choice
function resolveConflict(choice) {
  if (choice === 'server') {
    // Replace local quotes with server quotes
    fetchQuotesFromServer().then(serverQuotes => {
      localQuotes = serverQuotes;
      saveQuotes();
      populateCategories();
      displayRandomQuote();
      alert('Local data updated with server data.');
    });
  } else {
    // Keep local quotes and possibly notify the server
    alert('Local data kept. Consider syncing manually later.');
  }
  document.getElementById('conflictModal').style.display = 'none';
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

// Function to export quotes as JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(localQuotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        localQuotes.length = 0; // Clear existing quotes
        localQuotes.push(...importedQuotes);
        saveQuotes(); // Update local storage
        populateCategories(); // Update category dropdown
        filterQuotes(); // Apply the current filter
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (e) {
      alert('Failed to parse JSON.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to display a random quote
function displayRandomQuote() {
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  const filteredQuotes = filterQuotesByCategory(selectedCategory);
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" - ${quote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Function to filter quotes by category
function filterQuotesByCategory(category) {
  if (category === 'all') {
    return localQuotes;
  }
  return localQuotes.filter(quote => quote.category === category);
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset categories
  const categories = new Set(localQuotes.map(quote => quote.category));
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
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
setInterval(syncQuotes, 30 * 60 * 1000);
