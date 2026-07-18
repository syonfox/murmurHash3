# NiceHash Guide for Experts

hand crafted mm3.js  ESM module

mm3.umd.js // duh

mm3_browser.js // simple window hook

Idk what this is 

# Nice Hash 

todo document

... todo summarise and refine to gem

 <details>
 <summary>
 Gem Site Content
 </summary>
 
 //compile7.org/hashing/how-to-use-murmurhash-in-ruby/#installing-the-murmurhash-gem
 

# How to use MurmurHash in Ruby

How to use MurmurHash in Ruby
December 7, 2025
3 min read

When you need a fast, non-cryptographic hash function in Ruby for things like distributing traffic or implementing hash tables, MurmurHash is an excellent choice. This guide will walk you through integrating and using the murmurhash3 gem to generate 32-bit and 128-bit hashes. You'll learn how to quickly hash strings and numbers, understanding the basic parameters to control the output for various applications. By the end, you'll be able to leverage MurmurHash for efficient data distribution and indexing in your Ruby projects.
Installing the MurmurHash Gem

To begin using MurmurHash in your Ruby project, first add the murmurhash gem to your project's Gemfile.

# Gemfile
gem 'murmurhash'

After saving the Gemfile, navigate to your project's root directory in your terminal and run bundle install. This command fetches and installs the gem, making its functionality available to your application.

A common oversight is forgetting to run bundle install. If you try to use MurmurHash without this step, you'll likely encounter an uninitialized constant MurmurHash error, indicating the gem isn't loaded. Always remember to bundle after adding a new gem.
Basic Hashing with MurmurHash3

For 32-bit hashing in Ruby, you’ll primarily use the MurmurHash3::v32 class. This class provides a straightforward way to generate hash values from strings. You simply call the str method, passing the data you want to hash and an optional seed value. The seed allows you to generate different hash outputs for the same input data, which is useful for various applications like load balancing or creating distinct hash tables.

Here's a quick example:

require 'murmurhash'
string_to_hash = "my data to hash"
hashed_value = MurmurHash3::v32.str(string_to_hash, 0) # Using 0 as the seed
puts hashed_value

A common pitfall to watch out for is passing non-string objects directly to MurmurHash3::v32.str. Doing so will result in a TypeError. Always ensure your input is a string or can be reliably converted into one before hashing. This simple check prevents unexpected runtime errors.
Hashing Different Data Types

MurmurHash3 in Ruby offers flexibility by allowing you to hash raw byte arrays. This is particularly useful when you need precise control over how your data is interpreted before hashing. For strings, you can convert them into an array of byte values using the .bytes method or .unpack('C*').

For instance, hashing a string like "another piece of data" can be done by first getting its byte representation:

require 'murmurhash'
data = "another piece of data"
bytes_data = data.bytes
seed = 123
hashed_bytes = MurmurHash3::v32.bytes(bytes_data, seed)
puts hashed_bytes

A common pitfall arises when hashing strings containing multi-byte characters, such as UTF-8. If you hash the string directly without converting it to a consistent byte sequence, you might encounter different hash results depending on the underlying system or Ruby version's string encoding handling. Always ensure your input is a predictable byte array for consistent hashing results.
Understanding Hash Output and Usage

MurmurHash3 in Ruby generates a signed 32-bit integer. This hash value is incredibly useful for various applications, such as distributing data across a set of servers, creating unique cache keys, or implementing probabilistic data structures like Bloom filters.

For instance, to distribute user_session_123 across 10 buckets, you'd first compute its hash:

require 'murmurhash'
key = "user_session_123"
num_buckets = 10
cache_key_hash = MurmurHash3::v32.str(key, 42)
# Ensure positive index for modulo operation
bucket_index = (cache_key_hash % num_buckets + num_buckets) % num_buckets

puts "Hash for '#{key}': #{cache_key_hash}"
puts "Assigned to bucket: #{bucket_index}"

A common pitfall is directly using a negative hash value with the modulo operator. To avoid this, always normalize the hash to a positive value before the modulo operation. This ensures consistent bucket assignment, preventing errors from negative results.
  
   </details>





# File Here

welcome to nice hash  
  
  Well i spent so much time reading might as well write. 
  
  Today was a good day made a nice pasta^2
  
  ```
  a big pot of pasta
  
  mix half with cabage and onion
  
  mix the other half with a nice sauce
  
  cheers.
  ```
  
  now just read the code if im being honest but why did i end up here.
  
  I want ead a fast hash algorithim. that is random. 
  
  the non crypto error i read about is repeatitive values can cause colisions. ie hash and hashhash are mor likly to combind then 
  rand1234
  
  I guess maybe its a feature not a bug but how? 
  
  anyway on to the tests
  
  # `firefox ./mm3_browser_test2.html`


























# Context Aware

# Blank Lines
















































### Old ai guide

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