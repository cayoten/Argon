module.exports = {
    name: "guildMemberAdd",
    async execute(member) {

        //Define channel for the below line
        let channel = member.client.dataStorage.serverData;

        //Attempt to grab jlChannel from database
        try {

            //Define chatChannel
            let chatChannel = member.guild.channels.cache.get(channel[member.guild.id]["jlChannel"]);

            //Log and send
            await chatChannel.send({content: `➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`});

        } catch (e) {

            //No join leave channel!
        }
    }
}