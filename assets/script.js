// ===== Correct path for GitHub Pages repo =====
const basePath = window.location.pathname.split('/')[1]
  ? '/' + window.location.pathname.split('/')[1]
  : '';

function fixPath(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  path = path.replace(/^\/+/, ''); // remove leading slash
  return `${basePath}/${path}`;
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

fetch(`${basePath}/games.json`)
  .then(res => res.json())
  .then(data => {
    games = data.map(g => ({
      ...g,
      category: g.category || autoCategorize(g.name)
    }));

    // Game counter
    const counter = document.getElementById("game-count");
    if (counter) counter.textContent = games.length;

    // Render ALL stuff
    showAll();         // default display
    loadFavorites();
    loadRecentlyPlayed();
    setupSearch();
    setupRandomButton();
    loadSidebar();
    loadGamePage();
  })
  .catch(err => console.error("Failed to load games.json:", err));


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
    showAll();
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

function loadSidebar() {
  const list = document.getElementById("sidebar-list");
  if (!list) return;

  list.innerHTML = "";

  games.slice(0, 8).forEach(game => {
    const li = document.createElement("li");

    li.innerHTML = `
      <a href="/game.html?game=${game.file}">
        <img src="${fixPath(game.thumbnail)}" alt="${game.name}">
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

// ===== Scroll to section =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// ===== Dynamic Display System =====
const display = document.getElementById("game-display");
const title = document.getElementById("section-title");

function renderGames(list) {
  if (!display) return;
  display.innerHTML = "";
  list.forEach(game => display.appendChild(createGameCard(game)));
}

function showAll() {
  title.innerHTML = `ALL GAMES (<span id="game-count">${games.length}</span>)`;
  renderGames(games);
}

function showHot() {
  const hot = games.filter(g => g.hot);
  title.textContent = "🔥 HOT GAMES";
  renderGames(hot);
}

function showRecent() {
  const recent = JSON.parse(localStorage.getItem("recentGames")) || [];
  title.textContent = "🕘 RECENTLY PLAYED";
  renderGames(recent);
}

function showFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  title.textContent = "⭐ FAVORITES";
  renderGames(favs);
}

