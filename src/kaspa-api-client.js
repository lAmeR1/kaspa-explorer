import { API_SERVER } from "./explorer_constants";

const API_BASE = API_SERVER + "/";

export async function getBlock(hash) {
  const res = await fetch(`${API_BASE}blocks/${hash}?includeColor=true`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getTransaction(hash) {
  const res = await fetch(`${API_BASE}transactions/${hash}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getBlockdagInfo() {
  const res = await fetch(`${API_BASE}info/blockdag`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getKaspadInfo() {
  const res = await fetch(`${API_BASE}info/kaspad`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getHashrateMax() {
  const res = await fetch(`${API_BASE}info/hashrate/max`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getFeeEstimate() {
  const res = await fetch(`${API_BASE}info/fee-estimate`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getCoinSupply() {
  const res = await fetch(`${API_BASE}info/coinsupply`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getAddressBalance(addr) {
  const res = await fetch(`${API_BASE}addresses/${addr}/balance`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.balance;
    });
  return res;
}

export async function getAddressTxCount(addr) {
  const res = await fetch(`${API_BASE}addresses/${addr}/transactions-count`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.total;
    });
  return res;
}

export async function getAddressUtxos(addr) {
  const res = await fetch(`${API_BASE}addresses/${addr}/utxos`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getAddressName(addr) {
  const res = await fetch(`${API_BASE}addresses/${addr}/name`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getHalving() {
  const res = await fetch(`${API_BASE}info/halving`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getTransactionsFromAddress(addr, limit = 20, offset = 0) {
  const res = await fetch(
    `${API_BASE}addresses/${addr}/full-transactions?limit=${limit}&offset=${offset}`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}

export async function getTransactions(tx_list, inputs, outputs) {
  const res = await fetch(`${API_BASE}transactions/search`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ transactionIds: tx_list }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return res;
}
