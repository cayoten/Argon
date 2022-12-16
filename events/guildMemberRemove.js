const {AuditLogEvent} = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {

        //Define channel & modChannel for the below code
        let jlChannel = member.guild.channels.cache.get(await database.get(`${member.guild.id}.jlChannel`));
        let modChannel = member.guild.channels.cache.get(await database.get(`${member.guild.id}.modChannel`));

        //If there isn't a channel in the DB, return
        if (jlChannel == null) return;

        //Log and send
        await jlChannel.send({content: `➖ ${member} (**${member.user.tag}**) has left. (${member.guild.memberCount}M)`});

        //Check if someone was kicked

        //First, if the mod channel is nothing, return
        if (modChannel == null) return;

        //Define logs to member kick
        let logs = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberKick});

        //Obtain the amount of kicks (1)
        let entries = [...logs.entries.values()];

        //Set empty log
        let foundLog;

        //For each value...
        for (let i = 0; i < entries.length; i++) {

            //Set log to index
            let log = entries[i];

            //If there was NOT a kick made by Argon in the past little while, set it
            if (15000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
                foundLog = log;
            }
        }

        //Hurrah! A kick was found.
        if (foundLog) {

            //Send message.
            await modChannel.send({content: `\`[Audit Log]\` :boot: **${foundLog.executor.tag}** has performed action: \`kick\` \n\`Affected User:\` **${foundLog.target.tag}** *(${foundLog.target.id})* \n\`Reason:\` ${foundLog.reason ?? "No reason specified"}`});

        }

        //Check if someone was banned
        let logsBan = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberBanAdd});

        //Check latest values
        let entriesBan = [...logsBan.entries.values()];

        //Set foundBan to empty
        let foundBan;
        for (let i = 0; i < entriesBan.length; i++) {

            //Set log to index
            let log = entriesBan[i];

            //If there was NOT a ban made by Argon in the past little while, set it
            if (30000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
                foundBan = log;
            }
        }

        //Hurrah! A ban was found.
        if (foundBan) {

            //Send message
            await modChannel.send({content: `\`[Audit Log]\` :hammer: **${foundBan.executor.tag}** has performed action: \`ban\` \n\`Affected User:\` **${foundBan.target.tag}** *(${foundBan.target.id})* \n\`Reason:\` ${foundBan.reason ?? "No reason specified"}`});
        }
    }
}