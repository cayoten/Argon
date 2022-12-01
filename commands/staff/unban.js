const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .addStringOption(option =>
            option
                .setName("snowflake")
                .setDescription("The snowflake ID of the user")
                .setRequired(true)
        ),

    async execute(interaction) {

        //Define userId and guildId for the followup code
        const userId = interaction.options.getString("snowflake");
        const guildId = interaction.guild.id;

        //If the user is banned, remove said ban from the temp-ban storage.
        if (interaction.dataStorage.isUserBanned(userId, guildId)) {
            interaction.dataStorage.removeBan(userId, guildId)
        }

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


        //Attempt to unban, and return with a message if it fails
        try {
            await interaction.guild.bans.remove(interaction.options.getString("snowflake"));

            //Log the ban
            await channel.send({content: `:heart: **${interaction.user.tag}** has performed action: \`unban\` \n\`Affected ID:\` **${interaction.options.getString("snowflake")}**`});

        } catch (e) {
            return interaction.reply({
                content: "I couldn't unban the user - is the snowflake right, or are they banned?",
                ephemeral: true
            });
        }

        //Finally, respond
        await interaction.reply({
            content: `Unbanned the specified user.`,
            ephemeral: true
        });
    }
}