// ===== Fix paths so they always load from root =====
function fixPath(path) {
  if (!path) return "";
  return path.startsWith("/") ? path : "/" + path;
}

// ===== Create Game Card =====
function createGameCard(game) {
  const card = document.createElement("a");
  card.className = "game-card";
  card.href = `game.html?game=${game.file}`;

  card.innerHTML = `
    <img src="${fixPath(game.thumbnail)}" alt="${game.name}">
    <span>${game.name}</span>
  `;

  // NEW badge
  if (game.new) {
    const badge = document.createElement("div");
    badge.className = "new-badge";
    badge.textContent = "NEW";
    card.appendChild(badge);
  }

  // Favorite star
  const star = document.createElement("div");
  star.className = "fav-star";
  star.textContent = "⭐";
  star.onclick = (e) => {
    e.preventDefault();
    toggleFavorite(game);
  };
  card.appendChild(star);

  return card;
}

// ===== Favorites =====
function toggleFavorite(game) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favs.find(g => g.file === game.file)) {
    favs = favs.filter(g => g.file !== game.file);
  } else {
    favs.push(game);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));
  loadFavorites();
}

function loadFavorites() {
  const container = document.getElementById("favorite-games");
  if (!container) return;

  container.innerHTML = "";
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favs.forEach(game => container.appendChild(createGameCard(game)));
}

// ===== Recently Played =====
function addRecentlyPlayed(game) {
  let recent = JSON.parse(localStorage.getItem("recentGames")) || [];

  recent = recent.filter(g => g.file !== game.file);
  recent.unshift(game);
  recent = recent.slice(0, 6);

  localStorage.setItem("recentGames", JSON.stringify(recent));
}

function loadRecentlyPlayed() {
  const container = document.getElementById("recent-games");
  if (!container) return;

  container.innerHTML = "";
  const recent = JSON.parse(localStorage.getItem("recentGames")) || [];
  recent.forEach(game => container.appendChild(createGameCard(game)));
}

// ===== Load games.json =====
let games = [];

fetch('/games.json')
  .then(res => res.json())
  .then(data => {
    games = data;

    // Game counter
    const counter = document.getElementById("game-count");
    if (counter) counter.textContent = games.length;

    // HOT & ALL games
    const hotContainer = document.getElementById("hot-games");
    const allContainer = document.getElementById("all-games");

    if (hotContainer) {
      games.filter(g => g.hot).forEach(game => {
        hotContainer.appendChild(createGameCard(game));
      });
    }

    if (allContainer) {
      games.forEach(game => {
        allContainer.appendChild(createGameCard(game));
      });
    }

    loadFavorites();
    loadRecentlyPlayed();
    setupSearch();
    setupRandomButton();
    loadSidebar();
    loadGamePage();
  });

// ===== Search =====
function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    const cards = document.querySelectorAll(".game-card");

    cards.forEach(card => {
      const name = card.innerText.toLowerCase();
      card.style.display = name.includes(query) ? "flex" : "none";
    });

    input.classList.add("glow");
  });
}

// ===== Random Game =====
function setupRandomButton() {
  const btn = document.getElementById("random-btn");
  if (!btn) return;

  btn.onclick = () => {
    const random = games[Math.floor(Math.random() * games.length)];
    window.location.href = `game.html?game=${random.file}`;
  };
}

// ===== Sidebar (game.html) =====
function loadSidebar() {
  const list = document.getElementById("sidebar-list");
  if (!list) return;

  games.slice(0, 8).forEach(game => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="game.html?game=${game.file}">
        <img src="${fixPath(game.thumbnail)}">
        ${game.name}
      </a>
    `;
    list.appendChild(li);
  });
}

// ===== Game Page Loader =====
function loadGamePage() {
  const frame = document.getElementById("game-frame");
  if (!frame) return;

  const params = new URLSearchParams(window.location.search);
  const gameFile = params.get("game");

  const gameData = games.find(g => g.file === gameFile);
  if (!gameData) return;

  frame.src = fixPath(gameData.path);

  // Add to recently played
  addRecentlyPlayed(gameData);
}

// ===== Auto year update =====
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
