#!/bin/bash

# 0. Install yarn dep the first time
if [[ ! -d node_modules ]]; then
  yarn;
fi

# 1. Compile the React build with vite
yarn build;

# 2. Copy the backend repository to the compiled build (dist)
cp -r ../../php-server/CRUD/backend ./dist;

