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

      const star = document.createElement("div");
      star.innerHTML = "⭐";
      star.className = "fav-star";
      star.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(game);
      };
      card.appendChild(star);

      
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

// ===== Recently Played =====
function addRecentlyPlayed(game) {
  let recent = JSON.parse(localStorage.getItem("recentGames")) || [];

  recent = recent.filter(g => g.name !== game.name);
  recent.unshift(game);
  recent = recent.slice(0, 6);

  localStorage.setItem("recentGames", JSON.stringify(recent));
}

function loadRecentlyPlayed() {
  const container = document.getElementById("recent-games");
  if (!container) return;

  const recent = JSON.parse(localStorage.getItem("recentGames")) || [];
  recent.forEach(game => {
    const card = createGameCard(game);
    container.appendChild(card);
  });
}

function toggleFavorite(game) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favs.find(g => g.name === game.name)) {
    favs = favs.filter(g => g.name !== game.name);
  } else {
    favs.push(game);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
}
