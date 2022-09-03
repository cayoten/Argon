const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");
const ms = require("ms")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("silence")
        .setDescription("Silences a user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user defined")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription(`Length of the silencing. Set to "perm" for permanent.`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Why are you silencing this user?")
        ),

    async execute(interaction) {

        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
            return interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            })
        }

        let channel;
        try {
            channel = interaction.guild.channels.cache.get(interaction.client.dataStorage.serverData[interaction.guild.id]["modChannel"]);
        } catch (e) {

            //If there isn't a channel in the database, let them know!
            return interaction.reply({
                content: "Unable to continue, missing moderation channel.\nSet one up with /setchannel!",
                ephemeral: true
            })
        }

        //Define a reason for silencing them
        const reason = interaction.options.getString("reason") || 'No reason specified.';

        //Attempt to DM them that they were silenced
        try {
            await interaction.options.getUser("user").send({content: `You have been silenced in ${interaction.guild}\n\`Reason:\` ` + reason})
        } catch (e) {
            //Oh, no! We can't ban them. Well, nothing to log, just simply can't dm them!
        }

        await channel.send({content: `:no_mouth: **${interaction.user.tag}** has performed action: \`silence\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Time:\` ${interaction.options.getString("time")} \n\`Reason:\` ${reason}`});

        //Actually silence the user
        await interaction.options.getMember("user").timeout(ms(interaction.options.getString("time")), reason)

        //Finally, reply that we're done!
        interaction.reply({
            content: `Action \`silence user\` successfully performed on ${interaction.options.getUser("user")}.`,
            ephemeral: true
        });

    }
};