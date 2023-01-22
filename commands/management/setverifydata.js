const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");
// const GuildSettings = require("../../models/GuildSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setverifydata")
        .setDescription("Sets specific data for certain commands")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)

        .addSubcommand(subcommand =>
            subcommand
                .setName('member-role')
                .setDescription('Sets the member role to add for verification')
                .addRoleOption(option =>
                    option
                        .setName("member-role")
                        .setDescription("The role")
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand
                .setName('restricted-role')
                .setDescription('Sets the restricted member role to add for verification')
                .addRoleOption(option =>
                    option
                        .setName("restricted-role")
                        .setDescription("The role")
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand
                .setName('verify-questions')
                .setDescription(`Questions to ask in verification. Use "\n" for a new line - no more than 5 questions!`)
                .addStringOption(option =>
                    option
                        .setName("questions")
                        .setDescription("The role")
                        .setRequired(true))),

    async execute(interaction) {

        //At the start, we defer to prevent Discord Interaction Failed
        await interaction.deferReply({
            ephemeral: true
        });

        //Define action as subcommands
        const action = interaction.options.getSubcommand();

        //Define actions using a switch case
        switch (action) {

            case "member-role":

                //Set "member-role" equal to the channel
                await database.set(`${interaction.guild.id}.memberRole`, interaction.options.getRole("member-role").id);

                //Log end result
                await interaction.editReply({
                    content: `Set the server's member role to \`${await database.get(`${interaction.guild.id}.memberRole`)}\`.`
                });

                break;

            case "restricted-role":

                //Set "restricted-role" equal to the channel
                await database.set(`${interaction.guild.id}.restrictedRole`, interaction.options.getRole("restricted-role").id);

                //Log end result
                await interaction.editReply({
                    content: `Set the server's restricted role to \`${await database.get(`${interaction.guild.id}.restrictedRole`)}\`.`
                });

                break;

            case "verify-questions":

                //Set "verify-questions" to the questions you set
                await database.set(`${interaction.guild.id}.verifyQuestions`, interaction.options.getString("questions"));

                //Log end result
                await interaction.editReply({
                    content: `Set the server's verification questions to \`${await database.get(`${interaction.guild.id}.verifyQuestions`)}\`.`
                });

                break;

        }
    }
}