# CGFunge interpreter — CodinGame training (medium)

JavaScript solution, built step by step.

## Run a single test
    node runner.js solution.js < tests/01_math.txt

## Run all tests
    ./run_tests.sh

## Commit
    ./commit.sh "message"

## Command reference (from the statement)
| cmd | behavior |
|-----|----------|
| > < ^ v | set direction |
| S | skip next cell (advance twice) |
| E | end program |
| 0-9 | push digit |
| + - * | pop b, pop a, push a op b  (52-E -> 3) |
| P | pop |
| X | swap top two |
| D | duplicate top |
| " | toggle string mode (chars push their ASCII code, spaces = 32) |
| _ | pop; 0 -> right, else left |
| \| | pop; 0 -> down, else up |
| I | pop, print integer |
| C | pop, print ASCII char |

## Status
- [x] grid + instruction pointer + directions + S
- [ ] arithmetic + - *
- [ ] P X D
- [ ] " string mode
- [ ] _ | flow control
- [ ] I C output
