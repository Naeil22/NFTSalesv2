const { InfuraProvider } = require("@ethersproject/providers");
const { ethers } = require("ethers");

const abi = require("./abi/abiSappy.json");
const { contractAdress, infuraId } = require("./config.json");
const { openseaGetImages, openseaGetPseudos } = require("./openSea");
const { sendMessage } = require("./sendMessage");

const provider = new InfuraProvider("homestead", {
    projectId: infuraId,
});

let lastTransactions = [];

function checkTransaction(transaction, transactionList) {
    for (let i of transactionList) {
        if (i === transaction) {
            return true;
        }
    }
    return false;
}

async function getSales(blockDiff, client) {
    const finalAbi = JSON.parse(abi.result);
    const contract = new ethers.Contract(contractAdress, finalAbi, provider);

    const transfers = await contract.queryFilter("Transfer", -blockDiff);

    for (let transfer of transfers) {
        const tokenId = parseInt(
            ethers.utils.formatUnits(transfer.args["tokenId"]) * 1e18 + 0.1
        );
        console.log(
            "RAW TOKEN ID: ",
            ethers.utils.formatUnits(transfer.args["tokenId"]),
            "FINAL TOKEN ID: ",
            tokenId,
            "LOGS: ",
            transfer
        );
        const transaction = transfer.transactionHash;

        let logs = await transfer.getTransaction();
        const price = ethers.utils.formatEther(logs.value);

        if (
            price === "0.0" ||
            checkTransaction(transaction, lastTransactions)
        ) {
            console.log(
                "SAME TRANSACTION DETECTED OH SHIT OR MAYBE JUST A TRANSFER AND NOT A SALE HMMM"
            );
            console.log("TRANSACTION :", logs);
            continue;
        }

        lastTransactions.push(transaction);

        if (lastTransactions.length >= 10) {
            lastTransactions.reverse();
            while (lastTransactions.length >= 5) {
                lastTransactions.pop();
            }
            lastTransactions.reverse();
        }

        // Currently using the opensea public API to retrieve the assets, the seller and the timestamp
        // Might be problematic in future since it makes the bot dependant to Opensea
        const openseaRes = await openseaGetImages(tokenId);
        const senderPseudo = await openseaGetPseudos(transfer.args["from"]);
        const receiverPseudo = await openseaGetPseudos(transfer.args["to"]);

        const jsonRes = {
            transaction,
            from: senderPseudo,
            to: receiverPseudo,
            tokenId,
            price,
            assetsURL: openseaRes.body.image_url,
            time: openseaRes.body.last_sale.event_timestamp,
        };
        sendMessage(jsonRes, client);
        console.log("JSONRES: ", jsonRes);
    }
}

module.exports = { getSales };
