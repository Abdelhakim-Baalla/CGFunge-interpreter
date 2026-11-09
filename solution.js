const N = parseInt(readline());
const grid = [];
for (let i = 0; i < N; i++) grid.push(readline());

let x = 0, y = 0; 
let dx = 1, dy = 0;
const stack = [];

let output = '';

while (true) {
  const ch = grid[y][x];
  console.error(`x=${x} y=${y} ch='${ch}' stack=[${stack}]`);

  let a, b;

switch (ch) {
    
    case '>': dx = 1; dy = 0; break;
    case '<': dx = -1; dy = 0; break;
    case '^': dx = 0; dy = -1; break;
    case 'v': dx = 0; dy = 1; break;
    case 'S': x += dx; y += dy; break;
    
    
    case '_': 
        a = stack.pop();
        if (a === 0) { dx = 1; dy = 0; }
        else { dx = -1; dy = 0; }
        break;
    case '|': 
        a = stack.pop();
        if (a === 0) { dx = 0; dy = 1; }
        else { dx = 0; dy = -1; }
        break;

   
    case '+':
        stack.push(stack.pop() + stack.pop());
        break;
    case '*':
        stack.push(stack.pop() * stack.pop());
        break;
    case '-':
        a = stack.pop(); 
        b = stack.pop();
        stack.push(b - a);
        break;
    case '/':
        a = stack.pop(); 
        b = stack.pop(); 
        stack.push(Math.trunc(b / a)); 
        break;

    
    case 'I': 
        output += stack.pop().toString();
        break;
    case 'c': 
        output += String.fromCharCode(stack.pop());
        break;
        
   
    case 'E': 
        console.log(output); 
        process.exit(0);

    default:
        if (ch >= '0' && ch <= '9') {
            stack.push(Number(ch));
        }
        break;
}

  x += dx;
  y += dy;
}
