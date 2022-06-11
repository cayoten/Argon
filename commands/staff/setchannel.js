const {SlashCommandBuilder} = require("@discordjs/builders");
const {Permissions} = require("discord.js")
// const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setchannel")
        .setDescription("Sets the channel for various configurations")

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
                        .setRequired(true))),
    async execute(interaction) {


        // //Define guilds table
        // const guilds = new db.table("guilds")
        //
        // //If there isn't a guilds' table for that specified guild, make one!
        // if (!guilds.has(`${interaction.guild.id}`)) {
        //     guilds.set(`${interaction.guild.id}`, {modChannel: [], jlChannel: [], chatChannel: []});
        // }

        //Permission check
        if (!interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) {
            return interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            });
        }

        //Define action as subcommands
        const action = interaction.options.getSubcommand();

        //Define channel in serverData.json
        let channel = interaction.client.dataStorage.serverData;

        //If there isn't a server defined in the DB, make it defined
        if (!channel[interaction.guild.id]) channel[interaction.guild.id] = {};

        //Define actions using a switch
        switch (action) {


            //If action is 'moderation'
            case "moderation":

                //Set "modChannel" equal to the channel
                channel[interaction.guild.id]["modChannel"] = interaction.options.getChannel("moderation").id;

                //Save the data
                await interaction.client.dataStorage.saveData();


                // guilds.set(`${interaction.guild.id}.modChannel`, interaction.options.getChannel("moderation").id);

                //Log end result
                interaction.reply({content: `Set successfully to <#${channel[interaction.guild.id]["modChannel"]}>!`});

                break;

            //If action is 'welcome'
            case "join-leave":

                //Set "jlChannel" equal to the channel
                channel[interaction.guild.id]["jlChannel"] = interaction.options.getChannel("join-leave").id;

                //Save the data
                await interaction.client.dataStorage.saveData();

                //Save the channel to the field
                //guilds.set(`${interaction.guild.id}.jlChannel`, interaction.options.getChannel("join-leave").id);

                //Log end result
                interaction.reply({content: `Set successfully to <#${channel[interaction.guild.id]["jlChannel"]}>!`});

                break;

            case "chat":

                //Set "chatChannel" equal to the channel
                channel[interaction.guild.id]["chatChannel"] = interaction.options.getChannel("chat").id;

                //Save the data
                await interaction.client.dataStorage.saveData();

                //Save the channel to the field
                // guilds.set(`${interaction.guild.id}.chatChannel`, interaction.options.getChannel("chat").id);

                //Log end result
                interaction.reply({content: `Set successfully to <#${channel[interaction.guild.id]["chatChannel"]}>!`});

                break;
        }
    }
}