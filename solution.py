import sys

G = [input() for _ in range(int(input()))]
pos, d, M, out, S = 0, 1, False, "", []
p = lambda: S.pop() if S else 0

while 1:
    y, x = int(pos.imag), int(pos.real)
    c = G[y][x] if 0 <= y < len(G) and 0 <= x < len(G[y]) else ' '

    if c == '"': M = not M
    elif M: S.append(ord(c))
    elif c.isdigit(): S.append(int(c))
    elif c in '><^v': d = {'>': 1, '<': -1, 'v': 1j, '^': -1j}[c]
    elif c == '+': S.append(p() + p())
    elif c == '-': a, b = p(), p(); S.append(b - a)
    elif c == '*': S.append(p() * p())
    elif c == 'P': p()
    elif c == 'X': a, b = p(), p(); S.extend([a, b])
    elif c == 'D': a = p(); S.extend([a, a])
    elif c == '_': d = 1 if p() == 0 else -1
    elif c == '|': d = 1j if p() == 0 else -1j
    elif c == 'I': out += str(p())
    elif c == 'C': out += chr(p())
    elif c == 'S': pos += d
    elif c == 'E': print(out); sys.exit()

    pos += d
