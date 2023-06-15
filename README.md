# MurmurHash3.ts

![License](https://img.shields.io/github/license/reemus-dev/MurmurHash3.ts?style=for-the-badge)
![Codecov](https://img.shields.io/codecov/c/github/reemus-dev/MurmurHash3.ts?style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/reemus-dev/MurmurHash3.ts/release.yml?style=for-the-badge)

![NPM Version](https://img.shields.io/npm/v/murmurhash3.ts?style=for-the-badge)
![NPM Bundle Size](https://img.shields.io/bundlephobia/min/murmurhash3.ts?style=for-the-badge)
![Type Definitions](https://img.shields.io/npm/types/murmurhash3.ts?style=for-the-badge)

## Usage

```javascript
> const murmurHash3 = require('murmurhash3.js');

// Return a 32bit hash as an unsigned integer:
> murmurHash3.x86.hash32("I will not buy this record, it is scratched.");
  2832214938

// Return a 128bit hash as a hexadecimal string:
> murmurHash3.x86.hash128("I will not buy this tobacconist's, it is scratched.");
  '9b5b7ba2ef3f7866889adeaf00f3f98e'
> murmurHash3.x64.hash128("I will not buy this tobacconist's, it is scratched.");
  'd30654abbd8227e367d73523f0079673'

// Specify a starting seed (defaults to 0x0):
> murmurHash3.x86.hash32("My hovercraft is full of eels.", 25);
  2520298415

// Hash buffers:
> const buf = new Uint8Array(Array.from({ length: 256}, (_, i) => i));
> murmurHash3.x86.hash32(buf);
  3825864278
> murmurHash3.x86.hash128(buf);
  Uint8Array [44, 86, 200, 143, 219, 69, 3, 223, 211, 82, 178, 26, 73, 76, 162, 192];

// Progressively hash streams of data as either buffers or strings:
> const state32 = murmurHash3.x86.hash32(buf.slice(0, 127), 0x0, false);
> murmurHash3.x86.hash32(buf.slice(127), state32, true);
  3825864278
> const state128 = murmurHash3.x86.hash128(buf.slice(0, 127), 0x0, false);
> murmurHash3.x86.hash128(buf.slice(127), state128, true);
  Uint8Array [44, 86, 200, 143, 219, 69, 3, 223, 211, 82, 178, 26, 73, 76, 162, 192];
```


## API

```javascript
murmurHash3 = {
  strToBuf: (str: string = ""
):
Uint8Array,
  bufToHex
:
(buf: Uint8Array = new Uint8Array(0)
):
string,
  x86
:
{
  hash32: (
    buf: Uint8Array | string = new Uint8Array(0),
    state
:
  U32 | X86Hash32State = 0x0,
    finalize
:
  boolean = true,
):
  U32 | X86Hash32State,
    hash128
:
  (
    buf: Uint8Array | string = new Uint8Array(0),
    state
:
  U32 | X86Hash128State = 0x0,
    finalize
:
  boolean = true
):
  Uint8Array | string | X86Hash128State,
}
,
x64: {
  hash128: (
    buf: Uint8Array | string = new Uint8Array(0),
    state
:
  U32 | X64Hash128State = 0x0,
    finalize
:
  boolean = true
):
  Uint8Array | string | X64Hash128State,
}
,
}
```


- - -

Requires [`TextEncoder`](https://caniuse.com/#feat=textencoder),
[Typed Arrays & `DataView`](https://caniuse.com/#feat=typedarrays), and additional
[es6/es2015](https://caniuse.com/#feat=es6) features; bring your own transpiler and
polyfills to target the past.
