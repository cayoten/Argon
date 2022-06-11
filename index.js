require("dotenv").config();
const fs = require("fs");

const {Client, Intents, Collection} = require("discord.js");


const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

//3rd attempt at a sufficient data storage solution... shoot me
const DataStorage = require('./lib/dataStorage.js');
client.dataStorage = new DataStorage(client)

//Create empty command collection
client.commands = new Collection();

//Command Handler
fs.readdirSync("./commands").forEach(folder => {
    const command_folder = fs.readdirSync(`./commands/${folder}/`).filter((file) => file.endsWith(".js"));
    // console.log(command_folder);

//Handle them itself
    for (const file of command_folder) {
        const command = require(`./commands/${folder}/${file}`)
        client.commands.set(command.data.name, command);
        // console.log(command)
    }
});

//Event handler
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

//Register the events
for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) { // If you only run once
        client.once(event.name, (...args) => event.execute(...args, client));
    } else { // If it isn't ran only once
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

//Finally, login
client.login(process.env.TOKEN);