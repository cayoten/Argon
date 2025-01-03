const {SlashCommandBuilder, MessageFlags} = require("discord.js");

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

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral});
        
        //Reply with what the user said
        await interaction.editReply({
            content: "*I repeat back to you:* " + interaction.options.getString("message")
        })
    }
}