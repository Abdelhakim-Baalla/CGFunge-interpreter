#!/bin/bash
cd "$(dirname "$0")"
git add -A
msg="${1:-update}"
git commit -m "$msg" >/dev/null 2>&1 && echo "committed: $msg" || echo "nothing to commit"
