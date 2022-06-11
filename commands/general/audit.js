const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("audit")
        .setDescription("Post every punishment a user has received")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user defined")
                .setRequired(true)
        ),

    async execute(interaction) {

        //Define user
        const user = interaction.options.getUser("user");

        //Define strikes
        let strikes = interaction.client.dataStorage.strikes;

        //Create a new empty object for this guild.
        if (!strikes[interaction.guild.id]) strikes[interaction.guild.id] = {};

        ///Create a new empty array for this user.
        if (!strikes[interaction.guild.id][user.id]) strikes[interaction.guild.id][user.id] = []

        //Define userStrikes
        let userStrikes = strikes[interaction.guild.id][user.id];

        //If the length is not 0, do this
        if (userStrikes.length > 0) {

            //Define warnMessage and set it to be updated later
            let warnMessage = `Listing **${userStrikes.length}** strikes for user ${user}.\n`;

            //For each warning, list it
            userStrikes.forEach((item, index) => {
                warnMessage = warnMessage + `\`Strike ID:\` ${index} \`Strike Reason:\` ${item}\n`;
            })

            //Reply with warnMessage
            await interaction.reply({content: warnMessage});
        } else {
            await interaction.reply({content: `This user has a clean slate.`});
        }
    }
}