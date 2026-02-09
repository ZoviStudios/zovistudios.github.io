// ===== Base Path for GitHub Pages =====
const basePath = window.location.pathname.split('/')[1]
  ? '/' + window.location.pathname.split('/')[1]
  : '';

// ===== Fix paths for images and game links =====
function fixPath(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  path = path.replace(/^\/+/, '');
  return `${basePath}/${path}`;
}

// ===== Auto Category AI =====
function autoCategorize(gameName) {
  const name = gameName.toLowerCase();
  if (name.includes("race") || name.includes("car") || name.includes("drive"))
    return "Racing";
  if (name.includes("shoot") || name.includes("gun") || name.includes("war") || name.includes("sniper"))
    return "Shooting";
  if (name.includes("puzzle") || name.includes("2048") || name.includes("match") || name.includes("block"))
    return "Puzzle";
  if (name.includes("jump") || name.includes("run") || name.includes("slope") || name.includes("parkour"))
    return "Skill";
  if (name.includes("fight") || name.includes("battle") || name.includes("stickman"))
    return "Action";
  return "Action";
}

// ===== Create Game Card =====
function createGameCard(game) {
  const card = document.createElement("a");
  card.className = "game-card";
  card.href = fixPath(`game.html?game=${game.file}`);


  card.innerHTML = `
    <img src="${fixPath(game.thumbnail)}" alt="${game.name}">
    <span>${game.name}</span>
  `;

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
  showFavorites();
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

// ===== Display system =====
const display = document.getElementById("game-display");
const title = document.getElementById("section-title");

function renderGames(list) {
  if (!display) return;
  display.innerHTML = "";
  list.forEach(game => display.appendChild(createGameCard(game)));
}

function showAll() {
  if (!title) return;
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

// ===== Search =====
function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    const cards = display.querySelectorAll(".game-card");
    cards.forEach(card => {
      const name = card.innerText.toLowerCase();
      card.style.display = name.includes(query) ? "flex" : "none";
    });
  });
}

// ===== Random game =====
function setupRandomButton() {
  const btn = document.getElementById("random-btn");
  if (!btn) return;
  btn.onclick = () => {
    const random = games[Math.floor(Math.random() * games.length)];
    window.location.href = fixPath(`games/${random.file}.html`);
  };
}

// ===== Sidebar for game.html =====
function loadSidebar() {
  const list = document.getElementById("sidebar-list");
  if (!list) return;
  list.innerHTML = "";
  games.slice(0, 8).forEach(game => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${fixPath(`games/${game.file}.html`)}">
        <img src="${fixPath(game.thumbnail)}" alt="${game.name}">
        ${game.name}
      </a>
    `;
    list.appendChild(li);
  });
}

// ===== Load games.json =====
let games = [];
fetch('games.json')

  .then(res => res.json())
  .then(data => {
    games = data.map(g => ({
      ...g,
      category: g.category || autoCategorize(g.name)
    }));

    // Render default view
    showAll();
    loadFavorites();
    loadRecentlyPlayed();
    setupSearch();
    setupRandomButton();
    loadSidebar();
  })
  .catch(err => console.error("Failed to load games.json:", err));

// ===== Auto year in footer =====
const yearSpan = document.getElementById("current-year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
