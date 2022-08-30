const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("parrot")
        .setDescription("Repeats what you tell me to say")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("The message you want me to repeat back to you")
                .setRequired(true)
        ),
    async execute(interaction) {

        //Reply with what the user said
        interaction.reply({
            content: interaction.options.getString("message"),
            ephemeral: true
        })
    }
}