const Discord = require("discord.js");

module.exports = {
    name: "messageDelete",
    once: true,
    async execute(message) {

        //If the content was from a bot, ignore it
        if (message.author.bot) return;

        //Define channel for the below line
        let channel = message.client.dataStorage.serverData;

        //Define chatChannel
        let chatChannel = message.guild.channels.cache.get(channel[message.guild.id]["chatChannel"]);

        //Don't do anything if there isn't a chat channel
        if (!chatChannel) {
            return;
        }

        //Configure the embed, clarifying the content OR setting it to "<media>" if it wasn't a text object
        let cLog = new Discord.MessageEmbed()
            .setColor("#e82631")
            .setTitle("Removed Message")
            .setDescription(`|| ${message.content.trim() === '' ? "<media>" : message.content} ||`);

        //Get the URL for any media attached and add it to the embed
        let urls = [...message.attachments.values()];
        for (let i = 0; i < urls.length; i++) {
            cLog.addField("Attachments", urls[i].proxyURL)
        }

        //Finally, log this!
        await chatChannel.send({
            content: `:x: **${message.author.tag}** *(${message.author.id})*'s message has been deleted from ${message.channel}:`,
            embeds: [cLog]
        });
    }
}