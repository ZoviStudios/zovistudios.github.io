document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // SAFE ELEMENT CHECK HELPER
  // ===============================
  function exists(id) {
    return document.getElementById(id) !== null;
  }

  // ===============================
  // SINGLE GAME LOADER (game.html)
  // ===============================
  const urlParams = new URLSearchParams(window.location.search);
  const selectedGame = urlParams.get("game");

  if (selectedGame) {
    fetch("games.json")
      .then(res => res.json())
      .then(games => {

        const game = games.find(g => g.file === selectedGame);

        if (!game) {
          document.body.innerHTML = "<h1>Game not found</h1>";
          return;
        }

        // Set browser tab title
        document.title = game.name + " 🕹️ Play Now | Zovi Games";

        // Set visible title
        const titleEl = document.getElementById("game-title");
        if (titleEl) titleEl.textContent = game.name;

        // Set iframe source
        const frame = document.getElementById("game-frame");
        if (frame) {
          frame.src = `https://ozgames.io/${game.file}.embed`;
        }

      })
      .catch(err => console.error("Failed to load games.json:", err));
  }

  // ===============================
  // GAME GRID LOADER (index.html)
  // ===============================
  const container = document.getElementById("games-container");

  if (container) {
    fetch("games.json")
      .then(res => res.json())
      .then(games => {

        games.forEach(game => {

          const card = document.createElement("div");
          card.className = "game-card";

          card.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.name}">
            <h3>${game.name}</h3>
            ${game.hot ? '<span class="hot-badge">🔥 HOT</span>' : ''}
          `;

          card.addEventListener("click", function () {
            window.location.href = `game.html?game=${game.file}`;
          });

          container.appendChild(card);
        });

      })
      .catch(err => console.error("Failed to load games.json:", err));
  }

  // ===============================
  // LOGIN MODAL HANDLING
  // ===============================
  if (exists("loginBtn")) {

    const loginBtn = document.getElementById("loginBtn");
    const authModal = document.getElementById("authModal");
    const closeAuth = document.getElementById("closeAuth");

    loginBtn.addEventListener("click", function () {
      authModal.style.display = "flex";
    });

    closeAuth.addEventListener("click", function () {
      authModal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === authModal) {
        authModal.style.display = "none";
      }
    });
  }

});
