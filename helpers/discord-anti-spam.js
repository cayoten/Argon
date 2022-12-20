const AntiSpam = require("discord-anti-spam");
const {PermissionsBitField} = require("discord.js");

//Initialize Anti-Spam for message filtering in messageCreate.js
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

//Export the Anti-Spam module for messageCreate.js
exports.antiSpam = antiSpam;