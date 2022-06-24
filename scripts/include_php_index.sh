#!/bin/bash

php -w index.php > test-index.php

echo "echo '" >> test-index.php
cat dist/index.html >> test-index.php
echo "';" >> test-index.php

mv test-index.php dist/index.php
rm dist/index.html


