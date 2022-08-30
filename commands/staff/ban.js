const {SlashCommandBuilder} = require("discord.js");
const {PermissionsBitField} = require("discord.js")
const ms = require("ms");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user defined")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription(`Length of the ban. Set to "perm" for permanent.`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Why are you banning this user?")
        ),

    async execute(interaction) {

        //Permission check
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.BanMembers])) {
            return interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            })
        }


        //Set up the guild & channel, defined in setChannel
        // let guilds = new db.table("guilds")
        let channel;
        try {
            channel = interaction.guild.channels.cache.get(interaction.client.dataStorage.serverData[interaction.guild.id]["modChannel"]);
        } catch (e) {

            //If there isn't a channel in the database, let them know!
            return interaction.reply({
                content: "Unable to continue, missing moderation channel.\nSet one up with /setchannel!",
                ephemeral: true
            })
        }

        //Define a reason for banning
        const reason = interaction.options.getString("reason") || 'No reason specified.';

        //Attempt to DM them that they were banned
        try {
            await interaction.options.getUser("user").send({content: `You have been banned from ${interaction.guild}\n\`Reason:\` ` + reason})
        } catch (e) {
            //Oh, no! We can't ban them. Well, nothing to log, just simply can't dm them!
        }

        //Set up the table
        // const users = new db.table("users");

        //Check if they have a table in their ID, if not, make one
        // if (!users.has(`${user.id}`)) {
        //     users.set(`${user.id}`, {punishCheck: []});
        // }

        //Push the new ban to the database
        // users.push(`${user.id}.punishCheck`, `BAN: ${reason}`);

        //Log to the channel that a ban has occurred

        //If the ban is NOT permanent, do this first

        if (interaction.options.getString("time") !== "perm") {

            interaction.client.dataStorage.addUserBan(interaction.options.getUser("user").id, interaction.guild.id, ms(interaction.options.getString("time")));

        }


        await channel.send({content: `:hammer: **${interaction.user.tag}** has performed action: \`ban\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Time:\` ${interaction.options.getString("time")} \n\`Reason:\` ${reason}`});

        //Actually ban the user
        await interaction.guild.members.ban(interaction.options.getUser("user"), {days: 7, reason: reason})

        //Finally, reply that we're done!
        interaction.reply({
            content: `Action \`ban user\` successfully performed on ${interaction.options.getUser("user")}.`,
            ephemeral: true
        });
    }
}