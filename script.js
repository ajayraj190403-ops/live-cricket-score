// Replace with your actual API URL and Key
const API_URL = 'https://api.example-cricket-data.com/v1/currentMatches'; 
const API_KEY = 'YOUR_FREE_API_KEY_HERE';

const matchesContainer = document.getElementById('matches-container');
const loadingText = document.getElementById('loading');
const refreshBtn = document.getElementById('refresh-btn');

async function fetchLiveScores() {
    // Show loading state
    loadingText.classList.remove('hidden');
    matchesContainer.innerHTML = '';

    try {
        // Fetching data from the API
        const response = await fetch(`${API_URL}?apikey=${API_KEY}`);
        const data = await response.json();

        // Hide loading state
        loadingText.classList.add('hidden');

        // Check if data is valid and contains matches
        if (data && data.data) {
            displayMatches(data.data);
        } else {
            matchesContainer.innerHTML = '<p>No live matches currently available.</p>';
        }

    } catch (error) {
        loadingText.classList.add('hidden');
        matchesContainer.innerHTML = '<p>Error fetching scores. Please try again later.</p>';
        console.error('Error:', error);
    }
}

function displayMatches(matches) {
    matches.forEach(match => {
        // Create a card for each match
        const card = document.createElement('div');
        card.className = 'match-card';

        // Extracting standard data (API structures vary, adjust these keys based on your provider)
        const matchName = match.name || 'Unknown Match';
        const score = match.score || 'Score not available';
        const status = match.status || 'Status unknown';

        // Building the HTML inside the card
        card.innerHTML = `
            <div class="match-title">${matchName}</div>
            <div class="score">${score}</div>
            <div class="status">${status}</div>
        `;

        matchesContainer.appendChild(card);
    });
}

// Event listener for the refresh button
refreshBtn.addEventListener('click', fetchLiveScores);

// Load scores when the page first opens
fetchLiveScores();
