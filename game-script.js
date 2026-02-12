// game-script.js
const urlParams = new URLSearchParams(window.location.search);
const gameFile = urlParams.get("game");
const iframe = document.getElementById("game-frame");

if (gameFile) {
  iframe.src = gameFile;
  iframe.style.width = "100%";
  iframe.style.height = "100vh";
  iframe.style.border = "none";
}
