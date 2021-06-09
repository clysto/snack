const $canvas = document.querySelector('#canvas');
/** @type CanvasRenderingContext2D */
const ctx = $canvas.getContext('2d');
clearCanvas();

let food = [0, 0];
let double = false;

genFood();

function clearCanvas() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 512);
}

function drawPixel(x, y, color) {
  ctx.fillStyle = color || '#ffffff';
  ctx.fillRect(x * 8, y * 8, 8, 8);
}

function genFood() {
  double = Math.random() > 0.7;
  food[0] = Math.floor(Math.random() * 64);
  food[1] = Math.floor(Math.random() * 64);
}

function end() {
  clearInterval(loop);
  window.onkeydown = undefined;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(512 / 2 - 170, 512 / 2 - 35, 340, 70);
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', 512 / 2, 512 / 2);
}

class Snack {
  constructor() {
    this.shape = [
      [16, 16],
      [15, 16],
      [14, 16],
      [14, 15],
      [14, 14],
      [14, 13],
    ];
  }

  display() {
    for (let [x, y] of this.shape) {
      drawPixel(x, y);
    }
  }

  setDirection(dx, dy) {
    let ox = this.shape[0][0] - this.shape[1][0];
    let oy = this.shape[0][1] - this.shape[1][1];
    if (dx * ox + dy * oy !== 0) {
      return;
    }

    this.direction = [dx, dy];
  }

  move() {
    let dx, dy;
    if (this.direction) {
      [dx, dy] = this.direction;
    } else {
      dx = this.shape[0][0] - this.shape[1][0];
      dy = this.shape[0][1] - this.shape[1][1];
    }
    let x = this.shape[0][0] + dx;
    let y = this.shape[0][1] + dy;
    x = (x + 64) % 64;
    y = (y + 64) % 64;

    if (x === food[0] && y === food[1]) {
      genFood();
      if (double) {
        let ndx =
          this.shape[this.shape.length - 1][0] -
          this.shape[this.shape.length - 2][0];
        let ndy =
          this.shape[this.shape.length - 1][1] -
          this.shape[this.shape.length - 2][1];
        let nx = this.shape[this.shape.length - 1][0] + ndx;
        let ny = this.shape[this.shape.length - 1][1] + ndy;
        this.shape.push([nx, ny]);
      }
    } else {
      this.shape.pop();
    }

    // if (x >= 64 || x < 0 || (y >= 64) | (y < 0)) {
    //   end();
    // }

    for (let [x1, y1] of this.shape) {
      if (x == x1 && y == y1) {
        end();
      }
    }

    this.shape.unshift([x, y]);
    if (this.direction) {
      this.direction = undefined;
    }
  }
}

snack = new Snack();

let speed = 4;
let interval = 0;
const MAX_SPEED = 8;

function initInterval() {
  interval = MAX_SPEED - speed + 1;
}

function draw() {
  clearCanvas();
  if (double) {
    drawPixel(food[0], food[1], '#00aa00');
  } else {
    drawPixel(food[0], food[1], '#aaaaaa');
  }
  snack.display();
  snack.move();
  initInterval();
}

let loop = setInterval(() => {
  if (interval <= 0) {
    draw();
  }
  interval--;
}, 20);

setInterval(() => {
  if (speed <= MAX_SPEED) {
    speed++;
  }
}, 10000);

window.onkeydown = (e) => {
  if (e.key === 'ArrowUp') {
    snack.setDirection(0, -1);
    draw();
    initInterval();
  } else if (e.key == 'ArrowRight') {
    snack.setDirection(1, 0);
    draw();
    initInterval();
  } else if (e.key == 'ArrowDown') {
    snack.setDirection(0, 1);
    draw();
    initInterval();
  } else if (e.key == 'ArrowLeft') {
    snack.setDirection(-1, 0);
    draw();
    initInterval();
  }
};
