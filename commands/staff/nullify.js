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

        //Set strikes equal to the punishments database
        const strikes = await database.get(`${interaction.guild.id}_${user.id}_punishments`) || [];

        //If there isn't any strikes, return
        if (strikes.length === 0) {
            return interaction.reply({
                content: "This user has a clean slate.",
                ephemeral: true
            })
        }

        //Set up the guild & channel, defined in setChannel
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //No mod channel?? 😢
        if(modChannel == null) {

            return interaction.reply("Missing channel data. Set one up with `/setdata`!");

        }

        //If strikeValue is less than 0, equals 0, or the value is greater than the length of strikes, return
        if (strikes < 0 || interaction.options.getInteger("value") >= strikes.length) {
            return interaction.reply({
                content: "Failed due to reason: `INVALID_STRIKE_ID`",
                ephemeral: true
            })
        }

        //Remove the strike.
        const modifiedStrikes = await database.pull(`${interaction.guild.id}_${user.id}_punishments`, (_, index) => index === interaction.options.getInteger("value"));

        //Log the ban
        await modChannel.send({content: `:coffee: **${interaction.user.tag}** has performed action: \`nullify\` \n\`New Strike Count:\` **${modifiedStrikes.length}**`});

        //Finally, we're done!
        interaction.reply({
            content: `Action completed with value \`${interaction.options.getInteger("value")}\` on user ${interaction.options.getUser("user")}`,
            ephemeral: true
        })

    }
}