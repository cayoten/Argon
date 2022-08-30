const {SlashCommandBuilder} = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {

        //Reply to the user
        interaction.reply({
            content: `Ping?`,
            ephemeral: true
        })

        //Wait 500ms
        await wait(500);

        //Update the reply
        await interaction.editReply({
            content: `Current API Latency:  ${Math.round(interaction.client.ws.ping)}ms`
        });
    }
}