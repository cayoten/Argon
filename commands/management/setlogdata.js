const {SlashCommandBuilder, PermissionsBitField, MessageFlags} = require("discord.js");
// const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlogdata")
        .setDescription("Sets specific data for certain commands")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)

        //Join-leave logging
        .addSubcommand(subcommand =>
            subcommand
                .setName('join-leave')
                .setDescription('Sets the join and leave logging')
                .addChannelOption(option =>
                    option
                        .setName("join-leave")
                        .setDescription("Sets the join-leave channel")
                        .setRequired(true)))

        //Gatekeeper (verification) logging
        .addSubcommand(subcommand =>
            subcommand
                .setName('gatekeeper')
                .setDescription(`The channel to send verification questions`)
                .addChannelOption(option =>
                    option
                        .setName("gatekeeper")
                        .setDescription("The channel to set for gatekeeping")
                        .setRequired(true)))

        //Moderation logging
        .addSubcommand(subcommand =>
            subcommand
                .setName('moderation')
                .setDescription('Sets the mod-log channel')
                .addChannelOption(option =>
                    option
                        .setName("moderation")
                        .setDescription("The channel to set for moderation")
                        .setRequired(true)))

        //Chat logging
        .addSubcommand(subcommand =>
            subcommand
                .setName('chat')
                .setDescription('Sets the chat-log channel')
                .addChannelOption(option =>
                    option
                        .setName("chat")
                        .setDescription("The channel to set for chat logs")
                        .setRequired(true))),

    async execute(interaction) {

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral});

        //Define action as subcommands
        const action = interaction.options.getSubcommand();

        //Define actions using a switch case
        switch (action) {


            //If action is 'moderation'
            case "moderation":

                //Set "jlChannel" equal to the channel
                await database.set(`${interaction.guild.id}.modChannel`, interaction.options.getChannel("moderation").id);

                //Log end result
                await interaction.editReply({
                    content: `Set the moderation logging channel to <#${await database.get(`${interaction.guild.id}.modChannel`)}>.`
                });

                break;

            //If action is 'welcome'
            case "join-leave":

                //Set "jlChannel" equal to the channel
                await database.set(`${interaction.guild.id}.jlChannel`, interaction.options.getChannel("join-leave").id);

                //Log end result
                await interaction.editReply({
                    content: `Set the join-leave logging channel to <#${await database.get(`${interaction.guild.id}.jlChannel`)}>.`
                });

                break;

            case "chat":

                //Set "chatChannel" equal to the channel
                await database.set(`${interaction.guild.id}.chatChannel`, interaction.options.getChannel("chat").id);

                //Log end result
                await interaction.editReply({
                    content: `Set the chat logging channel to <#${await database.get(`${interaction.guild.id}.chatChannel`)}>.`
                });

                break;

            case "gatekeeper":

                //Set "chatChannel" equal to the channel
                await database.set(`${interaction.guild.id}.gatekeeperChannel`, interaction.options.getChannel("gatekeeper").id);

                //Log end result
                await interaction.editReply({
                    content: `Set the chat logging channel to <#${await database.get(`${interaction.guild.id}.gatekeeperChannel`)}>.`
                });

                break;

        }
    }
}