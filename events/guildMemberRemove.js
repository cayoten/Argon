module.exports = {
    name: "guildMemberRemove",
    async execute(member) {

        //Define channel for the below line
        let channel = member.guild.channels.cache.get(await database.get(`${member.guild.id}.jlChannel`));

        //If there isn't a channel in the DB, return
        if (channel == null) {
            return;
        }

        //Log and send
        await channel.send({content: `➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`});

    }
}