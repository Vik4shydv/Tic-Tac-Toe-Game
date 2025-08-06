let currentPlayer = 'X';

let mode = '';

let level = '';

let cells = Array(9).fill(null);

let scores = { X: 0, O: 0 };

let computerScores = { player: 0, computer: 0 };

function goToScreen(id) {

  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

  document.getElementById(id).classList.add("active");

}

function selectMode(m) {

  mode = m;

  if (mode === 'friends') {

    startGame();

    goToScreen('gameScreen');

  }

}

function goToLevelSelect() {

  mode = 'computer';

  goToScreen('levelScreen');

}

function selectLevel(lv) {

  level = lv;

  startGame();

  goToScreen('gameScreen');

}

function startGame() {

  const board = document.getElementById('board');

  board.innerHTML = '';

  cells = Array(9).fill(null);

  currentPlayer = 'X';

  updateTurnText();

  for (let i = 0; i < 9; i++) {

    const cell = document.createElement('div');

    cell.classList.add('cell');

    cell.addEventListener('click', () => handleClick(i), { once: true });

    board.appendChild(cell);

  }

  updateScores();

}

function updateTurnText() {

  const text = document.getElementById('turnText');

  text.textContent = mode === 'friends' ? `Player ${currentPlayer}'s Turn` : `Your Turn`;

}

function handleClick(i) {

  if (cells[i] || (mode === 'computer' && currentPlayer !== 'X')) return;

  makeMove(i, currentPlayer);

  if (checkWin(currentPlayer)) return;

  if (cells.every(c => c)) return endGame(null);

  if (mode === 'computer') {

    currentPlayer = 'O';

    updateTurnText();

    setTimeout(() => computerPlay(), 500);

  } else {

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    updateTurnText();

  }

}

function makeMove(i, player) {

  const board = document.getElementById('board');

  cells[i] = player;

  board.children[i].textContent = player;

  if (checkWin(player)) {

    endGame(player);

  }

}

function checkWin(player) {

  const wins = [

    [0,1,2],[3,4,5],[6,7,8],

    [0,3,6],[1,4,7],[2,5,8],

    [0,4,8],[2,4,6]

  ];

  return wins.some(pattern => 

    pattern.every(i => cells[i] === player)

  );

}

function endGame(winner) {

  if (mode === 'friends') {

    if (winner === 'X') scores.X++;

    else if (winner === 'O') scores.O++;

    updateScores();

    document.getElementById('resultText').textContent = winner ? `Player ${winner} Wins!` : 'Draw!';

    goToScreen('friendResult');

  } else {

    if (winner === 'X') computerScores.player++;

    else if (winner === 'O') computerScores.computer++;

    updateScores();

    document.getElementById('compResultText').textContent = winner ? (winner === 'X' ? 'You Win!' : 'Computer Wins!') : 'Draw!';

    goToScreen('computerResult');

  }

}

function updateScores() {

  document.getElementById('scoreX').textContent = scores.X;

  document.getElementById('scoreO').textContent = scores.O;

  document.getElementById('scoreX2').textContent = scores.X;

  document.getElementById('scoreO2').textContent = scores.O;

  document.getElementById('scorePlayer').textContent = computerScores.player;

  document.getElementById('scoreComputer').textContent = computerScores.computer;

  document.getElementById('friendScoreboard').style.display = mode === 'friends' ? 'block' : 'none';

  document.getElementById('friendScoreboardResult').style.display = mode === 'friends' ? 'block' : 'none';

  document.getElementById('computerScoreboard').style.display = mode === 'computer' ? 'block' : 'none';

}

function restartGame() {

  startGame();

  goToScreen('gameScreen');

}

function computerPlay() {

  let empty = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);

  let move;

  if (level === 'easy') {

    move = Math.random() < 0.9 ? bestMove('O') || randomMove(empty) : randomMove(empty);

  } else if (level === 'normal') {

    move = Math.random() < 0.5 ? bestMove('O') || randomMove(empty) : randomMove(empty);

  } else {

    move = Math.random() < 0.9 ? bestMove('O') || randomMove(empty) : randomMove(empty);

  }

  makeMove(move, 'O');

  if (!checkWin('O') && cells.some(c => c === null)) {

    currentPlayer = 'X';

    updateTurnText();

  }

}

function randomMove(arr) {

  return arr[Math.floor(Math.random() * arr.length)];

}

function bestMove(player) {

  for (let i = 0; i < 9; i++) {

    if (!cells[i]) {

      cells[i] = player;

      if (checkWin(player)) {

        cells[i] = null;

        return i;

      }

      cells[i] = null;

    }

  }

  return null;

}