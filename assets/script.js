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
