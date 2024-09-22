let SOCKET_SERVER = process.env.WS_SERVER || "wss://api.kaspa.org";
let SUFFIX = ""
let API_SERVER = process.env.REACT_APP_API_SERVER || ""
let ADDRESS_PREFIX = "kaspa:"
let KASPA_UNIT = "KAS"

let BPS = 1


switch (process.env.REACT_APP_NETWORK) {
    case "testnet-10":
        SOCKET_SERVER = "wss://api-tn10.kaspa.org";
        ADDRESS_PREFIX = "kaspatest:"
        if (!API_SERVER) {
            API_SERVER = "https://api-tn10.kaspa.org"
        }
        SUFFIX = " TN10"
        KASPA_UNIT = "TKAS"
        break;
    case "testnet-11":
        SOCKET_SERVER = "wss://api-tn11.kaspa.org";
        ADDRESS_PREFIX = "kaspatest:"
        if (!API_SERVER) {
            API_SERVER = "https://api-tn11.kaspa.org"
        }
        SUFFIX = " TN11"
        KASPA_UNIT = "TKAS"
        BPS = 10
        break;

    // mainnet
    default:
        SOCKET_SERVER = "wss://api.kaspa.org";
        if (!API_SERVER) {
            API_SERVER = "https://api.kaspa.org"
        }
        break;
}

export { SOCKET_SERVER, SUFFIX, API_SERVER, ADDRESS_PREFIX, BPS, KASPA_UNIT }