# NiceHash Guide for Experts

This guide is designed to help experts quickly get started with using the `niceHash` function, which generates a secure hash using both MurmurHash3 (128-bit) and SHA-256. The `niceHash` function combines these two hashes into a single compact representation, which is 69 characters long by default, and encodes part of the result in a customizable base64 format.

### Table of Contents
1. [Installation](#installation)
2. [Overview of Key Functions](#overview-of-key-functions)
    - `niceHash`
    - `parseHash`
    - `generateSHA256`
    - `generateMM128`
    - `b16tob64`
3. [Usage](#usage)
    - [Generating a NiceHash](#generating-a-nicehash)
    - [Parsing a NiceHash](#parsing-a-nicehash)
4. [Examples](#examples)
5. [Test Function](#test-function)

## Installation

To integrate this utility into your project, ensure that you have the necessary dependencies:
- **Web Crypto API** (for generating SHA-256)
- **MurmurHash3 (128-bit)** module (`mm3.js`), which should export `bufToHex`, `strToBuf`, and `x64hash128`.

Download the dependencies and place them in your project directory.

## Overview of Key Functions

### `niceHash(str, byte1, byte2, byte3)`
This function generates a dual hash of the input string using both SHA-256 and MurmurHash3 (128-bit). It returns a nicely formatted string that encodes these hashes.

- **Parameters**:
    - `str`: The string to be hashed.
    - `byte1`, `byte2`, `byte3`: Optional padding bytes to customize the base64-encoded result.

- **Returns**:
  A `Promise` that resolves to an object containing:
    - The base64 and hex encodings of the SHA-256 and MurmurHash3 (128-bit) hashes.
    - A custom base64 representation of the combined hash.

### `parseHash(h)`
This function parses the 69-character NiceHash result into its original components.

- **Parameters**:
    - `h`: The 69-character NiceHash string.

- **Returns**:
    - An object containing:
        - `sha256`: The SHA-256 base64 hash.
        - `mm3128`: The MurmurHash3 (128-bit) base64 hash.
        - `b`: An array of custom padding bytes used in the NiceHash.

### `generateSHA256(inputText)`
Generates a SHA-256 hash for a given string.

- **Parameters**:
    - `inputText`: The string to be hashed.

- **Returns**:
    - A `Promise` resolving to an object containing:
        - `hashHex`: The SHA-256 hash in hexadecimal format.
        - `hashBase64`: The SHA-256 hash in base64 format.

### `generateMM128(inputText)`
Generates a MurmurHash3 (128-bit) hash for a given string.

- **Parameters**:
    - `inputText`: The string to be hashed.

- **Returns**:
    - An object containing:
        - `hashHex`: The MurmurHash3 (128-bit) hash in hexadecimal format.
        - `hashBase64`: The MurmurHash3 (128-bit) hash in base64 format.

### `b16tob64(hexString)`
Converts a hexadecimal string to its base64 representation.

- **Parameters**:
    - `hexString`: A string of hexadecimal characters.

- **Returns**:
    - A base64-encoded string.

## Usage

### Generating a NiceHash
To generate a NiceHash, use the `niceHash` function. You can provide optional padding bytes to customize the base64 output.

```js
async function generateHashExample() {
  const nh = await niceHash("foobar", "A", "B", "C");
  console.log(nh);
}

generateHashExample();
```

This example will generate a NiceHash for the string `"foobar"` and use `"A"`, `"B"`, and `"C"` as padding.

### Parsing a NiceHash
To parse a NiceHash and extract its components (SHA-256 and MurmurHash3), use the `parseHash` function.

```js
function parseExample() {
  const nhString = "your_nicehash_string";
  const parsed = parseHash(nhString);
  console.log(parsed);
}

parseExample();
```

## Examples

### Example 1: Generate a NiceHash for `"example"`
```js
async function example1() {
  const nh = await niceHash("example", "X", "Y", "Z");
  console.log("NiceHash: ", nh.no);
  console.log("Components: ", nh);
}

example1();
```

### Example 2: Parse a NiceHash
```js
function example2() {
  const nhString = "your_nicehash_string";
  const parsed = parseHash(nhString);
  console.log("Parsed: ", parsed);
}

example2();
```

## Test Function

A basic test function is provided to validate that the NiceHash and its components are functioning correctly.

```js
async function testNH() {
  var val = await niceHash("foobar", "A", "B", "C").then((nh) => {
    console.log("foobar: ", nh);

    let dec = parseHash(nh.no)
    console.log(dec)

    console.assert(dec.b[0] == 'A')
    console.assert(dec.b[1] == 'B')
    console.assert(dec.b[2] == 'C')
    console.assert(dec.mm3128 == nh.mm3128.hashBase64)
    console.assert(dec.sha256 == nh.sha256.hashBase64)
  });
}

testNH();
```

This function generates a NiceHash for the string `"foobar"` and checks that the custom padding and hashes are correctly encoded and decoded.

## Conclusion
This guide provides a quick introduction to using the NiceHash function to generate secure and compact hashes. By leveraging both MurmurHash3 and SHA-256, you can ensure a balance between speed and cryptographic strength. The customizable base64 output allows for additional flexibility when integrating this utility into your projects.