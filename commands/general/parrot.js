const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("parrot")
        .setDescription("I'll repeat to you what you tell me!")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("The message you want me to repeat back to you")
                .setRequired(true)
        ),
    async execute(interaction) {

        //Reply with what the user said
        interaction.reply({
            content: "*I repeat back to you:* " + interaction.options.getString("message"),
            ephemeral: true
        })
    }
}