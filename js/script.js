let soundEnabled = true;
let lastPlayTime = 0;
const slideSound = new Audio("assets/audio/slide.mp3");
const clickSound = new Audio("assets/audio/click.mp3");
slideSound.volume = 0.6; clickSound.volume = 0.6;

function playSound(sound, debounce=150) {
  if (!soundEnabled) return;
  const now = Date.now();
  if (now - lastPlayTime < debounce) return;
  lastPlayTime = now;
  sound.currentTime = 0;
  sound.play();
}

// Sound toggle
$('#sound-toggle').on('change', e => {
  soundEnabled = e.target.checked;
  localStorage.setItem('fogoSound', soundEnabled);
});
$(window).on('DOMContentLoaded', () => {
  if (localStorage.getItem('fogoSound') === 'false') {
    $('#sound-toggle').prop('checked', false);
    soundEnabled = false;
  }
});

// Flow controls
$('#start-btn').on('click', () => {
  playSound(clickSound);
  $('.start-btn, header h1').addClass('hidden');
  $('.board-container').removeClass('hidden');
  board.start();
});

// Initialize board with random image
const randomImage = `assets/images/fogo${Math.floor(Math.random() * 5) + 1}.png`;
const board = new Board(3, randomImage);

$('#shuffle-btn').on('click', () => {
  playSound(clickSound);
  board.start();
});
$('#solve-btn').on('click', () => {
  playSound(clickSound);
  new Solver(board).solveAI();
});

// Handle tile move sound
$(document).on('tileMoved', () => playSound(slideSound));

// Show completion modal
$(document).on('puzzleSolved', data => {
  const { moves, rank, roast } = data;
  $('#end-moves').text(moves);
  $('#end-rank').text(rank);
  $('#end-roast').text(roast);
  $('#end-title').text('🎉 You did it!');
  $('#end-modal').removeClass('hidden');
});

// Share button
$('#share-btn').on('click', () => {
  const moves = +$('#end-moves').text();
  const rank = $('#end-rank').text();
  const txt = `I beat the Fogo Puzzle in ${moves} moves — earned: ${rank}! Think you can roast the flames? 🔥 fogo-puzzle.vercel.app by @bytrizz404`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}`, '_blank');
});
$('#play-again').on('click', () => location.reload());
