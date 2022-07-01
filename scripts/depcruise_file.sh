#!/bin/bash

#+i: string, -r: read-only
declare +i -r SOURCE=$1

declare +i -r PROJECT="${PWD##*/}";

declare +i -r TARGET="../graph-$PROJECT/$SOURCE";

#I prefer create the output one level up of the current project
#which is actually part of same project
mkdir -p $( dirname "$TARGET")

yarn depcruise -x "^node_modules" -T dot -f "$TARGET.dot" "$SOURCE"

dot "$TARGET.dot" -Tsvg > "$TARGET.svg"

rm "$TARGET.dot"
