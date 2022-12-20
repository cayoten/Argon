require("dotenv").config();
const fs = require("fs");

const {Client, GatewayIntentBits, Collection} = require("discord.js");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    // partials: [] - We got none! If so, define "Partials" in require discord.js
});

//Attempt GuildStorage using QuickDB
const {QuickDB} = require("quick.db");
global.database = new QuickDB();

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

process.on(`uncaughtException`, (err) => {
    const errMsg = err.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`);

    //Sentry.captureException(err);
    console.error(`Uncaught Exception: `, errMsg);

});
process.on(`unhandledRejection`, err => {

    //Sentry.captureException(err);
    console.error(`Uncaught Promise Error: `, err);

});

//Finally, login
client.login(process.env.TOKEN);