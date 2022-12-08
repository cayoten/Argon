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

        //Check if they're staff
        if (interaction.options.getMember("user").permissions.has(PermissionsBitField.Flags.ManageMessages)) {

            //If they're staff, return & reply
            return interaction.reply({
                content: `I am unable to punish a user with the permission \`MANAGE_MESSAGES\`.`,
                ephemeral: true
            })
        }

        //Define user
        let user = interaction.options.getUser("user");

        // //Define what strikes is
        // let strikes = interaction.client.dataStorage.strikes;
        //
        // //If strikes DB doesn't exist, make one
        // if (!strikes[interaction.guild.id]) strikes[interaction.guild.id] = {};
        //
        // //If strikes for that user doesn't exist, give them an empty array
        // if (!strikes[interaction.guild.id][user.id]) strikes[interaction.guild.id][user.id] = []

        //Mod logging channel fetch
        let modChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.modChannel`));

        //If modChannel doesn't exist...
        if(modChannel == null) {

            return interaction.reply("Missing channel data. Set one up with `/setdata`!");

        }

        //Save the strike type, reason, and date
        await database.push(`${interaction.guild.id}_${user.id}_punishments`, { type: "Strike", reason: interaction.options.getString("reason"), date: new Date() });


        //Wrap up to mod that they were given a strike
        interaction.reply({
            content: `User ${interaction.options.getUser("user")} successfully struck with reason \`${interaction.options.getString("reason")}\``,
            ephemeral: true
        });

        //Log the warning to the staff chat
        await modChannel.send({
            content: `:triangular_flag_on_post: **${interaction.user.tag}** has performed action: \`strike\`\n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Reason:\` ${interaction.options.getString("reason")}`
        });

        //Attempt to DM the person warned
        try {
            await interaction.options.getUser("user").send({
                content: `**You have received a new strike.**\n\`Guild:\` ${interaction.guild} \n\`Reason:\` ${interaction.options.getString("reason")}\n\`Date:\` ${new Date()}`
            });
        } catch (e) {
            //Oh, no! Well, we can't DM them... so we log nothing!
        }

    }
}