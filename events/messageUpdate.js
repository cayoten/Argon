const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage) {

        // If the content is the same, OR is a bot, return
        if (oldMessage.content === newMessage.content ||
            oldMessage.author.bot) {
            return;
        }

        // Define channel for the below line
        let channel = oldMessage.guild.channels.cache.get(await database.get(`${oldMessage.guild.id}.chatChannel`));

        // If there isn't a channel in the DB, return
        if (channel == null) {
            return;
        }

        // Define ignored channels
        let ignoreChannel = await database.get(`${oldMessage.guild.id}.ignoreChannel`)

        // If the content of the ignoreChannel array matches the current channel you're messaging in, return
        if (ignoreChannel.includes(oldMessage.channel.id)) {
            return;
        }

        // Assemble the logging
        let cLog = new EmbedBuilder()
            .setColor("#e8a726")
            .setTitle("Edited Message")
            .setDescription(`**From:** || ${oldMessage.content.trim() === '' ? "<media>" : oldMessage.content} || \n **To:** || ${newMessage.content} ||`);

        // Get the URL for any media attached and add it to the embed
        let urls = [...oldMessage.attachments.values()];
        for (let i = 0; i < urls.length; i++) {
            cLog.addFields("Attachments", urls[i].proxyURL)
        }

        // Finally, log it!
        await channel.send({
            content: ` :warning:  **${oldMessage.author.tag}** *(${oldMessage.author.id})*'s message has been edited in ${oldMessage.channel}:`,
            embeds: [cLog]
        });
    }
}