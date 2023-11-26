#!/bin/bash

# Set the source and destination directories
SOURCE_DIR="/home/Phearion/aniaPrivate"
DEST_DIR="$(pwd)/src/assets"

# Copy files and directories recursively
cp -a "$SOURCE_DIR"/* "$DEST_DIR"