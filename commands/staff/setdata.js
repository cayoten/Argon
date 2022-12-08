const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");
// const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setdata")
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
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand
                .setName('verify-key')
                .setDescription('Sets the verification key')
                .addStringOption(option =>
                    option
                        .setName("key")
                        .setDescription("The verification key")
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand
                .setName('member-role')
                .setDescription('Sets the member role to add for verification')
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The role")
                        .setRequired(true))),

    async execute(interaction) {

        //Define action as subcommands
        const action = interaction.options.getSubcommand();

        //Define actions using a switch case
        switch (action) {


            //If action is 'moderation'
            case "moderation":

                //Set "jlChannel" equal to the channel
                await database.set(`${interaction.guild.id}.modChannel`, interaction.options.getChannel("moderation").id);

                //Log end result
                interaction.reply({
                    content: `Set the moderation logging channel to <#${await database.get(`${interaction.guild.id}.modChannel`)}>.`,
                    ephemeral: true
                });

                break;

            //If action is 'welcome'
            case "join-leave":

                //Set "jlChannel" equal to the channel
                await database.set(`${interaction.guild.id}.jlChannel`, interaction.options.getChannel("join-leave").id);

                //Log end result
                interaction.reply({
                    content: `Set the join-leave channel to <#${await database.get(`${interaction.guild.id}.jlChannel`)}>.`,
                    ephemeral: true
                });

                break;

            case "chat":

                //Set "chatChannel" equal to the channel
                await database.set(`${interaction.guild.id}.chatChannel`, interaction.options.getChannel("chat").id);

                //Log end result
                interaction.reply({
                    content: `Set the chat logging channel to <#${await database.get(`${interaction.guild.id}.chatChannel`)}>.`,
                    ephemeral: true});

                break;

            case "verify-key":

                //Set "verify-key" equal to the channel
                await database.set(`${interaction.guild.id}.verifyKey`, interaction.options.getString("key"));

                //Log end result
                interaction.reply({
                    content: `Set the server's verification key to \`${await database.get(`${interaction.guild.id}.verifyKey`)}\`.`,
                    ephemeral: true
                });

                break;

            case "member-role":

                //Set "member-role" equal to the channel
                await database.set(`${interaction.guild.id}.memberRole`, interaction.options.getRole("role").id);

                //Log end result
                interaction.reply({
                    content: `Set the server's member role to \`${await database.get(`${interaction.guild.id}.memberRole`)}\`.`,
                    ephemeral: true
                });

                break;
        }
    }
}