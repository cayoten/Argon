const {SlashCommandBuilder, PermissionsBitField, MessageFlags} = require("discord.js");
// const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forgetchannel")
        .setDescription("Define a channel to ignore logging from.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)

        // Add a channel to the ignore list
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a channel to the list.')
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("The channel name to add.")
                        .setRequired(true)))

        // Remove a channel from the ignore list
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription(`Remove a channel from the list.`)
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("The channel name to remove.")
                        .setRequired(true))),

    async execute(interaction) {

        // At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral});

        // Define action as subcommands
        const action = interaction.options.getSubcommand();

        // Define actions using a switch case
        switch (action) {

            // If action is 'add'
            case "add":

                // Add "ignoreChannel" to the array
                await database.push(`${interaction.guild.id}.ignoreChannel`, interaction.options.getChannel("channel").id);

                //Log end result
                await interaction.editReply({
                    content: `Added <#${interaction.channel.id}> to the ignore list.`
                });

                break;

            // If action is "remove"
            case "remove":

                // Remove "ignoreChannel" from the array
                await database.pull(`${interaction.guild.id}.ignoreChannel`, interaction.options.getChannel("channel").id);

                //Log end result
                await interaction.editReply({
                    content: `Removed <#${interaction.channel.id}> from the ignore list.`
                });

                break;
        }
    }
}