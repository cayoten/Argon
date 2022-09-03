const {SlashCommandBuilder, PermissionsBitField} = require("discord.js");
const utils = require("../../lib/utils.js")

const ms = require("ms");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("strike")
        .setDescription("Strikes a user with a set reason")
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

        //Check if they're able to use the command
        if (!utils.checkPermissionAndNotify(interaction.member, interaction, PermissionsBitField.Flags.ManageMessages))
            return;

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

        //Create the users DB and define "user"
        // const users = new db.table("users");
        //
        //Give them their own table if they don't hav eone
        // if (!users.has(`${user.id}`)) {
        //     users.set(`${user.id}`, {punishCheck: []});
        // }

        //Define what strikes is
        let strikes = interaction.client.dataStorage.strikes;

        //If strikes DB doesn't exist, make one
        if (!strikes[interaction.guild.id]) strikes[interaction.guild.id] = {};

        //If strikes for that user doesn't exist, give them an empty array
        if (!strikes[interaction.guild.id][user.id]) strikes[interaction.guild.id][user.id] = []

        //Mod logging channel fetch

        let modChannel;
        try {
            modChannel = interaction.guild.channels.cache.get(interaction.client.dataStorage.serverData[interaction.guild.id]["modChannel"]);
        } catch (e) {

        //Do nothing if there isn't a channel
            return interaction.reply({
                content: `Interaction FAILED due to reason: \`No logging channel\``,
                ephemeral: true
            });

        }

        //Store the warning

        await strikes[interaction.guild.id][user.id].push(interaction.options.getString("reason"));
        await interaction.client.dataStorage.saveData();
        // users.push(`${user.id}.punishCheck`, `STRIKE: ${interaction.options.getString("reason")}`);

        //Alert that they were given a strike
        interaction.reply({
            content: `User ${interaction.options.getUser("user")} successfully struck with reason \`${interaction.options.getString("reason")}\``,
            ephemeral: true
        });

        //Log the warning
        await modChannel.send({
            content: `:triangular_flag_on_post: **${interaction.user.tag}** has performed action: \`strike\`\n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Reason:\` ${interaction.options.getString("reason")}`
        });

        //Attempt to DM the person warned
        try {
            await interaction.options.getUser("user").send({
                content: `__**New Strike Received**__ \n
                 You have been given a strike for the reason: **${interaction.options.getString("reason")}**`
            });
        } catch (e) {
            //Oh, no! Well, we can't DM them... so we log nothing!
        }

        //Automated actions on X strikes

        //Define the strike amount
        let strikeAmt = strikes[interaction.guild.id][user.id].length;

        //Define member
        let member = interaction.options.getMember("user")


        //Actions on X warns.
        if (strikeAmt === 2) {

            //Alert the member of the action being taken
            await member.send("[Automatic Punishment] You have been muted for 30 minutes due to reaching 2 strikes.")

            //Mute the member
            await member.disableCommunicationUntil(Date.now() + ms("30 minutes"), "2 strikes reached.")

            //Log the action
            await modChannel.send({content: ` :no_mouth: [Auto] Performed action: \`timeout\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Duration:\` 30m \n\`Reason:\` 2 strikes reached.`});

        } else if (strikeAmt === 3) {

            //Alert the member of the action being taken
            await member.send("[Automatic Punishment] You have been muted for 2 hours due to reaching 3 strikes.")

            //Mute the member
            await member.disableCommunicationUntil(Date.now() + ms("2 hours"), "3 strikes reached.")

            //Log the action
            await modChannel.send({content: `:no_mouth: [Auto] Performed action: \`timeout\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Duration:\` 2h \n\`Reason:\` 3 strikes reached.`});

        } else if (strikeAmt === 4) {

            //Alert the member of the action being taken
            await member.send("[Automatic Punishment] You have been kicked from the server for reaching **4** strikes.");

            //Kick the member
            await member.kick(interaction.options.getString("reason"));

            //Log the action
            await modChannel.send({content: `:boot: [Auto] Performed action: \`kick\` \n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})*`});

        } else if (strikeAmt === 5) {

            //Alert the member of the action being taken
            await member.send({content: "------------------------------\n⚠ __**Automated Alert**__ ⚠\n------------------------------\nYou are on your **fifth** strike. Your next strike will result in an automatic ban."})

            //Log the action
            await modChannel.send({content: `‼ The user **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* has reached **5/6** strikes. Their next strike is an automatic ban.`,})

        } else if (strikeAmt >= 6) {

            //Alert the member of the action being taken
            await member.send("[Automatic Punishment] You have been banned from the server for reaching **6** strikes.");

            //Ban the user
            await interaction.options.getUser("user").ban(interaction.options.getUser("user"), {reason: interaction.options.getString("reason")});

            //Log the action
            await modChannel.send({content: `:hammer: [Auto] Performed action: \`ban\`\n\`Affected User:\` **${interaction.options.getUser("user").tag}** *(${interaction.options.getUser("user").id})* \n\`Reason:\` 6 strikes reached.`,});

        }
    }
}