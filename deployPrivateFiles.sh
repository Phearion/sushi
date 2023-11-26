#!/bin/bash

# Set the source and destination directories
SOURCE_DIR="/home/Phearion/aniaPrivate"
DEST_DIR="$(pwd)/src/assets"

# if the destination directory does not exist, create it
if [ ! -d "$DEST_DIR" ]; then
  mkdir -p "$DEST_DIR"
fi

# Copy files and directories recursively
cp -a "$SOURCE_DIR"/* "$DEST_DIR"