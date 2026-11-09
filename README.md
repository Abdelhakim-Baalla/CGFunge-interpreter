# CGFunge Interpreter

[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A514-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Code Size](https://img.shields.io/badge/code%20size-1.5%20KB-blue)](./solution.js)

A compact, dependency-free **CGFunge** interpreter written in JavaScript.

---

## Overview

**CGFunge** is a 2-dimensional, positional esoteric programming language. Instead of
executing linearly, a CGFunge program is laid out on an **ASCII grid** and an
*instruction pointer* (IP) walks across it, changing direction on demand.

Execution always starts at the first character of the first line, heading **right**.
Every command is a single character, and the whole machine revolves around a single
**stack of integers in the range `[0 – 255]`**:

- digits push themselves onto the stack,
- arithmetic operators pop two values and push the result,
- flow-control operators pop a value and steer the IP,
- output operators pop a value and write it to `stdout`.

Spaces are treated as no-ops, so whitespace can be used freely to lay out a program
visually. The result is a tiny Befunge-style machine that fits in ~46 lines of code.

---

## System Architecture & Optimizations

The interpreter is a single `while (true)` loop with four stages per tick:

```
read cell  ->  classify  ->  execute  ->  advance IP
```

### 1. O(1) dispatch instead of a `switch`

A classic implementation routes each character through a `switch` with ~20 `case`
labels. V8 has to walk the case list (or build a jump table) and the source grows
with every new operator.

This implementation replaces it with **two plain object lookups**, both `O(1)`
average time:

```js
const dirs = { '>': [1, 0], '<': [-1, 0], '^': [0, -1], 'v': [0, 1] };

const ops = {
  '+': () => { const a = pop(), b = pop(); stack.push(b + a); },
  // ...
};
```

The main loop becomes a short, flat chain of guards:

```js
if (ch === '"')            strMode = !strMode;
else if (strMode)          stack.push(ch.charCodeAt(0));
else if (ch >= '0' && ch <= '9') stack.push(+ch);
else if (dirs[ch])         [dx, dy] = dirs[ch];
else if (ops[ch])          ops[ch]();
```

Benefits:

- **No branch ladder** — direction changes are a table read plus a destructure.
- **Data-driven** — adding an operator is one line in `ops`, not a new `case`.
- **Predictable** — property lookups on small objects stay in V8's inline caches,
  so the hot path is monomorphic.
- **Readable** — the control flow of the machine is visible at a glance.

### 2. Failsafe popping — `stack.pop() || 0`

CGFunge programs are allowed to pop from an empty stack (a `P` on a fresh stack, a
`_` before any value was pushed). In plain JavaScript `undefined` would then leak
into arithmetic:

```js
undefined + 1  // NaN
```

and `NaN` propagates through every subsequent operation, silently destroying the
rest of the run.

The interpreter wraps the primitive once:

```js
const pop = () => stack.pop() || 0;
```

Every operator uses `pop()` instead of `stack.pop()`, so an empty stack yields `0`.
The machine degrades gracefully instead of emitting `NaN`, and the same helper is
reused directly as the `P` operator (pop-and-discard).

### 3. Out-of-bounds safe reads — `grid[y]?.[x] || ' '`

The IP is free to leave the grid: programs can steer off the right edge, and input
lines may be **shorter than the grid width** (asymmetrical / ragged grids). A naive
`grid[y][x]` throws `TypeError: Cannot read properties of undefined`.

The cell read uses optional chaining with a fallback:

```js
const ch = grid[y]?.[x] || ' ';
```

- `grid[y]` is `undefined` when the pointer is above or below the grid → `' '`
- `[x]` is `undefined` on a short line or past the right edge → `' '`

Because space is a no-op, the pointer simply keeps travelling until it reaches a
real instruction or an `E`. No bounds checks, no `try/catch`, no crash — the guard
costs a single short-circuit per tick.

---

## Instruction Set

| Operator | Function |
|:--------:|----------|
| `>` | Set the instruction pointer direction to **right**, then advance. |
| `<` | Set the instruction pointer direction to **left**, then advance. |
| `^` | Set the instruction pointer direction to **up**, then advance. |
| `v` | Set the instruction pointer direction to **down**, then advance. |
| `0`–`9` | Push the digit's integer value onto the stack. |
| `+` | Pop `b`, pop `a`, push `a + b`. |
| `-` | Pop `b`, pop `a`, push `a - b` (top subtracted from second). |
| `*` | Pop `b`, pop `a`, push `a * b`. |
| `P` | Pop and discard the top value. |
| `X` | Swap the top two stack values. |
| `D` | Duplicate the top stack value. |
| `_` | Pop; if `0` continue **right**, otherwise continue **left**. |
| `\|` | Pop; if `0` continue **down**, otherwise continue **up**. |
| `I` | Pop and print the value as an integer. |
| `C` | Pop and print the value as an ASCII character. |
| `"` | Toggle *string mode*: while active, every character pushed as its ASCII code (spaces = `32`). |
| `S` | Skip the next cell (advance twice in the current direction). |
| `E` | End the program immediately. |

> Note: `I` and `C` write into a buffer that is flushed at `E`, so concatenated
> output contains no stray newlines between pieces.

---

## Execution

Requires **Node.js 14+** (optional chaining and logical assignment). No dependencies,
no install step.

### Run a program from a file

```bash
node solution.js < program.txt
```

### Run a program from stdin (heredoc)

```bash
node solution.js <<'EOF'
1
2419+*+IE
EOF
```

Output:

```
42
```

### Run the full local test-suite

```bash
./run_tests.sh
```

The suite executes 14 programs (arithmetic, stack ops, string mode, flow control,
ragged grids, edge cases) and prints `PASS` / `FAIL` per case.

### Debugging helper

`runner.js` provides the CodinGame `readline()` environment so the same
`solution.js` can be run outside the platform:

```bash
node runner.js solution.js < tests/01_math.txt
```

---

## Author

**Abdelhakim Baalla**

- GitHub: [https://github.com/Abdelhakim-Baalla](https://github.com/Abdelhakim-Baalla)

## License

Released under the [MIT License](./LICENSE).
