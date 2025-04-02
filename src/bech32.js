/* global BigInt */

import {scriptPublicKeyToAddress} from "./kaspaAddresses.ts";

const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

const fromHex = (hex) => {
    let arr = [];
    for (let n = 0; n < hex.length; n += 2) {
        arr.push(parseInt(hex.substr(n, 2), 16))
    }
    return arr;
}

const toWords = (data) => {
    let value = 0;
    let bits = 0;
    const maxV = (1 << 5) - 1;
    const result = [];
    for (let i = 0; i < data.length; ++i) {
        value = (value << 8) | data[i];
        bits += 8;
        while (bits >= 5) {
            bits -= 5;
            result.push((value >> bits) & maxV);
        }
    }
    if (bits > 0) {
        result.push((value << (5 - bits)) & maxV);
    }
    return result;
}

const polymod = (values) => {
    let c = 1n
    for (let d of values) {
        let c0 = c >> 35n;
        c = ((c & 0x07ffffffffn) << 5n) ^ BigInt(d);
        if (c0 & 0x01n) c ^= 0x98f2bc8e61n;
        if (c0 & 0x02n) c ^= 0x79b76d99e2n;
        if (c0 & 0x04n) c ^= 0xf33e5fb3c4n;
        if (c0 & 0x08n) c ^= 0xae2eabe2a8n;
        if (c0 & 0x10n) c ^= 0x1e4f43e470n;
    }
    return c ^ 1n
}

const encodeAddress = (prefix, payload, version) => {
    let data = [version].concat(payload);

    let address = toWords(data)
    let checksum_num = polymod(
        [
            ...(Array.from(prefix).map((c) => c.charCodeAt(0) & 0x1f)),
            0,
            ...address,
            0, 0, 0, 0, 0, 0, 0, 0
        ]
    );
    let checksum = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 8; i++) {
        checksum[7 - i] = Number((checksum_num >> 5n * BigInt(i)) & 0x1fn);
    }
    return prefix + ":" + [...address, ...checksum].map((c) => charset[c]).join("")
}


export const parsePayload = (payload) => {
    if (payload === null) return ["", ""];

    let buffer = fromHex(payload);
    let version = buffer[16];
    const length = buffer[18];
    let script = buffer.slice(19, 19 + length);

    const scriptHex = Buffer.from(script).toString('hex')

    if (script[0] == 0xaa) {
        version = 8;
        script = script.slice(1, script.length);
    }
    if (script[0] < 0x76) {
        const address_size = script[0];
        let address = script.slice(1, address_size + 1);
        return [scriptPublicKeyToAddress(scriptHex), String.fromCharCode(...buffer.slice(19 + length, buffer.length))];
    }
    return [payload, ""];
}