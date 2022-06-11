const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
require("dotenv").config();

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log("Nuclear is online.");

        const CLIENT_ID = client.user.id;
        const rest = new REST({version: "9"}).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (process.env.VERSION === "production") {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: client.commands.map(item => item.data.toJSON())
                    });
                    console.log("Successfully registered commands globally.")
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: client.commands.map(item => item.data.toJSON())
                    });
                    console.log("Successfully registered commands locally.")
                }
            } catch (err) {
                console.error(err);
            }
        })();


        setInterval(() => {
            for (const guildId in client.dataStorage.bans) {
                if (client.dataStorage.bans.hasOwnProperty(guildId)) {
                    const users = client.dataStorage.bans[guildId];
                    for (const userId in users) {
                        if (users.hasOwnProperty(userId)) {
                            const banTime = users[userId];
                            if (Date.now() > banTime) {
                                // Remove expired bans
                                client.dataStorage.removeBan(userId, guildId);
                                let guild = client.guilds.cache.get(guildId);
                                if (guild) {
                                    guild.members.unban(userId);

                                }
                            }
                        }
                    }
                }
            }
        }, 60)
    }
}