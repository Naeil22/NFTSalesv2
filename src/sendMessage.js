const { MessageEmbed } = require("discord.js");
const { channelId, contractAdress } = require("../config.json");


async function sendMessage(sale, client) {
    const channel = client.channels.cache.get(channelId);
    let message = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Sappy seal #" + sale.tokenId + " sold!")
        .setURL(
            "https://opensea.io/assets/" + contractAdress + "/" + sale.tokenId
        )
        .setThumbnail(sale.assetsURL)
        .addFields(
            { name: "Price", value: `${sale.price}` + "Ξ" },
            { name: "Seller", value: `${sale.from}`, inline: true },
            { name: "Buyer", value: `${sale.to}`, inline: true }
        )
        .setTimestamp(sale.time)
        .setFooter("Made with love by Naeil.eth");

    // console.log("MESSAGE", message);

    channel.send({ embeds: [message] });
}

module.exports = { sendMessage };
