const API_URL = "https://api.cricapi.com/v1/currentMatches?apikey=4204a63c-8d41-4a07-a1f3-f677158cb628&offset=0";

async function getScores() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();

        if (json.status !== "success") {
            console.error("API Error");
            return;
        }

        const matches = json.data;
        const container = document.getElementById("score-container");
        container.innerHTML = ""; // Clear "Loading" text

        matches.forEach(match => {
            // Create a card for each match
            const matchCard = document.createElement("div");
            matchCard.className = "match-card";

            // Format Score: Handle cases where score might be missing yet
            let scoreHtml = "";
            if (match.score && match.score.length > 0) {
                match.score.forEach(s => {
                    scoreHtml += `<p class="score-line"><strong>${s.inning}:</strong> ${s.r}/${s.w} (${s.o} ov)</p>`;
                });
            } else {
                scoreHtml = `<p class="no-score">Lineups announced / Match starting soon</p>`;
            }

            matchCard.innerHTML = `
                <h3>${match.name}</h3>
                <div class="teams">
                    <span>${match.teams[0]}</span> vs <span>${match.teams[1]}</span>
                </div>
                <div class="score-section">
                    ${scoreHtml}
                </div>
                <p class="status">${match.status}</p>
            `;

            container.appendChild(matchCard);
        });

    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("score-container").innerHTML = "<p>Failed to load scores. Please try again later.</p>";
    }
}

// Initial call
getScores();

// Auto-refresh every 2 minutes (120000ms)
setInterval(getScores, 120000);
