export function numberWithCommas(x) {
    if (x === undefined) {
        return ""
    }
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export function floatToStr(floatNo, maxPrecision = 8) {
    return parseFloat(floatNo.toPrecision(maxPrecision)).toString()
}