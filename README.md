# Endpoint MurmurHash3

### emh3

WHO WHAT WHY WHEN WHERE HOW

#### Who 

i think Andrew made it originally and syonfox maintains this repo

<details>
<summary>
Who
</summary>

#### What

a non crypto hash function that is pretty dar random exept for repatitions.

#### Why

becuse we liked the name murmur

#### When   
  
  MurmurHash3 was created by Austin Appleby and completed on April 3, 2011.
  
#### Where

There isn’t any reliable, publicly documented information I can find that says where Austin Appleby was working or what university/employment he was in around the time MurmurHash3 was completed (April 3, 2011). The main public references I’m seeing just describe that he created MurmurHash (and MurmurHash3) but don’t include a timeline of his schooling or job status. 

#### How

ok i read his blog and it sounded like he wanted a hash function in 10 instructions of asembaly

so how the need for speed made a function thats fast.

maybe that is the why also

```shell


    tanjent
    Subscribe

    March 3 2008, 13:31

0
300
MurmurHash, final version.
UPDATE - If you're reading this via a link from Google or Reddit, please go here - http://murmurhash.googlepages.com. All future updates about MurmurHash will be posted there.

UPDATEUPDATE - MurmurHash is now at version 2.0. The new version uses a different mix function than the below that is much faster & mixes better. Code is on the website linked above.





OK, I'm done with this for the time being. Figured out a clever way to generate and test mixing constants and found a much better one, replaced the "h ^= data" with "h += data" (very slightly better collision resistance), and ended up removing the rotate instruction and replacing with a shift-xor (should I rename it MusxmusxHash?).

This version passes Jenkin's frog.c torture-test up to 2^25 keypairs (beats Hsieh's 2^17; previous Murmur failed after 2^9), distribution is still excellent (only 3 collisions on the SCOWL english-words.95 list vs. Hsieh's 41), and still runs faster than Hsieh and Jenkins at 1300 mb/sec vs. their ~900 mb/sec.

You should be able to use this hash function anywhere you like with very good results. I'll work on getting it posted up to interesting places this week.

Performance results from Hsieh's test app -

CRC32           :  4.7810s
oneAtATimeHash  :  3.5470s
alphaNumHash    :  2.2500s
FNVHash         :  2.1870s
Jenkins lookup3 :  1.2650s
SuperFastHash   :  1.2970s
MurmurHash      :  0.9060s



-tanjent


//-------------------------------------------------------------------
unsigned int MurmurHash ( const unsigned char * data, int len, unsigned int h )
{
	const unsigned int m = 0x7fd652ad;
	const int r = 16;
 
	h += 0xdeadbeef;

	while(len >= 4)
	{
		h += *(unsigned int *)data;
		h *= m;
		h ^= h >> r;

		data += 4;
		len -= 4;
	}

	switch(len)
	{
	case 3:
		h += data[2] << 16;
	case 2:
		h += data[1] << 8;
	case 1:
		h += data[0];
		h *= m;
		h ^= h >> r;
	};

	h *= m;
	h ^= h >> 10;
	h *= m;
	h ^= h >> 17;

	return h;
}

```

</summary>
</details>




# Original Readme Of MurMurhash TS project

## your milage may very

```shell
git clone this repo

cd murmurHash3

npm install

npm run build


```



# Original Readme
v1 deploy   

https://ad214310.murmurhash3.pages.dev/dist/cjs/index.js

https://ad214310.murmurhash3.pages.dev/dist/esm/index.js



# MurmurHash3 (TS)


## Usage

```

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


- - -

Requires [`TextEncoder`](https://caniuse.com/#feat=textencoder),
[Typed Arrays & `DataView`](https://caniuse.com/#feat=typedarrays), and additional
[es6/es2015](https://caniuse.com/#feat=es6) features; bring your own transpiler and
polyfills to target the past.
