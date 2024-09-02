let queryBlock = null
let blocksCache = []

function updateQueryBlockFromBlockDag() {
    fetch('https://api.kaspa.org/info/blockdag')
        .then((response) => response.json())
        .then(d => {
            queryBlock = d.virtualParentHashes[0]
        })
        .catch(err => console.log("Error", err))
}

function uniqBy(a, key) {
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

export function getNewBlocks(func, trimTo) {
    if (!queryBlock) {
        updateQueryBlockFromBlockDag()
    }
    if (queryBlock) {
        fetch(`https://api.kaspa.org/blocks?lowHash=${queryBlock}&includeBlocks=true`)
            .then((response) => response.json())
            .then(d => {
                const blocks = d.blocks.map((x) => {
                    return {
                        'hash': x.verboseData.hash,
                        'txIds': x.verboseData.transactionIds,
                        'blueScore': x.verboseData.blueScore
                    }
                })

                queryBlock = !!blocks.length ? blocks.slice(-1)[0].hash : queryBlock

                blocksCache = blocksCache.concat(blocks)
                blocksCache = uniqBy(blocksCache, (x) => x.hash)
                blocksCache.sort((a, b) => b.blueScore - a.blueScore)
                blocksCache = blocksCache.splice(0, trimTo)


                func(blocksCache)
            })
            .catch(err => console.log("Error", err))
    }
}
