const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextInputStyle,
    ModalBuilder,
    TextInputBuilder, PermissionsBitField
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Start the verification process"),

    async execute(interaction) {

        //Database setup (memberRole, restrictedRole, gatekeeperChannel, and questions

        //Define the member role as set in the Database
        let memberRole = await database.get(`${interaction.guild.id}.memberRole`);

        //If there isn't a member role, return
        if (memberRole == null) {
            return interaction.reply({
                content: "There isn't a member role set. Alert a staff about this!",
                ephemeral: true
            });
        }

        //Define the member role as set in the Database
        let restrictedRole = await database.get(`${interaction.guild.id}.restrictedRole`);

        //If there isn't a member role, return
        if (restrictedRole == null) {
            return interaction.reply({
                content: "There isn't a restricted role set. Alert a staff about this!",
                ephemeral: true
            });
        }

        //Set up gatekeeperChannel
        let gatekeeperChannel = interaction.guild.channels.cache.get(await database.get(`${interaction.guild.id}.gatekeeperChannel`));

        //If gatekeeperChannel doesn't exist...
        if (gatekeeperChannel == null) {

            return interaction.reply({
                content: "Missing channel data. Alert a staff about this!",
                ephemeral: true
            });

        }

        //The verification questions
        let questions = await database.get(`${interaction.guild.id}.verifyQuestions`);

        //If gatekeeperChannel doesn't exist...
        if (questions == null) {

            return interaction.reply({
                content: "Missing verification questions. Alert a staff about this!",
                ephemeral: true
            });

        }

        //Check if they're verified, and if so, return
        if (interaction.member.roles.cache.has(memberRole)) {
            return interaction.reply({
                content: "You're already verified!",
                ephemeral: true
            })
        }

        //Modal handling

        //Define a random string of letters & numbers to match an ID for verification
        let gatewayId = Math.random().toString(36).slice(2);

        //Create the modal
        const verifyModal = new ModalBuilder()
            .setCustomId(`gateway-${gatewayId}`)
            .setTitle(`Gateway for ${interaction.guild.name}`);

        //Define an empty array for the below code
        let countVal = 1;

        //For the amount, send a question & get response
        for (const question of questions.split('\\n')) {

            // Create the text input components
            verifyModal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder()
                .setCustomId(`Question ${countVal}`)
                // The label is the prompt the user sees for this input
                .setLabel(question)
                // Short means only a single line of text
                .setStyle(TextInputStyle.Short)
            ));

            //Add a +1 to the countVal so that it displays as "Question 1, Question 2", etc.
            countVal++;

        }

        //Send the Modal to the verifying user
        interaction.showModal(verifyModal);

        //Wait for them to finish with a 2 minute (120 second) timeout
        let modalData = await interaction.awaitModalSubmit({time: 120_000})
            .catch(() => null);

        //If there is no data within the time set above, return
        if (!modalData) {
            return interaction.followUp({
                content: "Your verification has timed out. Please try again!",
                ephemeral: true
            })
        }

        //If the data WAS received, continue on & reply that we've gotten it!
        await modalData.reply({
            content: "Verification received. We'll get back to you shortly!",
            ephemeral: true
        });


        //Embed handling

        //The URL to slice the discord profile photo into
        const merge = "https://images.google.com/searchbyimage?image_url=";

        //Create an empty embed for the questions
        const message1 = new EmbedBuilder()
            .setTitle(`New Verification Received!`)
            .setDescription(`[**Avatar Reverse Image Search**](${merge + interaction.user.displayAvatarURL()})`)
            .addFields({
                name: `Gateway Modal ID`,
                value: gatewayId
            })
            .addFields({
                name: `Username`,
                value: `<@${interaction.user.id}> - ${interaction.user.tag}`
            })
            // this is for the embed builder
            .addFields(...modalData.fields.fields.map(
                ({customId, value}) => ({name: customId, value}))
            )
            .setThumbnail(interaction.user.displayAvatarURL())

        //Button assembly

        //Create the buttons
        const row = new ActionRowBuilder()
            .addComponents(
                //Approval button
                new ButtonBuilder()
                    .setCustomId(`approve-${interaction.user.id}`)
                    .setLabel('Approve')
                    .setStyle(ButtonStyle.Success),

                //Restriction button
                new ButtonBuilder()
                    .setCustomId(`restrict-${interaction.user.id}`)
                    .setLabel('Restrict')
                    .setStyle(ButtonStyle.Primary),

                //Decline (Kick) button
                new ButtonBuilder()
                    .setCustomId(`decline-${interaction.user.id}`)
                    .setLabel('Decline')
                    .setStyle(ButtonStyle.Danger),

                //Cancel button
                new ButtonBuilder()
                    .setCustomId(`cancel-${interaction.user.id}`)
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary),
            );

        //Set up gatekeeperPrompt variable for buttons, successfully send verification, and delete thread
        const gatekeeperPrompt = await gatekeeperChannel.send({embeds: [message1], components: [row]})

        //Button items, 7 days to respond
        const buttonCollector = gatekeeperPrompt.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 604800000
        });

        //Handle buttons being pressed

        //Do X thing on Y button
        buttonCollector.on('collect', async i => {

            //No perms? Get out of here. (Decline perms)
            if (!i.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                await i.deferUpdate();
                return;
            }

            //Approve a member
            if (i.customId === `approve-${interaction.user.id}`) {

                //Stop the buttons first
                await buttonCollector.stop();

                //Then delete the embed
                await gatekeeperPrompt.delete();

                try {

                    //Add the member role
                    await (interaction.member.roles.add(memberRole));

                    //Send a temporary approval message
                    await gatekeeperChannel.send(`Gateway \`${gatewayId}\` approved with parameters \`none\`.`)
                        .then(m => setTimeout(() => m.delete(), 5000));

                    //Finally, return & log the action
                    return gatekeeperChannel.send({content: `:wave: **${i.user.tag}** (*${i.user.id}*) has performed gateway action: \`approve\` \n \`Affected User\`: **${interaction.user.tag}** (*${interaction.user.id}*)`})
                } catch (e) {

                    //There's a problem - just cancel it.
                    return gatekeeperChannel.send(`Failed - Gateway \`${gatewayId}\` has been closed.`)
                        .then(m => setTimeout(() => m.delete(), 5000));

                }
            }

            //Restrict them and approve
            if (i.customId === `restrict-${interaction.user.id}`) {

                //Stop the buttons first
                await buttonCollector.stop();

                //Then delete the embed
                await gatekeeperPrompt.delete();

                try {

                    //Add a restricted role
                    await interaction.member.roles.add(restrictedRole);

                    //Add the member role
                    await (interaction.member.roles.add(memberRole));

                    //Send a temporary approval message
                    await gatekeeperChannel.send(`Gateway \`${gatewayId}\` approved with parameters \`restrict\`.`)
                        .then(m => setTimeout(() => m.delete(), 5000));

                    //Finally, return & log the action
                    return gatekeeperChannel.send({content: `:lock: **${i.user.tag}** (*${i.user.id}*) has performed gateway action: \`restrict and approve\` \n \`Affected User\`: **${interaction.user.tag}** (*${interaction.user.id}*)`})
                } catch (e) {

                    //There's a problem - just cancel it.
                    return gatekeeperChannel.send(`Failed - Gateway \`${gatewayId}\` has been closed.`)
                        .then(m => setTimeout(() => m.delete(), 5000));

                }
            }

            //Decline the member
            if (i.customId === `decline-${interaction.user.id}`) {

                //Stop the buttons first
                await buttonCollector.stop();

                //Then delete the embed
                await gatekeeperPrompt.delete();

                try {

                    //Kick the user
                    await interaction.member.kick({reason: `[Argon] Gatekeeper: Declined Gateway ${gatewayId}`});

                    //Send a temporary decline message
                    await gatekeeperChannel.send(`Gateway \`${gatewayId}\` declined.`).then(m => setTimeout(() => m.delete(), 5000));

                    //Finally, return & log the action
                    return gatekeeperChannel.send({content: `:boot: **${i.user.tag}** (*${i.user.id}*) has performed gateway action: \`decline\` \n \`Affected User\`: **${interaction.user.tag}** (*${interaction.user.id}*)`})
                } catch (e) {

                    //There's a problem - just cancel it.
                    return gatekeeperChannel.send(`Failed - Gateway \`${gatewayId}\` has been closed.`)
                        .then(m => setTimeout(() => m.delete(), 5000));
                }
            }

            //Cancel the embed
            if (i.customId === `cancel-${interaction.user.id}`) {

                //Stop the buttons first
                await buttonCollector.stop();

                //Then delete the embed
                await gatekeeperPrompt.delete();

                //Finally, say it closed
                return gatekeeperChannel.send(`Cancelled - Gateway \`${gatewayId}\` has been closed.`)
            }
        })
    }
}