#!/bin/bash
mkdir -p $( dirname "../graph/$1") && touch "../graph/$1"
yarn depcruise -x "^node_modules" -T dot -f "../graph/$1" "$1"
dot "../graph/$1" -Tpng > "../graph/$1.png"
rm "../graph/$1"
