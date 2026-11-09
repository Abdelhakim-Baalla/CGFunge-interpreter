const N = parseInt(readline());
const grid = [];
for (let i = 0; i < N; i++) grid.push(readline());

let x = 0, y = 0;
let dx = 1, dy = 0;
const stack = [];

while (true) {
  const ch = grid[y][x];
  console.error(`x=${x} y=${y} ch='${ch}' stack=[${stack}]`);

  switch (ch) {
    case '>': dx = 1;  dy = 0;  break;
    case '<': dx = -1; dy = 0;  break;
    case '^': dx = 0;  dy = -1; break;
    case 'v': dx = 0;  dy = 1;  break;
    case 'E': console.log(stack.join('')); process.exit(0);
    case 'S': x += dx; y += dy; break;
    default:
      if (ch >= '0' && ch <= '9') stack.push(Number(ch));
      break;
  }

  x += dx;
  y += dy;
}
