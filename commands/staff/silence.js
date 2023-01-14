const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");
const ms = require("ms")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("silence")
        .setDescription("Silences a user")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
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

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            ephemeral: true
        });

        //Wrap in a try since we may be using a snowflake of someone not in the server
        try {
            //Check if command is self-inflicting or targeted towards a staff
            if(interaction.user === interaction.options.getUser("user") || interaction.options.getMember("user").permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.editReply("Unable to execute this action on this user.")
            }
        } catch(e) {}

        //Set up modChannel
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //If modChannel doesn't exist...
        if (modChannel == null) {

            return interaction.editReply({
                content: "Missing channel data. Set one up with `/setdata`!"
            });

        }

        //Define a reason for silencing them
        const reason = interaction.options.getString("reason") || 'No reason specified.';

        //Attempt to DM them that they were silenced
        try {
            await interaction.options.getUser("user").send({content: `You have been silenced in ${interaction.guild}\n\`Reason:\` ` + reason})
        } catch (e) {
            //Oh, no! We can't ban them. Well, nothing to log, just simply can't dm them!
        }

        await modChannel.send({content: `:no_mouth: **${interaction.user.tag}** has performed action: \`silence\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Time:\` ${interaction.options.getString("time")} \n\`Reason:\` ${reason}`});

        //Actually silence the user
        await interaction.options.getMember("user").timeout(ms(interaction.options.getString("time")), reason)

        //Finally, reply that we're done!
        interaction.editReply({
            content: `Action \`silence user\` successfully performed on ${interaction.options.getUser("user")}.`
        });

    }
};