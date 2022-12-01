const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Start the verification system")
        .addStringOption(option =>
            option
                .setName("key")
                .setDescription("The special keyword ")
                .setRequired(true)
        ),
    async execute(interaction) {


        //Define channel in serverData.json
        let verifyKey = interaction.client.dataStorage.serverData;

        //If there isn't a key in the DB, create an empty one
        if (!verifyKey[interaction.guild.id]) verifyKey[interaction.guild.id] = {};

        //Obtain the key in serverData.json
        let verifyMatch = interaction.client.dataStorage.serverData[interaction.guild.id]["verifyKey"]

        //Define the string "key" to answer
        let answer = interaction.options.getString("key")

        //First, if there isn't a key at all...
        if (!verifyMatch) {
            return interaction.reply("There isn't a key set. Alert a staff about this!");
        }


        //If the key DOES match
        if (verifyMatch === answer) {

            //Check if they're verified, and if so, return
            if (interaction.member.roles.cache.has(verifyKey[interaction.guild.id]["memberRole"])) {
                return interaction.reply("You're already verified!")
            }

            //Add the role
            interaction.member.roles.add(verifyKey[interaction.guild.id]["memberRole"]);

            //Congrats, we're done!
            return interaction.reply(`You've been verified in ${interaction.guild}!`);

        } else {

            //Oh, no! The key didn't match.
            return interaction.reply("That's not right. Did you read our rules?");

        }

    }
}