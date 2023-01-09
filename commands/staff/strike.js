const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()
        .setName("strike")
        .setDescription("Strikes a user with a set reason")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user defined")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for striking this user")
                .setRequired(true)
        ),

    async execute(interaction) {

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            ephemeral: true
        });

        //Check if command is self-inflicting or targeted towards a staff
        if(interaction.user === interaction.options.getUser("user") || interaction.options.getMember("user").permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.editReply("Unable to execute this action on this user.")
        }

        //Mod logging channel fetch
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //If modChannel doesn't exist...
        if (modChannel == null) {

            return interaction.editReply({
                content: "Missing channel data. Set one up with `/setdata`!"
            });

        }

        //Log the warning to the staff chat
        await modChannel.send({
            content: `:triangular_flag_on_post: **${interaction.user.tag}** has performed action: \`strike\`\n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Reason:\` ${interaction.options.getString("reason")}`
        });

        //Store the kick in the audit system
        await database.push(`${interaction.guild.id}_${interaction.options.getUser("user").id}_punishments`, {
            type: "Strike",
            reason: interaction.options.getString("reason"),
            date: new Date()
        });

        //Attempt to DM the person warned
        try {
            await interaction.options.getUser("user").send({
                content: `**You have received a new strike.**\n\`Guild:\` ${interaction.guild} \n\`Reason:\` ${interaction.options.getString("reason")}\n\`Date:\` ${new Date()}`
            });
        } catch (e) {
            //Oh, no! Well, we can't DM them... so we log nothing!
        }

        //Wrap up to mod that they were given a strike
        interaction.editReply({
            content: `User ${interaction.options.getUser("user")} successfully struck with reason \`${interaction.options.getString("reason")}\``
        });


    }
}