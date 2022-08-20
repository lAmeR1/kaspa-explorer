const API_BASE = "https://kaspa.herokuapp.com/"

export async function getBlock(hash) {
    const res = await fetch(`${API_BASE}blocks/${hash}`)
            .then((response) => response.json())
            .then(data => {
                return data
            })
            .catch(err => console.log("Error", err))
    return res
}