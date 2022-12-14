const {AuditLogEvent} = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {

        //Define channel & modChannel for the below code
        let jlChannel = member.guild.channels.cache.get(await database.get(`${member.guild.id}.jlChannel`));
        let modChannel = member.guild.channels.cache.get(await database.get(`${member.guild.id}.modChannel`));

        //If there isn't a channel in the DB, return
        if (jlChannel == null) {
            return;
        }

        if (modChannel == null) {
            return;
        }

        //Check if someone was kicked
        let logs = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberKick});
        let entries = [...logs.entries.values()];
        let foundLog;
        for (let i = 0; i < entries.length; i++) {
            let log = entries[i];
            if (15000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
                foundLog = log;
            }
        }
        if (foundLog) {

            await modChannel.send({content: `\`[Audit Log]\` :boot: **${foundLog.executor.tag}** has performed action: \`kick\` \n\`Affected User:\` **${foundLog.target.tag}** *(${foundLog.target.id})* \n\`Reason:\` ${foundLog.reason ?? "No reason specified"}`});

        }

        //Check if someone was banned

        //Check for memberBanAdd
        let logsBan = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberBanAdd});

        //Check latest values

        let entriesBan = [...logsBan.entries.values()];

        //Set foundBan to empty
        let foundBan;
        for (let i = 0; i < entriesBan.length; i++) {
            let log = entriesBan[i];
            if (30000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
                foundBan = log;
            }
        }
        if (foundBan) {
            await modChannel.send({content: `\`[Audit Log]\` :hammer: **${foundBan.executor.tag}** has performed action: \`ban\` \n\`Affected User:\` **${foundBan.target.tag}** *(${foundBan.target.id})* \n\`Reason:\` ${foundBan.reason ?? "No reason specified"}`});
        }

        // //Log and send
        // await jlChannel.send({content: `➖ ${member} (**${member.user.tag}**) has left. (${member.guild.memberCount}M)`});
        //
        // //Kick logging, courtesy to DiscordJS.guide
        //
        // //Look for MemberKick event but only check one
        // const fetchedKickLogs = await member.guild.fetchAuditLogs({
        //     limit: 1,
        //     type: AuditLogEvent.MemberKick,
        // });
        //
        // // Since there's only 1 audit log entry in this collection, grab the first one
        // const kickLog = fetchedKickLogs.entries.first();
        //
        // // Now grab the user object of the person who kicked the member, while lso grabbing the target of this action to double-check things
        // const {executor, target} = kickLog;
        //
        // // Update the output with a bit more information
        // // Also run a check to make sure that the log returned was for the same kicked member
        // if (target.id === member.id) {
        //     modChannel.send({
        //         content: `\`[Audit Logs]\` :boot: **${executor.tag}** has performed action: \`kick\` \n\`Affected User:\` **${member.user.tag}** *(${member.user.id})* \n\`Reason:\` ${kickLog.reason ?? "No reason specified."}`
        //     });
        // }
    }
}