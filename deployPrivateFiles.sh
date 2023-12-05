#!/bin/bash

# Set the source and destination directories
SOURCE_DIR="/home/Phearion/sushiPrivate"
DEST_DIR="$(pwd)/assets"

# if the destination directory does not exist, create it
if [ ! -d "$DEST_DIR" ]; then
  mkdir -p "$DEST_DIR"
fi

# Copy files and directories recursively except .env
rsync -av --exclude='.env' "$SOURCE_DIR/" "$DEST_DIR"


# Add .env to root dist
cp "$SOURCE_DIR/.env" "$(pwd)/.env"
