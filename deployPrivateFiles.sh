#!/bin/bash

# Set the source and destination directories
SOURCE_DIR="/home/Phearion/sushiPrivate"
DEST_DIR="$(pwd)/src/assets"

# if the destination directory does not exist, create it
if [ ! -d "$DEST_DIR" ]; then
  mkdir -p "$DEST_DIR"
fi

# Add .env to root dist
cp "$SOURCE_DIR/.env" "$(pwd)/.env"

# Copy everything inside the source directory to the destination directory (except .env)
cp -r "$SOURCE_DIR/." "$DEST_DIR"

# Remove the .env file from the destination directory
rm "$DEST_DIR/.env"

