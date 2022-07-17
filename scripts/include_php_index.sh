#!/bin/bash

php -w index.php > test-index.php

echo "echo '" >> test-index.php
cat dist/index.html >> test-index.php
echo "';" >> test-index.php

mv test-index.php dist/index.php
rm dist/index.html

last_commit_hash=$(git log | head -n 1 | awk '{ print $2 }');
version=${last_commit_hash:0:5};
sed -i "s/build_version/$version/g" dist/index.php;
