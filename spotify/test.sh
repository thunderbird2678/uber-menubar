printf -v var 'test'
printf -v var '%s\ntest2' "$var"
printf '%s\n' "$var"