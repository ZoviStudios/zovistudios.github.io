// ===============================
// SAFE ELEMENT CHECK HELPER
// ===============================
function exists(id) {
  return document.getElementById(id) !== null;
}

// ===============================
// LOAD GAMES ON INDEX PAGE
// ===============================
if (exists("games-container")) {
  fetch("games.json")
    .then(res => res.json())
    .then(games => {
      const container = document.getElementById("games-container");

      games.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        card.innerHTML = `
          <img src="${game.thumbnail}" alt="${game.title}">
          <h3>${game.title}</h3>
        `;

        card.onclick = () => {
          window.location.href = `game.html?id=${game.id}`;
        };

        container.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading games:", err));
}

// ===============================
// LOAD SINGLE GAME ON GAME PAGE
// ===============================
if (window.location.pathname.includes("game.html")) {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("id");

  fetch("games.json")
    .then(res => res.json())
    .then(games => {
      const game = games.find(g => g.id === gameId);
      if (!game) return;

      if (exists("game-title")) {
        document.getElementById("game-title").textContent = game.title;
      }

      if (exists("game-frame")) {
        document.getElementById("game-frame").src = game.url;
      }
    });
}

// ===============================
// LOGIN MODAL HANDLING
// ===============================
if (exists("loginBtn")) {
  const loginBtn = document.getElementById("loginBtn");
  const authModal = document.getElementById("authModal");
  const closeAuth = document.getElementById("closeAuth");

  loginBtn.onclick = () => {
    authModal.style.display = "flex";
  };

  closeAuth.onclick = () => {
    authModal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === authModal) {
      authModal.style.display = "none";
    }
  };
}
