// ===== Load games from games.json =====
fetch("games.json")
  .then(res => res.json())
  .then(games => {
    const hotContainer = document.getElementById("hot-games");
    const allContainer = document.getElementById("all-games");
    const sidebar = document.getElementById("sidebar-list");

    games.forEach(game => {
      // Create main game card
      const card = document.createElement("a");
      card.href = `game.html?game=${game.file}`;
      card.className = "game-card";
      card.innerHTML = `
        <img src="assets/${game.thumb}" alt="${game.name}">
        <span>${game.name}</span>
      `;

      // Add to ALL games
      allContainer.appendChild(card);

      // Add to HOT games if marked hot
      if (game.hot) {
        hotContainer.appendChild(card.cloneNode(true));
      }

      // Sidebar game list (exclude current game if on game.html)
      if (sidebar) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentGame = urlParams.get("game");
        if (game.file !== currentGame) {
          const li = document.createElement("li");
          li.innerHTML = `
            <a href="game.html?game=${game.file}">
              <img src="assets/${game.thumb}" alt="${game.name}">
              <span>${game.name}</span>
            </a>
          `;
          sidebar.appendChild(li);
        }
      }
    });
  })
  .catch(err => console.error("Failed to load games:", err));


// ===== Fullscreen Button =====
const fullscreenBtn = document.getElementById("fullscreen-btn");
const gameFrame = document.getElementById("game-frame");

if (fullscreenBtn && gameFrame) {
  fullscreenBtn.addEventListener("click", () => {
    if (gameFrame.requestFullscreen) {
      gameFrame.requestFullscreen();
    }
  });
}


// ===== Search Function =====
const searchInput = document.getElementById("search-input");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    const hotGames = document.getElementById("hot-games").children;
    const allGames = document.getElementById("all-games").children;

    function filterGames(games) {
      Array.from(games).forEach(card => {
        const name = card.querySelector("span").textContent.toLowerCase();
        card.style.display = name.includes(query) ? "" : "none";
      });
    }

    filterGames(hotGames);
    filterGames(allGames);

    // Add glow effect to search bar when typing
    if (searchInput.value.trim() !== "") {
      searchInput.classList.add("glow");
    } else {
      searchInput.classList.remove("glow");
    }
  });
}


// ===== Game Page Load (for game.html) =====
const urlParams = new URLSearchParams(window.location.search);
const currentGame = urlParams.get("game");

if (currentGame && gameFrame) {
  gameFrame.src = `games/${currentGame}.html`;
}
