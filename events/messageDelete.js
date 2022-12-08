const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "messageDelete",
    async execute(message) {

        //If the content was from a bot, ignore it
        if (message.author.bot) return;

        //Define channel for the below line
        let channel = message.guild.channels.cache.get(await database.get(`${message.guild.id}.chatChannel`));

        if (channel == null) {
            return;
        }

        //Configure the embed, clarifying the content OR setting it to "<media>" if it wasn't a text object
        let cLog = new EmbedBuilder()
            .setColor("#e82631")
            .setTitle("Removed Message")
            .setDescription(`|| ${message.content.trim() === '' ? "<media>" : message.content} ||`);

        //Get the URL for any media attached and add it to the embed
        let urls = [...message.attachments.values()];
        for (let i = 0; i < urls.length; i++) {
            cLog.addFields("Attachments", urls[i].proxyURL)
        }

        //Finally, log this!
        await channel.send({
            content: `:x: **${message.author.tag}** *(${message.author.id})*'s message has been deleted from ${message.channel}:`,
            embeds: [cLog]
        });
    }
}