const {SlashCommandBuilder} = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(interaction) {

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            ephemeral: true});

        //Reply to the user
        await interaction.editReply({
            content: `Ping?`,
        })

        //Wait 500ms
        await wait(500);

        //Update the reply
        await interaction.editReply({
            content: `Current API Latency:  ${Math.round(interaction.client.ws.ping)}ms`
        });
    }
}