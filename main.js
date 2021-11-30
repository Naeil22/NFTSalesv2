const { Client, Intents } = require("discord.js");
const { token, channelId, infuraId } = require("./config.json");
const { getSales } = require("./src/blockchain");
const { InfuraProvider } = require("@ethersproject/providers");

const provider = new InfuraProvider("homestead", {
    projectId: infuraId,
});

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", async () => {
    const channel = client.channels.cache.get(channelId);
    channel.send("Ready");
    let oldBlock = await provider.getBlockNumber();

    // When it runs the first time check the latest 1000 block
    await getSales(1000, client);

    setInterval(async () => {
        let newBlock = await provider.getBlockNumber();
        console.log("OLDBLOCK: ", oldBlock, "NEWBLOCK: ", newBlock);
        
        if (newBlock !== oldBlock) {
            await getSales(newBlock - oldBlock, client);
            oldBlock = newBlock;
        }
    }, 30000);
});

// Login to Discord with your client's token
client.login(token);
