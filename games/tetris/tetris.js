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
