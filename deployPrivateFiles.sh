#!/bin/bash

# Set the source and destination directories
SOURCE_DIR="/home/Phearion/sushiPrivate"
DEST_DIR="$(pwd)/src/assets"

# Print out the contents of the source directory
echo "Contents of the source directory before copy:"
ls -la "$SOURCE_DIR"

# if the destination directory does not exist, create it
if [ ! -d "$DEST_DIR" ]; then
  mkdir -p "$DEST_DIR"
fi

# After copy
echo "Contents of the destination directory after copy:"
ls -la "$DEST_DIR"

# Copy files and directories recursively except .env
rsync -av --exclude=".env" "$SOURCE_DIR"/* "$DEST_DIR"
# Add .env to root dist
cp "$SOURCE_DIR/.env" "$(pwd)/.env"
