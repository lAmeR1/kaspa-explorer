export let SOCKET_SERVER = process.env.WS_SERVER || "wss://api.kaspa.org";
export let SUFFIX = ""
export let API_SERVER = process.env.API_SERVER || ""
export let ADDRESS_PREFIX = "kaspa:"


switch (process.env.NETWORK) {
    case "testnet-10":
        SOCKET_SERVER = "wss://api-tn10.kaspa.org";
        ADDRESS_PREFIX = "kaspatest:"
        if (!API_SERVER) {
            API_SERVER = "https://api-tn10.kaspa.org"
        }
        SUFFIX = " TN10"
        break;
    case "testnet-11":
        SOCKET_SERVER = "wss://api-tn11.kaspa.org";
        ADDRESS_PREFIX = "kaspatest:"
        if (!API_SERVER) {
            API_SERVER = "https://api-tn11.kaspa.org"
        }
        SUFFIX = " TN11"
        break;

    // mainnet
    default:
        SOCKET_SERVER = "wss://api.kaspa.org";
        if (!API_SERVER) {
            API_SERVER = "https://api.kaspa.org"
        }
        break;
}