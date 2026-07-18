
// export { bufToHex, strToBuf, x64hash128, murmurhash3};
import { bufToHex, strToBuf, x64hash128, murmurhash3, bytesToHex, hexToBytes, hexToBase64} from "./mm3.js"


// Test vectors
const ascendingBuf =
    "\x00\x01\x02\x03\x04\x05\x06\x07" +
    "\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f" +
    "\x10\x11\x12\x13\x14\x15\x16\x17" +
    "\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f" +
    "\x20\x21\x22\x23\x24\x25\x26\x27" +
    "\x28\x29\x2a\x2b\x2c\x2d\x2e\x2f" +
    "\x30\x31\x32\x33\x34\x35\x36\x37" +
    "\x38\x39\x3a\x3b\x3c\x3d\x3e\x3f";

const testVectors = {
    "": [0, "00000000000000000000000000000000", "00000000000000000000000000000000"],
    [ascendingBuf]: [2303633163, "cc32c3983052e6520858cfaa82d82209", "ffd5522d8d812301a22238eb56338ea1"],
    [ascendingBuf.slice(0, 31)]: [1682074326, "24ab92eeac1d89ca45f5bc189ad5dda3", "053dd3e1a32cd0949ee59aefb4005490"],
    "I will not buy this record, it is scratched.": [2832214938, "a0a9683b25ac5e40d9af2895890dddf5", "c382657f9a06c49d4a71fdc6d9b0d48f"],
    "I will not buy this tobacconist's, it is scratched.": [1720269489, "9b5b7ba2ef3f7866889adeaf00f3f98e", "d30654abbd8227e367d73523f0079673"],
    "My hovercraft is full of eels.": [2953494853, "e3a186aee169ba6c6a8bd9343c68fa9c", "03e5e14d358c16d1e5ae86df7ed5cfcb"],
    "我的气垫船装满了鳗鱼。": [4193185573, "4a3b1d7c5f2763c2d6d5551f5f1e922f", "454d3f37ec1eb384ab6fb47de3d07525"],
    "My 🚀 is full of 🦎.": [1818098979, "e616d85ffee7f678dab461995b5bb90f", "d047391e58c6c9dfccde62c92e049f50"],
};


let results = Object.entries(testVectors).map(([k, v])=>{

    let x64mm3128 = v[2];


    let bytes = hexToBytes(x64mm3128)

    const bytesEqual = (a, b) =>  a.length === b.length && a.every((v, i) => v === b[i]);

    let hash = murmurhash3(k)
    let hex = bytesToHex(hash)
    let passed = hex === x64mm3128
    console.log("byteequals: ", bytesEqual(hash, bytes), `${k} -> 0x${hex} 
    base64: ${hexToBase64(hex)}`)
    console.assert(passed, `x64.hash128(${k}) should return 
    ${bytes} 0x${x64mm3128} <- expected
    ${hash} 0x${hex}<- received`);





    return passed

})

console.log(results)


// ---- trailing-zero-byte search benchmark ----
// Assumes:
// - murmurhash3(input) returns a Uint8Array (16 bytes for x64 128-bit)
// - bytes are compared directly

const { performance } = globalThis;

function trailingZeroByteCount(u8) {
    // counts number of 0x00 bytes at the end
    for (let i = u8.length - 1, c = 0; i >= 0; i--, c++) {
        if (u8[i] !== 0) return c;
    }
    return u8.length;
}

function findInputWithAtLeastNTrailingZeroBytes(n, maxIters = 5_000_000, seedStart = 0) {
    // Search over inputs deterministically (no extra libs)
    // You can change the generator if you prefer.
    let i = seedStart;
    for (; i < seedStart + maxIters; i++) {
        const input = `bench:${i}`;
        const h = murmurhash3(input); // Uint8Array (expected)
        if (trailingZeroByteCount(h) >= n) return { input, hash: h, iters: i - seedStart + 1 };
    }
    return null;
}

async function benchmarkTrailingZeros() {
    const k = 10; // average samples
    const maxIters = 200_000_000; // adjust if needed
    const results = [];

    for (let n = 0; n <= 5; n++) {
        let totalMs = 0;
        let totalIters = 0;

        for (let sample = 0; sample < k; sample++) {
            const seedStart = sample * 1_000_000_0; // different ranges per sample
            const t0 = performance.now();
            const found = findInputWithAtLeastNTrailingZeroBytes(n, maxIters, seedStart);
            const t1 = performance.now();

            if (!found) {
                console.log(`n=${n} sample=${sample}: not found within maxIters=${maxIters}`);
                totalMs += (t1 - t0);
                continue;
            }

            const ms = t1 - t0;
            totalMs += ms;
            totalIters += found.iters;

            console.log(
                `n=${n} sample=${sample}: ${found.input} | trailing>=${n} bytes | ` +
                `time=${ms.toFixed(2)}ms | iters=${found.iters}`
            );
        }

        results.push({
            n,
            avgMs: totalMs / k,
            avgIters: totalIters > 0 ? totalIters / k : null
        });
    }

    console.table(results);
}

benchmarkTrailingZeros();
