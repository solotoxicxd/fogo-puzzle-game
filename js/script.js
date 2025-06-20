
let soundEnabled = true;
let lastPlayTime = 0;
let moveCount = 0;

// Dummy placeholder logic
document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("puzzle-container").style.display = "block";
});

document.getElementById("solve-btn").addEventListener("click", () => {
  moveCount += Math.floor(Math.random() * 30);
  showVictory();
});

function showVictory() {
  const rank = moveCount < 15 ? "🔥 Firestarter" :
               moveCount < 30 ? "🔥🔥 Flame Tamer" :
               "🧯 Toasted Rookie";

  const roast = moveCount < 15 ? "Blazing fast! You melted it!" :
                moveCount < 30 ? "You handled the heat!" :
                "Oof, someone call fire control!";

  document.getElementById("victory-message").innerHTML =
    \`Moves: \${moveCount}<br />Rank: \${rank}<br />\${roast}\`;

  document.getElementById("victory-modal").style.display = "flex";

  document.getElementById("share-x").onclick = () => {
    const text = encodeURIComponent(\`I just solved the Fogo Puzzle in \${moveCount} moves and earned the title '\${rank}' 🔥! Try it now:
https://yourwebsite.com
by @bytrizz404\`);
    window.open(\`https://twitter.com/intent/tweet?text=\${text}\`, "_blank");
  };
}

document.getElementById("sound-toggle").addEventListener("change", (e) => {
  soundEnabled = e.target.checked;
});
