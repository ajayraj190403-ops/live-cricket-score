const API_KEY = "4204a63c-8d41-4a07-a1f3-f677158cb628";

// --- 1. DARK MODE LOGIC ---
function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById("theme-toggle");
    
    if (body.getAttribute("data-theme") === "dark") {
        body.removeAttribute("data-theme");
        btn.innerText = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    } else {
        body.setAttribute("data-theme", "dark");
        btn.innerText = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    }
}

// --- 2. LIVE SCORES (cricScore API) ---
async function getLiveScores() {
    const SCORE_URL = `https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}`;
    
    try {
        const response = await fetch(SCORE_URL);
        const json = await response.json();
        if (json.status !== "success") return;

        const container = document.getElementById("score-container");
        container.innerHTML = ""; 

        json.data.forEach(match => {
            const card = document.createElement("div");
            card.className = "match-card";
            card.innerHTML = `
                <h3>${match.t1} vs ${match.t2}</h3>
                <p><strong>${match.ms || 'Previewing...'}</strong></p>
                <button onclick="showDetails('${match.id}')">Match Info</button>
                <p style="font-size: 0.8rem; margin-top:10px; opacity:0.8;">${match.status}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Score Error:", error);
    }
}

// --- 3. PLAYER SEARCH ---
async function searchPlayer() {
    const query = document.getElementById("playerSearch").value;
    const resultDiv = document.getElementById("player-results");
    if (!query) return alert("Enter a name");

    resultDiv.innerHTML = "Searching...";
    try {
        const response = await fetch(`https://api.cricapi.com/v1/players?apikey=${API_KEY}&search=${query}`);
        const json = await response.json();
        resultDiv.innerHTML = "";

        if (json.data && json.data.length > 0) {
            json.data.slice(0, 6).forEach(p => {
                const pCard = document.createElement("div");
                pCard.className = "player-card";
                pCard.innerHTML = `<strong>${p.name}</strong><br><small>${p.country}</small>`;
                resultDiv.appendChild(pCard);
            });
        } else {
            resultDiv.innerHTML = "No players found.";
        }
    } catch (e) { resultDiv.innerHTML = "Error fetching player."; }
}

// --- 4. MATCH DETAILS MODAL ---
async function showDetails(matchId) {
    const modal = document.getElementById("detailsModal");
    const modalBody = document.getElementById("modal-body");
    modal.style.display = "block";
    modalBody.innerHTML = "<h4>Fetching full details...</h4>";

    try {
        const res = await fetch(`https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&id=${matchId}`);
        const json = await res.json();
        const m = json.data;
        
        modalBody.innerHTML = `
            <h2>${m.name}</h2>
            <p><strong>Series:</strong> ${m.series_id || 'International'}</p>
            <p><strong>Venue:</strong> ${m.venue}</p>
            <p><strong>Date:</strong> ${m.date}</p>
            <p><strong>Status:</strong> ${m.status}</p>
            <hr>
            <p><strong>Teams:</strong> ${m.teams ? m.teams.join(" vs ") : 'N/A'}</p>
        `;
    } catch (e) { modalBody.innerHTML = "Failed to load details."; }
}

function closeModal() {
    document.getElementById("detailsModal").style.display = "none";
}

// Close modal on outside click
window.onclick = (e) => { if(e.target.id == 'detailsModal') closeModal(); }

// --- 5. INITIALIZE ---
window.onload = () => {
    // Apply saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.setAttribute("data-theme", "dark");
        document.getElementById("theme-toggle").innerText = "☀️ Light Mode";
    }
    getLiveScores();
    setInterval(getLiveScores, 60000); // Auto-refresh matches every minute
};
