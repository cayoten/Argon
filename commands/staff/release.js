const {SlashCommandBuilder, PermissionsBitField, MessageFlags} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("release")
        .setDescription("Removes a person's timeout")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user defined")
                .setRequired(true)
        ),
    async execute(interaction) {

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral});

        //Set up modChannel
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //If modChannel doesn't exist, return and reply.
        if (modChannel == null) {

            return interaction.editReply({
                content: "Missing channel data. Set one up with `/setdata`!"
            });

        }

        //Unmute the user.
        await interaction.options.getMember("user").disableCommunicationUntil(null);

        //Log that you removed the timeout
        await modChannel.send({content: `:speaking_head:  **${interaction.user.tag}** has performed action: \`remove timeout\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})*`});

        //Finally reply
        await interaction.editReply({
            content: `Action \`remove timeout\` successfully performed on ${interaction.options.getUser("user")}.`
        });
    }
}

//The main stuff. await member.disableCommunicationUntil(null);