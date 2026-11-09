#!/bin/bash
cd "$(dirname "$0")"
pass=0; fail=0
for t in tests/*.txt; do
  name=$(basename "$t" .txt)
  exp=$(cat "expected/$name.txt")
  got=$(node runner.js solution.js < "$t" 2>/dev/null)
  if [ "$got" = "$exp" ]; then echo "PASS $name"; pass=$((pass+1));
  else echo "FAIL $name  got='$got'  expected='$exp'"; fail=$((fail+1)); fi
done
echo "---- $pass passed, $fail failed"
