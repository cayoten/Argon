const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mimic")
        .setDescription("Says what you tell me to say to the server")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("What you'd like me to say to the server")
                .setRequired(true)
        ),
    async execute(interaction) {

        //Reply with what the user said
        interaction.reply({
            content: interaction.options.getString("message")
        })
    }
}