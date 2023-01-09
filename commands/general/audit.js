const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("audit")
        .setDescription("Check someone (such as yourself) for punishments")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user defined")
                .setRequired(true)
        ),

    async execute(interaction) {

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply();

        //Define the strike location
        const strikes = await database.get(`${interaction.guild.id}_${interaction.options.getUser("user").id}_punishments`);

        //If the length is not 0, do this
        if (strikes != null) {

            //Define warnMessage and set it to be updated later
            let warnMessage = `Listing **${strikes.length}** punishments for user ${interaction.options.getUser("user")}.\n`;

            //For each warning, list it
            strikes.forEach((item, index) => {
                warnMessage = warnMessage + `\`Punishment ID:\` ${index} \n- \`Type:\` ${item.type}\n- \`Reason:\` ${item.reason} \n- \`Date:\` ${item.date}\n\n`;
            })


            //Reply with warnMessage
            await interaction.editReply({content: warnMessage});

        } else {

            //If there are no strikes, return
            await interaction.editReply({content: `This user has a clean slate.`});
        }
    }
}