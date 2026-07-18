#!/bin/bash

# Check if input file is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <input_file.js>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.js}.umd.js"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: File '$INPUT_FILE' not found."
    exit 1
fi

# Read the input file
CONTENT=$(cat "$INPUT_FILE")

# Remove all export statements (if any)
CONTENT_NO_EXPORTS=$(echo "$CONTENT" | awk '{gsub(/export\s+({|default\s+|)\s*/, ""); gsub(/export\s+/, ""); print}')

# Manually specify the functions to expose (replace with your actual list)
FUNCTIONS="bufToHex, strToBuf, x64hash128, murmurhash3, base64ToBytes, hexToBytes, utf8ToBytes, looksLikeBase64, looksLikeHex, normalizeToBytesAndKind, bytesToHex, hexToBase64"

# Generate the UMD wrapper
UMD_WRAPPER="(
function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.mm3 = factory();
  }
}(this, function () {
  ${CONTENT_NO_EXPORTS}

  // Return all functions as an object
  return {
    $(echo "$FUNCTIONS" | sed 's/,/,\n    /g' | sed 's/^/    /')
  };
})
);"

# Write the UMD-wrapped content to the output file
echo "$UMD_WRAPPER" > "$OUTPUT_FILE"

echo "Converted $INPUT_FILE to $OUTPUT_FILE"