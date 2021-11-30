const request = require("superagent");

const { contractAdress } = require("../config.json");

// Currently using the opensea public API to retrieve the assets, the seller and the timestamp
async function openseaGetPseudos(adr) {
    const openseaRes = await request
        .get("https://api.opensea.io/api/v1/assets")
        .query({ owner: adr })
        .on("error", (err) => {
            console.error("openseaGetPseudo error:", err.message);
        });

    console.log(openseaRes.body);

    // IF OF THE DEATH
    if (
        openseaRes.body &&
        openseaRes.body.assets[0] &&
        openseaRes.body.assets[0].owner &&
        openseaRes.body.assets[0].owner.user &&
        openseaRes.body.assets[0].owner.user.username &&
        openseaRes.body.assets[0].owner.user.username !== "NullAddress"
    ) {
        return openseaRes.body.assets[0].owner.user.username;
    }

    // console.log(name);

    return adr.substring(2, 8).toUpperCase();
}

async function openseaGetEvent(tokenId) {
    const openseaRes = await request
        .get(
            "https://api.opensea.io/api/v1/asset/" +
                contractAdress +
                "/" +
                tokenId
        )
        .on("error", (err) => {
            console.error("openseaGetImages error:", err.message);
        });

    return openseaRes;
}

module.exports = { openseaGetEvent, openseaGetPseudos };
