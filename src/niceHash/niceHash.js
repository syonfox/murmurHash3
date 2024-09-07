import {bufToHex, strToBuf, x64hash128} from "./mm3.js";

/**
 *  THis function uses web crypto to generate a standards sha256 secure hash of an string.
 *
 * @param inputText
 * @returns {Promise<{hashBase64: string, hashHex: string}>}
 */
async function generateSHA256(inputText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputText);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashBase64 = b16tob64(hashHex);
  return {hashHex, hashBase64};
}

async function generateMM128(inputText) {
  const hash = x64hash128(inputText);
  const base64String = b16tob64(hash);
  return {hashHex: hash, hashBase64: base64String};
}

function b16tob64(hexString) {
  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  return btoa(String.fromCharCode.apply(null, byteArray));
}

/**
 * This function allows the encoding of a nice hash both murmur and sha256
 * @param str
 * @param byte1 -- to encode data in b64 padding
 * @param byte2
 * @param byte3
 * @returns {Promise<{sha256: {hashBase64: string, hashHex: string}, mm3128: {hashBase64: string, hashHex: {len: *, h1: *, h2: *, rem: Uint8Array}|string|Uint8Array}}>}
 */
async function niceHash(str, byte1 = "=", byte2 = "=", byte3 = "=") {
  let mm = await generateMM128(str);
  let sh = await generateSHA256(str);

  let nh = {
    mm3128: mm,
    sha256: sh,
  };

  nh.nh = nh.mm3128.hashBase64 + "#" + nh.sha256.hashBase64;
  nh.no =
    nh.mm3128.hashBase64.substring(0, 22) + // chop of the padding
    byte1 + // add our own
    byte2 +
    "#" +
    nh.sha256.hashBase64.substring(0, 43) +
    byte3;

  return nh; // resuly is a 69 char string ... nice.
}

function parseHash(h) {
  let mm64 =  h.substring(0, 22) + "=="
  let sha256 =  h.substring(26, 68) + "=";
  let b = [ h.substring(22, 23), h.substring(23, 24), h.substring(68, 69)]
  return {sha256, mm3128: mm64, b}
}


async function testNH() {
  var val = await niceHash("foobar", "A", "B", "C").then((nh) => {
    console.log("foobar: ", nh);

    let dec = parseHash(nh.no)
    console.log(dec)

    console.assert(dec.b[2] == "B")
  });


}

testNH()

function ll2h3(ll) {
  return h3.latLngToCell(ll.lat, ll.lng, 14);
}

function h32ll(h3cell) {
  return h3.cellToLatLng(h3cell);
}

function reqloctime(req, loc, time) {
  //a request
  //
}
