module.exports = {
    name: "guildMemberRemove",
    async execute(member) {

        //Attempt to grab jlChannel from database
        try {
            //Define channel for the below line
            let channel = member.guild.channels.cache.get(await database.get(`${member.guild.id}.jlChannel`));

            if (channel == null) {
                return;
            }

            //Log and send
            await channel.send({content: `➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`});

        } catch (e) {

            //No join leave channel!
        }
    }
}