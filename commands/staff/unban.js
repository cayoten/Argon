const {SlashCommandBuilder} = require("@discordjs/builders");
const {Permissions} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user")
        .addStringOption(option =>
            option
                .setName("snowflake")
                .setDescription("The snowflake ID of the user")
                .setRequired(true)
        ),

    async execute(interaction) {

        //Permission check
        if (!interaction.member.permissions.has([Permissions.FLAGS.BAN_MEMBERS])) {
            return interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            });
        }

        //Define userId and guildId for the followup code
        const userId = interaction.options.getString("snowflake");
        const guildId = interaction.guild.id;

        //If the user is banned, remove said ban from the temp-ban storage.
        if (interaction.dataStorage.isUserBanned(userId, guildId)) {
            interaction.dataStorage.removeBan(userId, guildId)
        }

        //Attempt to unban, and return with a message if it fails
        try {
            await interaction.guild.bans.remove(interaction.options.getString("snowflake"));
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