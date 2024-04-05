function hexZeroPad(value, length) {
    if (typeof(value) !== "string") {
        throw new Error('allow only string')
    } else if (!isHexString(value, length)) {
        throw new Error("invalid hex string");
    }

    if (value.length > 2 * length + 2) {
        throw new Error("value out of range");
    }

    while (value.length < 2 * length + 2) {
        value = "0x0" + value.substring(2);
    }

    return value;
}

function isHexString(value, length) {
    if (typeof(value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false
    }
    if (length && value.length !== 2 + 2 * length) { return false; }
    return true;
}

function asciiToHex(str){
    let hexString = '';
    for (let i = 0; i < str.length; i += 1) {
        const hexCharCode = str.charCodeAt(i).toString(16);
        hexString += hexCharCode.length % 2 !== 0 ? `0${hexCharCode}` : hexCharCode;
    }
    return `0x${hexString}`;
}

function stringToByte(value, byteLength){
    return hexZeroPad(asciiToHex(value), byteLength); 
}

module.exports = stringToByte;