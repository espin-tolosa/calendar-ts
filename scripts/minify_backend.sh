#!/bin/sh

# set source directory
if [ "$1" = "" ]
then
  echo "Usage: $0 <source directory>"
  exit
fi

COUNT=0;
SOURCE_DIR="$1"
DEST_DIR="$1-minified"

# create destination directory and copy source files
rm -Rf ${DEST_DIR}
cp -r "${SOURCE_DIR}" "${DEST_DIR}"

# remove development files or any unneded in production
rm -Rf $DEST_DIR/composer.json  $DEST_DIR/composer.lock  $DEST_DIR/install.sh  $DEST_DIR/MySQL $DEST_DIR/Tests

# iterate through php source files, compressing them and writing the output to the destination
for FILENAME in `echo $(find ${DEST_DIR} -name "*.php")`
do
    COUNT=$((COUNT+1))
    php -w ${FILENAME} > "${FILENAME}_TEMP"
    mv "${FILENAME}_TEMP" "${FILENAME}"
done



sizeBefore=$(du -h -c ${SOURCE_DIR} | tail -1 | tr -d 'total' | tr -d ' ');
sizeAfter=$(du -h -c ${DEST_DIR} | tail -1 | tr -d 'total' | tr -d ' ');

# finished
echo "Finished - $COUNT PHP files minified"
echo "Size Before: $sizeBefore"
echo "Size After: $sizeAfter"

rm -Rf $SOURCE_DIR
mv $DEST_DIR $SOURCE_DIR





