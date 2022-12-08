require("dotenv").config();
const fs = require("fs");

const {Client, GatewayIntentBits, Collection, PermissionsBitField} = require("discord.js");


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

const AntiSpam = require("discord-anti-spam");
const antiSpam = new AntiSpam({
    warnThreshold: 4, // Amount of messages sent in a row that will cause a warning.
    muteThreshold: 6, // Amount of messages sent in a row that will cause a mute.
    kickThreshold: 8, // Amount of messages sent in a row that will cause a kick.
    banThreshold: 12, // Amount of messages sent in a row that will cause a ban.
    warnMessage: "{@user}, please stop spamming!", // Message sent in the channel when a user is warned.
    muteMessage: "**{user_tag}** has been muted for spamming.", // Message sent in the channel when a user is muted.
    kickMessage: "**{user_tag}** has been kicked for spamming.", // Message sent in the channel when a user is kicked.
    banMessage: "**{user_tag}** has been banned for spamming.", // Message sent in the channel when a user is banned.
    unMuteTime: 60, // Time in minutes before the user will be able to send messages again.
    verbose: true, // Whether to log every action in the console.
    removeMessages: true, // Whether to remove all messages sent by the user.
    ignoreBots: true, //Whether to ignore bots sending messages
    ignoredPermissions: [PermissionsBitField.Flags.ManageMessages], // If the user has the following permissions, ignore him.
    banEnabled: false //Custom flag, disabling the ban feature
    // For more options, see the documentation:
});

// Trigger antispam
client.on("messageCreate", async function (message) {

    // discord-anti-spam check
    antiSpam.message(message);
});

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