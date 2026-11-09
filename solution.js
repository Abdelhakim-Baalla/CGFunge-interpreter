const N = parseInt(readline());
const grid = Array.from({length: N}, () => readline());
let x = 0, y = 0, dx = 1, dy = 0, strMode = false, out = "";
const stack = [];

const pop = () => stack.pop() || 0;

const dirs = { '>': [1, 0], '<': [-1, 0], '^': [0, -1], 'v': [0, 1] };

const ops = {
    '+': () => { const a=pop(), b=pop(); stack.push(b+a); },
    '-': () => { const a=pop(), b=pop(); stack.push(b-a); },
    '*': () => { const a=pop(), b=pop(); stack.push(b*a); },
    'P': pop,
    'X': () => { const a=pop(), b=pop(); stack.push(a, b); },
    'D': () => { const a=pop(); stack.push(a, a); },
    '_': () => { const a=pop(); [dx, dy] = a === 0 ? dirs['>'] : dirs['<']; },
    '|': () => { const a=pop(); [dx, dy] = a === 0 ? dirs['v'] : dirs['^']; },
    'I': () => out += pop(),
    'C': () => out += String.fromCharCode(pop()),
    'S': () => { x += dx; y += dy; },
    'E': () => { console.log(out); process.exit(0); }
};

while (true) {
    const ch = grid[y]?.[x] || ' ';

    if (ch === '"') {
        strMode = !strMode;
    } else if (strMode) {
        stack.push(ch.charCodeAt(0));
    } else if (ch >= '0' && ch <= '9') {
        stack.push(+ch);
    } else if (dirs[ch]) {
        [dx, dy] = dirs[ch];
    } else if (ops[ch]) {
        ops[ch]();
    }

    x += dx;
    y += dy;
}
