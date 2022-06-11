const Discord = require("discord.js");
// const streamBuffers = require('stream-buffers');

/**
 * A set of utility functions for general uses.
 * @author juanmuscaria <juanmuscaria@gmail.com>
 */
class Utils {

    /**
     * Check if a guild member has some permission
     * and send a message if the user does not have one of the permissions.
     * @param {Discord.GuildMember} member the guild member to verify the permissions.
     * @param {Discord.CommandInteraction} interaction the channel to send the message.
     * @param  {...bigint} permissions the permissions to check.
     * @returns {boolean} returns true if the member has all listed permissions.
     */

    static checkPermissionAndNotify(member, interaction, ...permissions) {
        if (permissions.length === 0) {
            throw "permissions cannot be empty!";
        } //in case someone forgot to actually put permissions to check.
        for (const permission of permissions) {
            if (!member.permissions.has(permission)) {
                // I know this is not the ideal way to get the string of a permission, but I don't think there's any better way - juan
                interaction.reply({
                    content: `You do not have the required permission \`${Object.keys(Discord.Permissions.FLAGS).find(key => Discord.Permissions.FLAGS[key] === permission)}\`.`,
                    ephemeral: true})
                return false;
            }
        }

        return true;
    }

    /**
     * Split an array into smaller arrays with the specified chunk size
     *
     * @param {[]} array original array.
     * @param {number} chunkSize the max size of each smaller array.
     * @returns {[]} an array of chunks from the original array.
     */
    static chunksOf(array, chunkSize) {
        let chunkArray = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunkArray.push(array.slice(i, i + chunkSize));
        }
        return chunkArray;
    }
}

module.exports = Utils;