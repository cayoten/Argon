const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mimic")
        .setDescription("Says what you tell me to say to the server")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("What you'd like me to say to the server")
                .setRequired(true)
        ),
    async execute(interaction) {

        //Check if they can use the command
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
            return interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            })
        }

        //Reply with what the user said
        interaction.reply({
            content: interaction.options.getString("message")
        })
    }
}