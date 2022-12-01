const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nullify")
        .setDescription("Removes a punishment")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user you wish to clear the history of")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("value")
                .setDescription("Strike value")
                .setRequired(true)
        ),
    async execute(interaction) {

        //Define user
        let user = interaction.options.getUser("user")

        //Define what strikes is
        let strikes = interaction.client.dataStorage.strikes;

        //Create a new empty object for this guild.
        if (!strikes[interaction.guild.id]) strikes[interaction.guild.id] = {};

        //Create a new empty array for this user.
        if (!strikes[interaction.guild.id][user.id]) strikes[interaction.guild.id][user.id] = []

        //If there isn't any strikes, return
        if (strikes[interaction.guild.id][user.id].length === 0) {
            return interaction.reply({
                content: "This user has a clean slate.",
                ephemeral: true
            })
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

        //Define strikeValue for next line
        let strikeValue = interaction.options.getInteger("value")

        //If strikeValue is null or == 0, return
        if (isNaN(strikeValue) || strikeValue < 0 || strikeValue >= strikes[interaction.guild.id][user.id].length) {
            return interaction.reply({
                content: "Failed due to reason: `INVALID_STRIKE_ID`",
                ephemeral: true
            })
        }

        strikes[interaction.guild.id][user.id].splice(strikeValue, 1); //Remove the strike.

        interaction.client.dataStorage.saveData()

        //Log the ban
        await channel.send({content: `:coffee: **${interaction.user.tag}** has performed action: \`nullify\` \n\`New Strike Count:\` **${strikes[interaction.guild.id][user.id].length}**`});


        //Finally, we're done!
        interaction.reply({
            content: `Action completed with value \`${interaction.options.getInteger("value")}\` on user ${interaction.options.getUser("user")}`,
            ephemeral: true
        })

    }
}