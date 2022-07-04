#!/bin/bash

# Attemp to check changes in a source file before draw a new graph
# The first part of the script checks old and new source files which includes a
# hash representing the state of the code. But this isn't work for code bases
# because files has dependencies. I'm just checking main file but not all deps

#+i: string, -r: read-only
declare +i -r PROJECT="${PWD##*/}";
declare +i -r SOURCE=$1
declare +i -r HASH=$(sha1sum $SOURCE | sed 's/\(.\{8\}\).*/\1/')
declare +i -r TARGET="../graph-$PROJECT/$SOURCE"

#-------------------------------------------------------------------------------
# Retrieve the old hashed file: notice at this point I don't know the old name

declare +i -r PREV_HASHED_FILE=$(ls "$TARGET".*.svg 2> /dev/null)
declare +i -r NEXT_HASHED_FILE="$TARGET.$HASH.svg"

#-------------------------------------------------------------------------------
# Check if file has changed
# first I see if old file exists and the if it matches the new file
if [ "$PREV_HASHED_FILE" = "$NEXT_HASHED_FILE" ]; then exit; fi

#-------------------------------------------------------------------------------
# Graph Creation

mkdir -p $( dirname "$TARGET")

rm -f "$PREV_HASHED_FILE"

yarn depcruise -x "^node_modules" -T dot -f "$TARGET.dot" "$SOURCE"

dot "$TARGET.dot" -Tsvg > "$TARGET.$HASH.svg"

rm "$TARGET.dot"
