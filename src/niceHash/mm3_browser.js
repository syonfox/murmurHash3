const strToBuf = TextEncoder.prototype.encode.bind(new TextEncoder());
const hexLUT = Array.from({ length: 256 }, (_, i) => `00${i.toString(16)}`.slice(-2));
function bufToHex(buf = new Uint8Array(0)) {
    let str = "";
    for (let i = 0; i < buf.byteLength; i++) {
        str += hexLUT[buf[i]];
    }
    return str;
}
function add64(m, n) {
    const ms = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    const ns = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    const os = [0x0, 0x0, 0x0, 0x0];
    os[3] += ms[3] + ns[3];
    os[2] += os[3] >>> 16;
    os[3] &= 0xffff;
    os[2] += ms[2] + ns[2];
    os[1] += os[2] >>> 16;
    os[2] &= 0xffff;
    os[1] += ms[1] + ns[1];
    os[0] += os[1] >>> 16;
    os[1] &= 0xffff;
    os[0] += ms[0] + ns[0];
    os[0] &= 0xffff;
    return [(os[0] << 16) | os[1], (os[2] << 16) | os[3]];
}
function mul64(m, n) {
    const ms = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    const ns = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    const os = [0x0, 0x0, 0x0, 0x0];
    os[3] += ms[3] * ns[3];
    os[2] += os[3] >>> 16;
    os[3] &= 0xffff;
    os[2] += ms[2] * ns[3];
    os[1] += os[2] >>> 16;
    os[2] &= 0xffff;
    os[2] += ms[3] * ns[2];
    os[1] += os[2] >>> 16;
    os[2] &= 0xffff;
    os[1] += ms[1] * ns[3];
    os[0] += os[1] >>> 16;
    os[1] &= 0xffff;
    os[1] += ms[2] * ns[2];
    os[0] += os[1] >>> 16;
    os[1] &= 0xffff;
    os[1] += ms[3] * ns[1];
    os[0] += os[1] >>> 16;
    os[1] &= 0xffff;
    os[0] += ms[0] * ns[3] + ms[1] * ns[2] + ms[2] * ns[1] + ms[3] * ns[0];
    os[0] &= 0xffff;
    return [(os[0] << 16) | os[1], (os[2] << 16) | os[3]];
}
function rol64(n, r) {
    r %= 64;
    if (r === 32) {
        return [n[1], n[0]];
    }
    else if (r < 32) {
        return [(n[0] << r) | (n[1] >>> (32 - r)), (n[1] << r) | (n[0] >>> (32 - r))];
    }
    else {
        r -= 32;
        return [(n[1] << r) | (n[0] >>> (32 - r)), (n[0] << r) | (n[1] >>> (32 - r))];
    }
}
function shl64(n, s) {
    s %= 64;
    if (s === 0) {
        return n;
    }
    else if (s < 32) {
        return [(n[0] << s) | (n[1] >>> (32 - s)), n[1] << s];
    }
    else {
        return [n[1] << (s - 32), 0x0];
    }
}
function xor64(a, b) {
    return [a[0] ^ b[0], a[1] ^ b[1]];
}
function x64fmix64(h) {
    h = xor64(h, [0x0, h[0] >>> 1]);
    h = mul64(h, [0xff51afd7, 0xed558ccd]);
    h = xor64(h, [0x0, h[0] >>> 1]);
    h = mul64(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = xor64(h, [0x0, h[0] >>> 1]);
    return h;
}
const x64hash128c1 = [0x87c37b91, 0x114253d5];
const x64hash128c2 = [0x4cf5ad43, 0x2745937f];
function x64mix128(h1, h2, k1, k2) {
    k1 = mul64(k1, x64hash128c1);
    k1 = rol64(k1, 31);
    k1 = mul64(k1, x64hash128c2);
    h1 = xor64(h1, k1);
    h1 = rol64(h1, 27);
    h1 = add64(h1, h2);
    h1 = add64(mul64(h1, [0x0, 5]), [0x0, 0x52dce729]);
    k2 = mul64(k2, x64hash128c2);
    k2 = rol64(k2, 33);
    k2 = mul64(k2, x64hash128c1);
    h2 = xor64(h2, k2);
    h2 = rol64(h2, 31);
    h2 = add64(h2, h1);
    h2 = add64(mul64(h2, [0x0, 5]), [0x0, 0x38495ab5]);
    return [h1, h2];
}

/**
 * MurmurHash3 is a non-cryptographic hash function designed for fast and high-quality hashing. It was created by Austin Appleby in 2011 and is known for its efficiency in various applications, particularly in data processing tasks.
 * 128-bit Hash: Offers a larger hash value, enhancing uniqueness and reducing collision chances.
 * MurmurHash3_x64_128	Best performance on 64-bit systems.	128-bit Output
 * @param buf
 * @param state
 * @param finalize
 * @return {{h1: *, h2: *, len: *, rem: Uint8Array}|string|Uint8Array}
 */
function x64hash128(buf = new Uint8Array(0), state = 0x0, finalize = true) {
    let str;
    if (typeof buf === "string") {
        buf = strToBuf(buf);
        str = true;
    }
    else {
        str = false;
    }
    let h1;
    let h2;
    let i;
    let len;
    if (typeof state === "number") {
        h1 = [0x0, state];
        h2 = [0x0, state];
        i = 0;
        len = 0;
    }
    else {
        ({ h1, h2, len } = state);
        const rem = state.rem;
        if (rem.byteLength === 0) {
            i = 0;
        }
        else if (rem.byteLength + buf.byteLength >= 16) {
            len += 16;
            i = 16 - rem.byteLength;
            const blk = new Uint8Array(16);
            const dtv = new DataView(blk.buffer);
            blk.set(rem);
            blk.set(buf.subarray(0, i), rem.byteLength);
            [h1, h2] = x64mix128(h1, h2, [dtv.getUint32(4, true), dtv.getUint32(0, true)], [dtv.getUint32(12, true), dtv.getUint32(8, true)]);
        }
        else {
            const newBuf = new Uint8Array(buf.byteLength + rem.byteLength);
            newBuf.set(rem);
            newBuf.set(buf, rem.byteLength);
            buf = newBuf;
            i = 0;
        }
    }
    const dtv = new DataView(buf.buffer, buf.byteOffset);
    const remainder = (buf.byteLength - i) % 16;
    const bytes = buf.byteLength - i - remainder;
    len += bytes;
    for (; i < bytes; i += 16) {
        [h1, h2] = x64mix128(h1, h2, [dtv.getUint32(i + 4, true), dtv.getUint32(i, true)], [dtv.getUint32(i + 12, true), dtv.getUint32(i + 8, true)]);
    }
    if (!finalize) {
        return {
            h1,
            h2,
            len,
            rem: buf.subarray(buf.byteLength - remainder),
        };
    }
    else {
        len += remainder;
        let k1 = [0x0, 0x0];
        let k2 = [0x0, 0x0];
        switch (remainder) {
            case 15:
                k2 = xor64(k2, shl64([0x0, buf[i + 14]], 48));
            case 14:
                k2 = xor64(k2, shl64([0x0, buf[i + 13]], 40));
            case 13:
                k2 = xor64(k2, shl64([0x0, buf[i + 12]], 32));
            case 12:
                k2 = xor64(k2, shl64([0x0, buf[i + 11]], 24));
            case 11:
                k2 = xor64(k2, shl64([0x0, buf[i + 10]], 16));
            case 10:
                k2 = xor64(k2, shl64([0x0, buf[i + 9]], 8));
            case 9:
                k2 = xor64(k2, [0x0, buf[i + 8]]);
                k2 = mul64(k2, x64hash128c2);
                k2 = rol64(k2, 33);
                k2 = mul64(k2, x64hash128c1);
                h2 = xor64(h2, k2);
            case 8:
                k1 = xor64(k1, shl64([0x0, buf[i + 7]], 56));
            case 7:
                k1 = xor64(k1, shl64([0x0, buf[i + 6]], 48));
            case 6:
                k1 = xor64(k1, shl64([0x0, buf[i + 5]], 40));
            case 5:
                k1 = xor64(k1, shl64([0x0, buf[i + 4]], 32));
            case 4:
                k1 = xor64(k1, shl64([0x0, buf[i + 3]], 24));
            case 3:
                k1 = xor64(k1, shl64([0x0, buf[i + 2]], 16));
            case 2:
                k1 = xor64(k1, shl64([0x0, buf[i + 1]], 8));
            case 1:
                k1 = xor64(k1, [0x0, buf[i]]);
                k1 = mul64(k1, x64hash128c1);
                k1 = rol64(k1, 31);
                k1 = mul64(k1, x64hash128c2);
                h1 = xor64(h1, k1);
        }
        h1 = xor64(h1, [0x0, len & 0xffffffff]);
        h2 = xor64(h2, [0x0, len & 0xffffffff]);
        h1 = add64(h1, h2);
        h2 = add64(h2, h1);
        h1 = x64fmix64(h1);
        h2 = x64fmix64(h2);
        h1 = add64(h1, h2);
        h2 = add64(h2, h1);
        const hash = new DataView(new ArrayBuffer(16));
        hash.setUint32(0, h1[0], false);
        hash.setUint32(4, h1[1], false);
        hash.setUint32(8, h2[0], false);
        hash.setUint32(12, h2[1], false);
        return str ? bufToHex(new Uint8Array(hash.buffer)) : new Uint8Array(hash.buffer);
    }
}

/**
 * MurmurHash3 (x64 128-bit) for multiple input types, normalized to bytes first.
 *
 * Normalization rules:
 * - If `input` is a string:
 *   - If it’s a Data URI with `;base64,` → decode base64 bytes.
 *   - Else if it looks like hex (even length, only hex chars) → decode hex bytes.
 *   - Else if it looks like base64 → decode base64 bytes.
 *   - Else → treat it as UTF-8 text and hash its UTF-8 bytes.
 * - If `input` is not a string:
 *   - Convert it to a deterministic JSON byte representation via `JSON.stringify`.
 *   - Hash the UTF-8 bytes of that JSON text.
 * - If you pass bytes directly (Buffer/Uint8Array/ArrayBuffer) it will hash those raw bytes.
 *
 * @param {any} input - Value to hash.
 * @param {number} [seed=0] - 32-bit seed used by the MurmurHash3 implementation.
 * @returns {string|number} Whatever `x64hash128(buf, seed)` returns for your library.
 */
function murmurhash3(input, seed = 0) {
    const { bytes } = normalizeToBytesAndKind(input);
    return x64hash128(bytes, seed);
}

/**
 * Detect the kind of `input` and return normalized bytes (`Uint8Array`).
 *
 * Kinds:
 * - "dataUriBase64" | "hex" | "base64" | "utf8String" | "bytes" | "json"
 *
 * @param {any} input
 * @returns {{ kind: string, bytes: Uint8Array }}
 */
function normalizeToBytesAndKind(input) {
    // --- bytes ---
    if (isUint8Array(input)) return { kind: "bytes", bytes: input };

    if (typeof Buffer !== "undefined" && Buffer.isBuffer?.(input)) {
        // Node Buffer -> Uint8Array view without copying
        return {
            kind: "bytes",
            bytes: new Uint8Array(input.buffer, input.byteOffset, input.byteLength),
        };
    }

    if (input instanceof ArrayBuffer) return { kind: "bytes", bytes: new Uint8Array(input) };

    // --- string-like ---
    if (typeof input === "string") {
        // Data URI: data:<mime>;base64,<data>
        if (input.startsWith("data:")) {
            const idx = input.indexOf(";base64,");
            if (idx !== -1) {
                const b64 = input.slice(idx + ";base64,".length);
                return { kind: "dataUriBase64", bytes: base64ToBytes(b64) };
            }
            // If it's a data URI but not base64, fall through to UTF-8 text behavior.
        }

        const s = input.trim();

        if (looksLikeHex(s)) {
            return { kind: "hex", bytes: hexToBytes(s) };
        }

        if (looksLikeBase64(s)) {
            return { kind: "base64", bytes: base64ToBytes(s) };
        }

        // Default: UTF-8 string bytes
        return { kind: "utf8String", bytes: utf8ToBytes(s) };
    }

    // --- everything else: JSON ---
    // Determinism: JSON.stringify depends on property insertion order in objects.
    // If you need fully canonical JSON ordering, tell me and I’ll add a canonicalizer.
    const json = JSON.stringify(input);
    return { kind: "json", bytes: utf8ToBytes(json) };
}

// ----------------- helpers -----------------

function isUint8Array(x) {
    return x instanceof Uint8Array;
}

function utf8ToBytes(str) {
    // Works in modern browsers and Node (global TextEncoder exists in both).
    return new TextEncoder().encode(str);
}

function hexToBytes(hex) {
    let s = hex.trim().toLowerCase();
    if (s.startsWith("0x")) s = s.slice(2);
    if (s.length % 2 !== 0) throw new Error("Hex string must have even length");

    const out = new Uint8Array(s.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}

function base64ToBytes(b64) {
    const s = b64.trim().replace(/[\r\n\s]/g, "");

    // Node path (Buffer typically exists)
    if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
        return new Uint8Array(Buffer.from(s, "base64"));
    }

    // Browser path
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

function looksLikeHex(s) {
    // allow optional 0x prefix
    const t = s.startsWith("0x") ? s.slice(2) : s;
    if (t.length === 0) return false;
    if (t.length % 2 !== 0) return false;
    return /^[0-9a-fA-F]+$/.test(t);
}

function looksLikeBase64(s) {
    // Heuristic: base64 length % 4 can be 0, 2, or 3 (with padding)
    // We accept missing padding to be forgiving.
    if (s.length === 0) return false;
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(s)) return false;

    const mod = s.length % 4;
    if (mod === 1) return false;

    return true;
}


// hex -> base64 (fast-ish, minimal helpers)
function hexToBase64(hex) {
    hex = hex.trim();
    if (hex.startsWith("0x") || hex.startsWith("0X")) hex = hex.slice(2);
    const n = hex.length;
    const m = n >> 1;

    // decode hex -> bytes
    const bytes = new Uint8Array(m);
    for (let i = 0, j = 0; i < n; i += 2, j++) {
        const c1 = hex.charCodeAt(i);
        const c2 = hex.charCodeAt(i + 1);
        const v1 = c1 & 15; // works for 0-9a-fA-F
        const v2 = c2 & 15;
        bytes[j] = (v1 << 4) | v2;
    }

    // encode bytes -> base64
    if (typeof Buffer !== "undefined") {
        return Buffer.from(bytes).toString("base64");
    }

    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
}


/**
 * Convert bytes to lowercase hex string.
 * @param {Uint8Array|Buffer|ArrayBuffer} bytes
 * @returns {string}
 */
function bytesToHex(bytes) {
    let u8;

    if (typeof Buffer !== "undefined" && Buffer.isBuffer?.(bytes)) {
        u8 = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    } else if (bytes instanceof Uint8Array) {
        u8 = bytes;
    } else if (bytes instanceof ArrayBuffer) {
        u8 = new Uint8Array(bytes);
    } else {
        throw new Error("bytesToHex: expected Uint8Array, Buffer, or ArrayBuffer");
    }

    let hex = "";
    for (let i = 0; i < u8.length; i++) {
        hex += u8[i].toString(16).padStart(2, "0");
    }
    return hex;
}


murmurhash3.utils = {
    base64ToBytes,hexToBytes,utf8ToBytes,
    looksLikeBase64, looksLikeHex,
    normalizeToBytesAndKind, bytesToHex, hexToBase64
}
window.mm3 = { bufToHex, strToBuf, x64hash128, murmurhash3,
    base64ToBytes,hexToBytes,utf8ToBytes,
    looksLikeBase64, looksLikeHex,
    normalizeToBytesAndKind, bytesToHex, hexToBase64
};
// export default x64hash128;
// this has been slimmed down to only the 128b 64bit hash method. directly from the murmur3-ts implementation build output.