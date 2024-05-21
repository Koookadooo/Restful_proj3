#!/bin/bash

# Ensure the script exits if a command fails
set -e

# Run the Node.js test file
echo "Running tests/test.js..."
node tests/test.js

# Print a success message
echo "Tests completed successfully!"