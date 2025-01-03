const {SlashCommandBuilder, PermissionsBitField, MessageFlags} = require("discord.js");

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

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral});

        //Define userID and guildID for the followup code
        const userID = interaction.options.getString("snowflake");
        const guildID = interaction.guild.id;

        //Define bans or set it to null
        const bans = await database.get(`${guildID}_bans`) || [];


        if (bans.some(el => el.user === userID)) {
            // pull from the array with quick.db like for the unban checker
            await database.pull(`${guildID}_bans`, el => el.user === userID)
        }

        //Set up modChannel
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //If modChannel doesn't exist...
        if (modChannel == null) {

            return interaction.editReply({
                content: "Missing channel data. Set one up with `/setdata`!"
            });

        }


        //Attempt to unban, and return with a message if it fails
        try {
            await interaction.guild.bans.remove(interaction.options.getString("snowflake"));

            //Log the ban
            await modChannel.send({content: `:heart: **${interaction.user.tag}** has performed action: \`unban\` \n\`Affected ID:\` **${interaction.options.getString("snowflake")}**`});

        } catch (e) {

            //If the ID is wrong, return
            return interaction.editReply({
                content: "I couldn't unban the user - is the snowflake right, or are they banned?"
            });
        }

        //Finally, respond
        await interaction.editReply({
            content: `Unbanned the specified user.`
        });
    }
}