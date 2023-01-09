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

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            ephemeral: true});

        //Define channel in serverData.json
        let verifyKey = await database.get(`${interaction.guild.id}.verifyKey`);
        let memberRole = await database.get(`${interaction.guild.id}.memberRole`);

        //First, if there isn't a key at all, then return
        if (verifyKey == null) {
            return interaction.editReply({
                content: "There isn't a key set. Alert a staff about this!"
            });
        }

        //If there isn't a member role, return
        if (memberRole == null) {
            return interaction.editReply({
                content: "There isn't a member role set. Alert a staff about this!"
            });
        }

        //Define the string "key" to answer
        let answer = interaction.options.getString("key")

        //If the key DOES match
        if (verifyKey === answer) {

            //Check if they're verified, and if so, return
            if (interaction.member.roles.cache.has(memberRole)) {
                return interaction.eply("You're already verified!")
            }

            //Add the role
            interaction.member.roles.add(memberRole);

            //Congrats, we're done!
            return interaction.editReply({
                content: `You've been verified in ${interaction.guild}!`
            });

        } else {

            //Oh, no! The key didn't match.
            return interaction.editReply({
                content: "That's not right. Did you read our rules?"
            });

        }

    }
}