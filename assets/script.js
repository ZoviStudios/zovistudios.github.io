fetch("games.json")
  .then(res => res.json())
  .then(games => {
    const hotContainer = document.getElementById("hot-games");
    const allContainer = document.getElementById("all-games");

    games.forEach(game => {
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
    });
  })
  .catch(err => console.error("Failed to load games:", err));

// ===== Search Function =====
const searchInput = document.getElementById("search-input");

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
});
