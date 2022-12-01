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

        //Set up the guild & channel, defined in setChannel
        let channel;

        try {
            channel = interaction.guild.channels.cache.get(interaction.client.dataStorage.serverData[interaction.guild.id]["modChannel"]);
        } catch (e) {

            //If there isn't a channel in the database, let them know!
            return interaction.reply({
                content: "Unable to continue, missing moderation channel.\nSet one up with /setdata!",
                ephemeral: true
            })
        }

        //Define a reason for kicking
        const reason = interaction.options.getString("reason") || 'No reason specified.';

        //Attempt to DM them that they were kicked
        try {
            await interaction.options.getUser("user").send({content: `You have been kicked from ${interaction.guild}\n\`Reason:\` ` + reason})
        } catch (e) {
            //Oh, no! We can't kick them. Well, nothing to log, just simply can't dm them!
        }


        //Log the kick
        await channel.send({content: `:boot: **${interaction.user.tag}** has performed action: \`kick\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Reason:\` ${reason}`});

        //Actually kick the user
        await interaction.guild.members.kick(interaction.options.getUser("user"));

        //Finally, reply that we're done!
        interaction.reply({
            content: `Action \`kick user\` successfully performed on ${interaction.options.getUser("user")}.`,
            ephemeral: true
        });
    }
}