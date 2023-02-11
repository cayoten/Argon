const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mimic")
        .setDescription("Non-ephemeral mimicry command. I'll say what you do.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("What you'd like me to say to the server")
                .setRequired(true)
        ),
    async execute(interaction) {

        //At the start, we defer to prevent Discord Interaction Failed - Ephemeral since editReply cannot be changed to ephemeral
        await interaction.deferReply({
            ephemeral: true});

        //Reply with what the user said
        interaction.channel.send({
            content: interaction.options.getString("message")
        })

        await interaction.editReply({
            content: "Your wish is my command."
        })
    }
}