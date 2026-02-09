// ===============================
//  設定読み込み（localStorage）
// ===============================
const settings = JSON.parse(localStorage.getItem("tetris_settings")) || {
  ghost: true,
  hardDrop: true,
  hold: true,
  bag7: true,
  softDropSpeed: 50,
  das: 120,
  arr: 20,
};

// ===============================
//  キーコンフィグ
// ===============================
const keys = (settings.keys) || {
  keyLeft: "ArrowLeft",
  keyRight: "ArrowRight",
  keySoftDrop: "ArrowDown",
  keyHardDrop: " ",
  keyRotateLeft: "z",
  keyRotateRight: "x",
  keyHold: "c",
};

// ===============================
//  キャンバス
// ===============================
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
ctx.scale(20, 20);

const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");
nextCtx.scale(20, 20);

const holdCanvas = document.getElementById("hold");
const holdCtx = holdCanvas.getContext("2d");
holdCtx.scale(20, 20);

// ===============================
//  ミノ定義（形 + 色）
// ===============================
const pieceColors = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0000f0",
  L: "#f0a000",
};

function createPiece(type) {
  switch (type) {
    case "T": return [[0,1,0],[1,1,1],[0,0,0]];
    case "O": return [[1,1],[1,1]];
    case "L": return [[1,0,0],[1,1,1],[0,0,0]];
    case "J": return [[0,0,1],[1,1,1],[0,0,0]];
    case "I": return [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]];
    case "S": return [[0,1,1],[1,1,0],[0,0,0]];
    case "Z": return [[1,1,0],[0,1,1],[0,0,0]];
  }
}

// ===============================
//  SRS（回転 + 壁蹴り）
// ===============================
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) matrix.forEach(row => row.reverse());
  else matrix.reverse();
}

const kickTable = {
  normal: [[0,0],[1,0],[-1,0],[1,-1],[-1,-1]],
  I: [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
};

function playerRotate(dir) {
  const pos = player.pos.x;
  rotate(player.matrix, dir);

  const kicks = (player.matrix.length === 4) ? kickTable.I : kickTable.normal;

  for (let i = 0; i < kicks.length; i++) {
    const [kx, ky] = kicks[i];
    player.pos.x = pos + kx;
    player.pos.y += ky;

    if (!collide(arena, player)) return;

    player.pos.x = pos;
    player.pos.y -= ky;
  }

  rotate(player.matrix, -dir);
}

// ===============================
//  7-Bag ランダム生成
// ===============================
let bag = [];

function generateBag() {
  const pieces = ["I","O","T","S","Z","J","L"];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}
// ===============================
//  ホールド機能
// ===============================
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

// ===============================
//  Next Queue（5個）
// ===============================
function drawNext() {
  nextCtx.fillStyle = "#000";
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  const preview = bag.slice(-5).reverse(); // 次の5つ

  preview.forEach((type, i) => {
    const matrix = createPiece(type);
    drawMatrixNext(matrix, { x: 1, y: i * 4 + 1 }, pieceColors[type]);
  });
}

function drawMatrixNext(matrix, offset, color) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        nextCtx.fillStyle = color;
        nextCtx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// ===============================
//  ホールド描画
// ===============================
function drawHold() {
  holdCtx.fillStyle = "#000";
  holdCtx.fillRect(0, 0, holdCanvas.width, holdCanvas.height);

  if (!holdPiece) return;

  drawMatrixHold(holdPiece, { x: 1, y: 1 });
}

function drawMatrixHold(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        holdCtx.fillStyle = "#888";
        holdCtx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// ===============================
//  描画（フィールド・ミノ・ゴースト）
// ===============================
function getGhostPosition() {
  const ghost = {
    pos: { x: player.pos.x, y: player.pos.y },
    matrix: player.matrix
  };

  while (!collide(arena, ghost)) {
    ghost.pos.y++;
  }
  ghost.pos.y--;

  return ghost;
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ゴースト
  if (settings.ghost) {
    const ghost = getGhostPosition();
    drawMatrix(ghost.matrix, ghost.pos, "rgba(255,255,255,0.2)");
  }

  // フィールド
  drawMatrix(arena, { x: 0, y: 0 });

  // プレイヤーミノ
  drawMatrix(player.matrix, player.pos, pieceColors[player.type]);

  // Next & Hold
  drawNext();
  drawHold();
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
// ===============================
//  衝突判定
// ===============================
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

// ===============================
//  ライン消去・コンボ・B2B
// ===============================
let combo = -1;
let backToBack = false;

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

// ===============================
//  T-Spin 判定
// ===============================
function isTSpin() {
  if (player.type !== "T") return false;

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

// ===============================
//  スコア・レベル
// ===============================
let score = 0;
let level = 1;
let linesClearedTotal = 0;

function addScore(lines, tspin) {
  let points = 0;

  if (tspin) {
    if (lines === 1) points = 800;
    else if (lines === 2) points = 1200;
    else if (lines === 3) points = 1600;
  } else {
    const table = [0, 100, 300, 500, 800];
    points = table[lines];
  }

  // コンボ
  if (lines > 0) {
    combo++;
    if (combo > 0) points += combo * 50;
  } else {
    combo = -1;
  }

  // B2B
  if ((lines === 4 || tspin) && backToBack) {
    points = Math.floor(points * 1.5);
  }

  if (lines === 4 || tspin) backToBack = true;
  else backToBack = false;

  score += points;
  linesClearedTotal += lines;

  // レベルアップ
  if (linesClearedTotal >= level * 10) {
    level++;
    dropInterval = Math.max(100, dropInterval - 80);
  }
}

// ===============================
//  ミノ固定 → ライン消去 → スコア → 次のミノ
// ===============================
function lockPiece() {
  merge(arena, player);

  const tspin = isTSpin();
  const lines = arenaSweep();

  addScore(lines, tspin);

  playerReset();
  holdUsed = false;
}

// ===============================
//  ミノをフィールドに固定
// ===============================
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// ===============================
//  新しいミノを出す（7-Bag対応）
// ===============================
function playerReset() {
  let pieceType;

  if (settings.bag7) {
    if (bag.length === 0) bag = generateBag();
    pieceType = bag.pop();
  } else {
    const pieces = "ILJOTSZ";
    pieceType = pieces[(pieces.length * Math.random()) | 0];
  }

  player.type = pieceType;
  player.matrix = createPiece(pieceType);

  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    score = 0;
    level = 1;
    linesClearedTotal = 0;
    combo = -1;
    backToBack = false;
  }
}
// ===============================
//  入力処理（DAS / ARR 対応）
// ===============================

// キー状態
const keyState = {
  left: false,
  right: false,
  soft: false,
};

// DAS / ARR タイマー
let dasTimer = 0;
let arrTimer = 0;

// キー押下
document.addEventListener("keydown", event => {
  const k = event.key;

  // 左移動
  if (k === keys.keyLeft) {
    if (!keyState.left) {
      movePlayer(-1);
      dasTimer = performance.now();
    }
    keyState.left = true;
  }

  // 右移動
  else if (k === keys.keyRight) {
    if (!keyState.right) {
      movePlayer(1);
      dasTimer = performance.now();
    }
    keyState.right = true;
  }

  // ソフトドロップ
  else if (k === keys.keySoftDrop) {
    keyState.soft = true;
  }

  // ハードドロップ
  else if (k === keys.keyHardDrop) {
    if (settings.hardDrop) {
      while (!collide(arena, player)) player.pos.y++;
      player.pos.y--;
      lockPiece();
      dropCounter = 0;
    }
  }

  // 左回転
  else if (k === keys.keyRotateLeft) {
    playerRotate(-1);
  }

  // 右回転
  else if (k === keys.keyRotateRight) {
    playerRotate(1);
  }

  // ホールド
  else if (k === keys.keyHold) {
    playerHold();
  }
});

// キー離し
document.addEventListener("keyup", event => {
  const k = event.key;

  if (k === keys.keyLeft) keyState.left = false;
  if (k === keys.keyRight) keyState.right = false;
  if (k === keys.keySoftDrop) keyState.soft = false;
});

// ===============================
//  横移動（DAS / ARR）
// ===============================
function handleHorizontalMovement(time) {
  if (keyState.left || keyState.right) {
    const direction = keyState.left ? -1 : 1;

    // DAS
    if (time - dasTimer > settings.das) {
      // ARR
      if (time - arrTimer > settings.arr) {
        movePlayer(direction);
        arrTimer = time;
      }
    }
  }
}

function movePlayer(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

// ===============================
//  ソフトドロップ
// ===============================
function handleSoftDrop(delta) {
  if (keyState.soft) {
    player.pos.y += settings.softDropSpeed * (delta / 1000);
    if (collide(arena, player)) {
      player.pos.y = Math.floor(player.pos.y);
      lockPiece();
    }
  }
}
// ===============================
//  落下処理
// ===============================
let dropCounter = 0;
let dropInterval = 1000; // レベルで変化

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    lockPiece();
  }
  dropCounter = 0;
}

// ===============================
//  ゲームループ
// ===============================
let lastTime = 0;

function update(time = 0) {
  const delta = time - lastTime;
  lastTime = time;

  dropCounter += delta;

  // 自然落下
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  // 横移動（DAS / ARR）
  handleHorizontalMovement(time);

  // ソフトドロップ
  handleSoftDrop(delta);

  draw();
  requestAnimationFrame(update);
}

// ===============================
//  初期化
// ===============================
const arena = createMatrix(12, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  type: null,
};

// ゲーム開始
playerReset();
update();
