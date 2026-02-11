// ==============================
// Script.js - Zovi Games
// ==============================

const container = document.getElementById("games-container");

// Load games.json
fetch("./games.json")
  .then(res => {
    if (!res.ok) throw new Error(`Failed to load games.json: ${res.status}`);
    return res.json();
  })
  .then(games => {
    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "game-card";

      // Inner HTML of each card
      card.innerHTML = `
        <img src="${game.thumbnail}" alt="${game.title}">
        <h3>${game.title}</h3>
        <div class="card-actions">
          <a href="game.html?game=${encodeURIComponent(game.file)}" class="play-btn">Play</a>
          <button class="fav-btn">❤</button>
        </div>
      `;

      container.appendChild(card);

      // Favorite button click
      const favBtn = card.querySelector(".fav-btn");
      favBtn.onclick = async () => {
        if (!window.currentUser) {
          alert("Login to save favorites!");
          return;
        }

        try {
          await window.saveFavorite(game.file);
          favBtn.textContent = "❤️"; // Mark as saved
        } catch (err) {
          console.error(err);
        }
      };
    });
  })
  .catch(err => console.error(err));

// ==============================
// Optional: show favorites when user logs in
// ==============================
onAuthStateChanged(auth, async user => {
  if (!user) return;
  const favData = await window.getFavorites();
  
  document.querySelectorAll(".game-card").forEach(card => {
    const playLink = card.querySelector(".play-btn").href;
    const fileName = decodeURIComponent(playLink.split("?game=")[1]);
    if (favData[fileName]) {
      card.querySelector(".fav-btn").textContent = "❤️";
    }
  });
});
