
let murmurHash3 = require("murmurHash3")
let murmur = {
    murmurHash3,
    seed: 42,
    hash128: murmurHash3.x86.hash128()
}

