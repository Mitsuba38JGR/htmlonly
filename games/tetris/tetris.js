const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

ctx.scale(20, 20);

// テトリミノの形
function createPiece(type) {
  if (type === 'T') {
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  }
  if (type === 'O') {
    return [
      [1, 1],
      [1, 1],
    ];
  }
  if (type === 'L') {
    return [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  }
  if (type === 'J') {
    return [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ];
  }
  if (type === 'I') {
    return [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
  if (type === 'S') {
    return [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
  }
  if (type === 'Z') {
    return [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
  }
}

// 衝突判定
function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;

  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (
        m[y][x] !== 0 &&
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

// フィールド作成
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

// 描画
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = "cyan";
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// 落下処理
function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
  }
  dropCounter = 0;
}

// ミノをフィールドに固定
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// 新しいミノを出す
function playerReset() {
  const pieces = "ILJOTSZ";
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
  }
}

// キー操作
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") {
    player.pos.x--;
    if (collide(arena, player)) {
      player.pos.x++;
    }
  } else if (event.key === "ArrowRight") {
    player.pos.x++;
    if (collide(arena, player)) {
      player.pos.x--;
    }
  } else if (event.key === "ArrowDown") {
    playerDrop();
  }
});

// ゲームループ
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const delta = time - lastTime;
  lastTime = time;

  dropCounter += delta;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);
const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
};

playerReset();
update();
drawNext();
function rotate(matrix, dir) {
  // 転置
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  // 反転
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}
const kickTable = {
  normal: [
    [0, 0], [1, 0], [-1, 0], [1, -1], [-1, -1]
  ],
  I: [
    [0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]
  ]
};
function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;

  rotate(player.matrix, dir);

  const kicks = (player.matrix.length === 4) ? kickTable.I : kickTable.normal;

  for (let i = 0; i < kicks.length; i++) {
    const [kx, ky] = kicks[i];
    player.pos.x = pos + kx;
    player.pos.y += ky;

    if (!collide(arena, player)) {
      return;
    }

    player.pos.x = pos;
    player.pos.y -= ky;
  }

  // 回転失敗 → 元に戻す
  rotate(player.matrix, -dir);
}
function arenaSweep() {
  let lines = 0;

  outer: for (let y = arena.length - 1; y >= 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;

    lines++;
  }

  return lines;
}
let score = 0;

function addScore(lines) {
  const table = [0, 100, 300, 500, 800];
  score += table[lines];
}
function isTSpin() {
  if (player.matrix.length !== 3) return false; // Tミノのみ

  const corners = [
    [player.pos.x, player.pos.y],
    [player.pos.x + 2, player.pos.y],
    [player.pos.x, player.pos.y + 2],
    [player.pos.x + 2, player.pos.y + 2]
  ];

  let filled = 0;
  for (const [x, y] of corners) {
    if (arena[y] && arena[y][x]) filled++;
  }

  return filled >= 3;
}
const settings = {
  ghost: true,
  hardDrop: true,
  softDropSpeed: 50,
  autoRepeat: true,
};
function getGhostPosition() {
  const ghost = {
    pos: { x: player.pos.x, y: player.pos.y },
    matrix: player.matrix
  };

  while (!collide(arena, ghost)) {
    ghost.pos.y++;
  }
  ghost.pos.y--; // 1つ戻す

  return ghost;
}
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (settings.ghost) {
    const ghost = getGhostPosition();
    drawMatrix(ghost.matrix, ghost.pos, "rgba(255,255,255,0.2)");
  }

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}
function drawMatrix(matrix, offset, color = "cyan") {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = color;
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
document.addEventListener("keydown", event => {
  if (event.key === " ") {
    if (settings.hardDrop) {
      while (!collide(arena, player)) {
        player.pos.y++;
      }
      player.pos.y--;
      merge(arena, player);
      playerReset();
      dropCounter = 0;
    }
  }
});
const settings = {
  ghost: true,
  hardDrop: true,
  softDropSpeed: 50,
  autoRepeat: true,
  hold: true,
  bag7: true,
};
let holdPiece = null;
let holdUsed = false;
function playerHold() {
  if (!settings.hold || holdUsed) return;

  if (holdPiece === null) {
    holdPiece = player.matrix;
    playerReset();
  } else {
    const temp = player.matrix;
    player.matrix = holdPiece;
    holdPiece = temp;
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  }

  holdUsed = true;
}
if (event.key === "c" || event.key === "C") {
  playerHold();
}
function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    holdUsed = false; // ← ここ！
  }
  dropCounter = 0;
}
let bag = [];
function generateBag() {
  const pieces = ["I", "O", "T", "S", "Z", "J", "L"];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}
function playerReset() {
  if (settings.bag7) {
    if (bag.length === 0) {
      bag = generateBag();
    }
    const piece = bag.pop();
    player.matrix = createPiece(piece);
  } else {
    const pieces = "ILJOTSZ";
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  }

  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
  }
}
const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");
nextCtx.scale(20, 20);
function drawNext() {
  nextCtx.fillStyle = "#000";
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  const preview = bag.slice(-5).reverse(); // 次の5つ

  preview.forEach((type, i) => {
    const matrix = createPiece(type);
    drawMatrixNext(matrix, { x: 1, y: i * 4 + 1 });
  });
}
function drawMatrixNext(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        nextCtx.fillStyle = "cyan";
        nextCtx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
