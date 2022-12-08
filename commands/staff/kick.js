const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user defined")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Why are you kicking this user?")
        ),

    async execute(interaction) {

        //Set up modChannel
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //If modChannel doesn't exist...
        if(modChannel == null) {

            return interaction.reply("Missing channel data. Set one up with `/setdata`!");

        }

        //Define a reason for kicking
        const reason = interaction.options.getString("reason") || 'No reason specified.';

        //Attempt to DM them that they were kicked
        try {
            await interaction.options.getUser("user").send({content: `You have been kicked from ${interaction.guild}\n\`Reason:\` ` + reason})
        } catch (e) {
            //Oh, no! We can't kick them. Well, nothing to log, just simply can't dm them!
        }

        //Actually kick the user
        await interaction.guild.members.kick(interaction.options.getUser("user"));

        //Store the kick in the audit system
        await database.push(`${interaction.guild.id}_${interaction.options.getUser("user").id}_punishments`, { type: "Kick", reason: reason, date: new Date() });


        //Log the kick
        await modChannel.send({content: `:boot: **${interaction.user.tag}** has performed action: \`kick\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Reason:\` ${reason}`});

        //Finally, reply that we're done!
        interaction.reply({
            content: `Action \`kick user\` successfully performed on ${interaction.options.getUser("user")}.`,
            ephemeral: true
        });
    }
}