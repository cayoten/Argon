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
        let verifyKey = await database.get(`${interaction.guild.id}.verifyKey`);
        let memberRole = await database.get(`${interaction.guild.id}.memberRole`);

        //First, if there isn't a key at all, then return
        if (verifyKey == null) {
            return interaction.reply({
                content: "There isn't a key set. Alert a staff about this!",
                ephemeral: true
            });
        }

        //If there isn't a member role, return
        if (memberRole == null) {
            return interaction.reply({
                content: "There isn't a member role set. Alert a staff about this!",
                ephemeral: true
            });
        }

        //Define the string "key" to answer
        let answer = interaction.options.getString("key")

        //If the key DOES match
        if (verifyKey === answer) {

            //Check if they're verified, and if so, return
            if (interaction.member.roles.cache.has(memberRole)) {
                return interaction.reply("You're already verified!")
            }

            //Add the role
            interaction.member.roles.add(memberRole);

            //Congrats, we're done!
            return interaction.reply({
                content: `You've been verified in ${interaction.guild}!`,
                ephemeral: true
            });

        } else {

            //Oh, no! The key didn't match.
            return interaction.reply({
                content: "That's not right. Did you read our rules?",
                ephemeral: true
            });

        }

    }
}