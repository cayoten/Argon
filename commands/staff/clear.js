const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears a specified amount of messages, ignoring pinned ones.")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("How many messages to clear")
                .setRequired(true)
        ),
    async execute(interaction) {

        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
            return interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            })
        }

        const pinned = (await interaction.channel.messages.fetch()).filter(msg => !msg.pinned);

        let channel;
        try {
            channel = interaction.guild.channels.cache.get(interaction.client.dataStorage.serverData[interaction.guild.id]["chatChannel"]);
        } catch (e) {

            //If there isn't a channel in the database, let them know!
            return interaction.reply({
                content: "Unable to continue, missing moderation channel.\nSet one up with /setchannel!",
                ephemeral: true
            })
        }

        let deletedMessages = await interaction.channel.bulkDelete(pinned.first((parseInt(interaction.options.getInteger("amount")))), true).catch(console.error);
        if (deletedMessages === undefined || deletedMessages.size === 0) {
            return interaction.reply({content: "Unable to clear messages."})
        }

        await channel.send({content: `:broom: **${interaction.user.tag}** has performed action: \`chat clear\`\n\`Cleared:\` **${deletedMessages.size}** messages.`});

        interaction.reply({
            content: `Action \`clear chat [size ${deletedMessages.size}]\` applied successfully.`,
            ephemeral: true
        })
    }
}
