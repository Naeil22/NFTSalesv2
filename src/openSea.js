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

    if (openseaRes.body.assets[0].owner) {
        const name = openseaRes.body.assets[0].owner;
        if (
            name.user &&
            name.user.username &&
            name.user.username !== "NullAddress"
        ) {
            // console.log("dedans");
            return name.user.username;
        }
    }
    // console.log(name);

    return adr.substring(2, 8).toUpperCase();
}

async function openseaGetImages(tokenId) {
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

module.exports = { openseaGetImages, openseaGetPseudos };
