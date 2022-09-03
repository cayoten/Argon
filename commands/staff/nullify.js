const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nullify")
        .setDescription("Removes a punishment")
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

        //Permission check
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageGuild])) {
            return interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            })
        }

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

        //Set up the table
        //const users = new db.table("users");

        //Check if they have a table in their ID, if not, make one
        //if (!users.has(`${user.id}`)) {
        //    users.set(`${user.id}`, {punishCheck: []});
        //}

        //Set the value to remove a strike from, first entry is 0, second is 1, etc
        //let strikeValue = interaction.options.getInteger("value");

        //Define the content inside punishes
        //let punishes = users.get(`${user.id}.punishCheck`)

        //If they have no strikes, return
        // if (punishes.length === 0) {
        //     return interaction.reply({
        //         content: "This user has a clean slate!",
        //         ephemeral: true
        //     });
        // }

        //Splice the data together
        // punishes.splice(strikeValue, 1);

        //Apply the new data
        // users.set(`${user.id}.punishCheck`, punishes);

        //Finally, we're done!
        interaction.reply({
            content: `Action completed with value \`${interaction.options.getInteger("value")}\` on user ${interaction.options.getUser("user")}`,
            ephemeral: true
        })

    }
}