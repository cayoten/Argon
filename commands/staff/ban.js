const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");
const ms = require("ms");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("ban")
        .setDescription("Bans a user")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
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

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            ephemeral: true
        });

        //Wrap in a try since we may be using a snowflake of someone not in the server
        try {
            //Check if command is self-inflicting or targeted towards a staff
            if(interaction.user === interaction.options.getUser("user") || interaction.options.getMember("user").permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.editReply("Unable to execute this action on this user.")
            }
        } catch(e) {}

        //Set up modChannel
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //If modChannel doesn't exist...
        if (modChannel == null) {

            return interaction.editReply({
                content: "Missing channel data. Set one up with `/setdata`!"
            });

        }

        //Define a reason for banning
        const reason = interaction.options.getString("reason") || 'No reason specified.';

        //Attempt to DM them that they were banned
        try {
            await interaction.options.getUser("user").send({content: `You have been banned from ${interaction.guild}\n\`Reason:\` ` + reason})
        } catch (e) {
            //Oh, no! We can't ban them. Well, nothing to log, just simply can't dm them!
        }

        //If the ban is NOT permanent, do this first
        if (interaction.options.getString("time") !== "perm") {

            await database.push(`${interaction.guild.id}_bans`, {
                user: interaction.options.getUser("user").id,
                time: Date.now() + ms(interaction.options.getString("time"))
            });

            // interaction.client.dataStorage.addUserBan(interaction.options.getUser("user").id, interaction.guild.id, ms(interaction.options.getString("time")));

        }

        //Officially ban the user
        await interaction.guild.members.ban(interaction.options.getUser("user"), {days: 7, reason: reason})

        //Log the ban
        await modChannel.send({content: `:hammer: **${interaction.user.tag}** has performed action: \`ban\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Time:\` ${interaction.options.getString("time")} \n\`Reason:\` ${reason}`});

        //Save the ban type, reason, and date
        await database.push(`${interaction.guild.id}_${interaction.options.getUser("user").id}_punishments`, {
            type: "Ban",
            reason: reason,
            date: new Date()
        });

        //Finally, reply that we're done!
        await interaction.editReply({
            content: `Action \`ban user\` successfully performed on ${interaction.options.getUser("user")}.`
        });
    }
}