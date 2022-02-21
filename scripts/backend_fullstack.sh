#!/bin/bash

# 1. Replace the backend repository in the compiled build (dist)
rm -r ./dist/backend
cp -r ../../php-server/CRUD/backend ./dist;

# 2. Copy the entire project to lamp server
cp -r /home/set/dev/projects/calendar/app/* /opt/lampp/htdocs/.

