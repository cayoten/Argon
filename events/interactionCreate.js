module.exports = {

    name: "interactionCreate",

    async execute(interaction) {

        //If it's not a command, cancel
        if (!interaction.isCommand()) return;

        //Check if there's a command
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        //Try to execute the command
        try {
            await command.execute(interaction);
        } catch (err) {
            if (err) console.error(err);

            //Respond if there is an error (set to editReply since every most files will defer at start)
            try {
                await interaction.reply({
                    content: "An error occurred and the command could not be completed."
                });
            } catch (e) {
                await interaction.editReply({
                    content: "An error occurred and the command could not be completed."
                });
            }

        }
    }
}