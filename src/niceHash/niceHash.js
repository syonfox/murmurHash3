import {bufToHex, strToBuf, x64hash128} from "./mm3.js";

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
        return { hashHex: hash, hashBase64: base64String };

}

function b16tob64(hexString) {
  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  return btoa(String.fromCharCode.apply(null, byteArray));
}

async function niceHash(str , byte1= "=", byte2 = "=", byte3 = "=") {
  let mm = await generateMM128(str);
  let sh = await generateSHA256(str);

  let nh = {
    mm3128: mm,
    sha256: sh
  }

  nh.nh = nh.mm3128.hashBase64 + "#" + nh.sha256.hashBase64;
  nh.no = nh.mm3128.hashBase64.substring(0, 22) + byte1 + byte2 + "#" + nh.sha256.hashBase64.substring(0,43) +byte3;

  return nh
}


var val = niceHash("foobar", "A", "B", "C").then(nh=>{
  console.log("foobar: ", nh);
})


function ll2h3(lat, lon) {

}
function h32ll(h3) {

}

function reqloctime(req, loc, time) {
  //a request
  //

}


