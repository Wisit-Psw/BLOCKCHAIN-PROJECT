const crypto = require('crypto');

function hashSha256(value, length){
    crypto.createHash('sha256', process.env.HASH_SECRET).update(value).digest().toString().substring(0, length)
}

module.exports = hashSha256;