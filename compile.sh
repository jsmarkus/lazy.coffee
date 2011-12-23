files="./lib/base.coffee ./lib/arithmetics.coffee ./lib/flow.coffee ./lib/util.coffee ./lib/func.coffee"

mkdir -f tmp
(for file in $files
do
    tail -n +2 $file | coffee -cs
done) > tmp/modules.js
coffee -c -o tmp/ "./lib/lazy.coffee"

cat "browser-head.js" "./tmp/lazy.js" "./tmp/modules.js" > lazy.coffee.js