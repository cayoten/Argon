const {REST} = require("@discordjs/rest");
const {Routes, ActivityType} = require("discord-api-types/v9");
require("dotenv").config();

module.exports = {
    name: "ready",
    once: true,
    execute(client) {

        //Log that the bot is up
        console.log("Argon is online.");

        //Sets the bot activity
        client.user.setActivity('the chat.', {type: ActivityType.Watching});

        //Define Client ID
        const CLIENT_ID = client.user.id;

        //Create rest API to log in with slash commands
        const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

        (async () => {
            try {

                //If .ENV has a VERSION="production" entry
                if (process.env.VERSION === "production") {

                    //If it is production, create the commands globally
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: client.commands.map(item => item.data.toJSON())
                    });

                    //Return that global was successful
                    console.log("Successfully registered commands globally.")
                } else {

                    //If there was not a VERSION="production" entry, create the commands locally using GUILD_ID=<guildID> in .ENV
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: client.commands.map(item => item.data.toJSON())
                    });

                    //Log that local was successful
                    console.log("Successfully registered commands locally.")
                }
            } catch (err) {
                console.error(err);
            }
        })();

        //When banning someone, if it isn't permanent, this is the scheduled timer to unban them
        setInterval(async () => {

            //Written by Zelak#1444 from Plexi Development, they are lifesavers - https://discord.gg/plexidev

            const allServersBans = (await database.all()).filter(element => element.id.endsWith("_bans"));

            for (let allServersBan of allServersBans) {
                // get id from key
                // split at _ so the key goes from "<guild_id>_bans" to ["<guild_id>", "bans"]
                // take the first element in the array which is the guild_id
                const guildID = allServersBan.id.split("_")[0];
                // now you can loop over all the bans you pushed for this element with the `value` property
                for (let ban of allServersBan.value) {
                    // here you can check for the time
                    if (Date.now() > ban.time) {
                        // unban is due
                        // get the guild from d.js client
                        const guild = client.guilds.cache.get(guildID);
                        if (guild) {
                            await guild.members.unban(ban.user);
                            // Don't forget to remove the ban with pull
                            // you can do this by matching the element.user from pull
                            // with the ban.user
                            await database.pull(`${guildID}_bans`, el => el.user === ban.user)
                        }
                    }
                }
            }
        }, 60 * 1000)
    }
}