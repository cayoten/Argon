const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears a specified amount of messages, ignoring pinned ones.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("How many messages to clear")
                .setRequired(true)
        ),
    async execute(interaction) {
        
        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            ephemeral: true
        });

        //Identify pinned messages
        const pinned = (await interaction.channel.messages.fetch()).filter(msg => !msg.pinned);

        //Set up chatChannel
        let chatChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.chatChannel`));

        //If modChannel doesn't exist...
        if (chatChannel == null) {

            return interaction.editReply({
                content: "Missing channel data. Set one up with `/setdata`!"
            });

        }

        //Define & delete the messages, wrapped in a try so that it finishes out the code
        let deletedMessages;
        try {

            deletedMessages = await interaction.channel.bulkDelete(pinned.first((parseInt(interaction.options.getInteger("amount")))), true).catch(console.error);

        } catch (e) {
            return interaction.editReply({
                content: "It *may* have been done..? An error was encountered, but it usually means that you tried clearing too many messages."
            })
        }

        //Log the clearing
        await chatChannel.send({content: `:broom: **${interaction.user.tag}** has performed action: \`chat clear\`\n\`Cleared:\` **${deletedMessages.size}** messages.`});

        //Finally, respond!
        await interaction.editReply({
            content: `Action \`clear chat [size ${deletedMessages.size}]\` applied successfully.`
        })
    }
}
